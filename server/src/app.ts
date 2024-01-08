import express from 'express'
import cookieParser from 'cookie-parser'
import { authRouter } from './auth/authController.js'

const app = express()

app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send({message: "Hi from ts"})
})

app.use("/auth", authRouter)

export { app }