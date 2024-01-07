import express from 'express'
import { authRouter } from './auth/authController.js'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
    res.send({message: "Hi from ts"})
})

app.use("/auth", authRouter)

export { app }