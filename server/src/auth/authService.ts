import { Request, Response } from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { UserInfo, UserLoginDto, UserSignupDto } from "./dto/userDto.js"
import { promisePool } from "../db.js"
import { AuthResponse } from './authResponse.js'

import env from 'dotenv'
env.config()

const login = async (req: Request, res: Response) => {
    try{
        const loginInfo: UserLoginDto = req.body
        const [rows, fields] = await promisePool.query("SELECT * FROM users WHERE user_name = ?", [loginInfo.userName])
        const typedRows = rows as UserInfo[];

        if(typedRows.length > 0){
            const userInfo: UserInfo = typedRows[0]
            const match = await bcrypt.compare(loginInfo.password, userInfo.password)
            
            if(match){
                const token = jwt.sign(userInfo, process.env.JWT_KEY)
                res.cookie("jwt", token)
                const authResponse: AuthResponse = {
                    message: "Access granted",
                    status: "ok",
                    code: 200
                }
                return res.send(authResponse)
            }
            else{
                const authResponse: AuthResponse = {
                    message: "Password is incorrect",
                    status: "failed",
                    code: 403
                }
                return res.send(authResponse)
            }
        }
        else{
            const authResponse: AuthResponse = {
                message: "username is incorrect",
                status: "failed",
                code: 403
            }
            return res.send(authResponse)
        }
    }
    catch(err){
        const authResponse: AuthResponse = {
            message: err.message,
            status: "failed",
            code: 500
        }
        return res.send(authResponse)
    }
}

const signup = async (req: Request, res: Response) => {
    try{
        let signupInfo: UserSignupDto = req.body
        
        let [rows, fields] = await promisePool.query("SELECT * FROM users WHERE user_name = ?", [signupInfo.userName]) 
        if((rows as Array<any>).length != 0){
            const authResponse: AuthResponse = {
                message: "UserName already Exists",
                status: "failed",
                code: 500
            }
            return res.send(authResponse)
        }

        [rows, fields] = await promisePool.query("SELECT * FROM users WHERE email = ?", [signupInfo.email]) 
        if((rows as Array<any>).length != 0){
            const authResponse: AuthResponse = {
                message: "Email already Exists",
                status: "failed",
                code: 500
            }
            return res.send(authResponse)
        }

        const saltRounds = 5
        const hashedPassword = bcrypt.hashSync(signupInfo.password, saltRounds)
        await promisePool.execute("INSERT INTO users(user_name, email, password) VALUES (?, ?, ?)", [signupInfo.userName, signupInfo.email, hashedPassword])
        
        const authResponse: AuthResponse = {
            message: "Account created",
            status: "ok",
            code: 200
        }
        return res.send(authResponse)
    }
    catch(err){
        console.log(err)
        const authResponse: AuthResponse = {
            message: err.message,
            status: "failed",
            code: 500
        }
        return res.send(authResponse)
    }
}

export {
    login,
    signup
}