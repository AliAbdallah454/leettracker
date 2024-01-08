import express from 'express'
import {
    login,
    signup
} from './authService.js'

import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config()

const authRouter = express.Router()

authRouter.post("/login", (req, res) => {
    login(req, res)
})

authRouter.post("/signup", (req, res) => {
    signup(req, res)
})

authRouter.get("/info", (req, res) => {
    const jwtCookie = req.cookies.jwt;
    const decodedToken = jwt.verify(jwtCookie, process.env.JWT_KEY)
    res.send(decodedToken)
})

export { authRouter }