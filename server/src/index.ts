import { app } from "./app.js"

import env from 'dotenv'
env.config()

app.listen(process.env.PORT, () => {
    console.log(`App is running on port ${process.env.PORT}`)
})