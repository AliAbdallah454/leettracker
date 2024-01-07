import { Request, Response } from "express"
import bcrypt from 'bcrypt'

import { UserInfo, UserLoginDto, UserSignupDto } from "./dto/userDto.js"
import { promisePool } from "../db.js"

const login = async (req: Request, res: Response) => {
    try{
        const loginInfo: UserLoginDto = req.body
        const [rows, fields] = await promisePool.query("SELECT * FROM users WHERE user_name = ?", [loginInfo.userName])
        const typedRows = rows as UserInfo[];

        if(typedRows.length > 0){
            const userInfo: UserInfo = typedRows[0]
            const match = await bcrypt.compare(loginInfo.password, userInfo.password)
        
            if(match){
                return res.json({message: "Access granted"})
            }
            else{
                return res.json({message: "Password is incorrect"})
            }
        }
        else{
            return res.json({message: "No user found"})
        }
    }
    catch(err){
        console.log(err)
        return res.json({err})
    }
}

const signup = async (req: Request, res: Response) => {
    try{
        let signupInfo: UserSignupDto = req.body
        
        let [rows, fields] = await promisePool.query("SELECT * FROM users WHERE user_name = ?", [signupInfo.userName]) 
        if((rows as Array<any>).length != 0){
            return res.send("UserName already Exists")
        }

        [rows, fields] = await promisePool.query("SELECT * FROM users WHERE email = ?", [signupInfo.email]) 
        if((rows as Array<any>).length != 0){
            return res.send("Email already Exists")
        }

        const saltRounds = 5
        const hashedPassword = bcrypt.hashSync(signupInfo.password, saltRounds)
        await promisePool.execute("INSERT INTO users(user_name, email, password) VALUES (?, ?, ?)", [signupInfo.userName, signupInfo.email, hashedPassword])
        return res.json({...signupInfo, password: hashedPassword})
    }
    catch(err){
        console.log(err)
        return res.json({err})
    }
}

export {
    login,
    signup
}