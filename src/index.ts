import express from "express"
import { Request, Response } from "express" 
// read .env
import dotenv from "dotenv"
dotenv.config()

import userpwdRouter from "./routes/pwd"
import { errorHandler } from "./Error/ErrorHandler"

// Initialize express and set port
const app = express()
const port = process.env.PORT || 5500

// Set middleware functions

// Set router
app.use('/pwd', userpwdRouter)

// Error Handler
app.use(errorHandler)

app.get('/', (request: Request, response: Response) => {
    console.log(request.body)
    response.sendStatus(200)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})