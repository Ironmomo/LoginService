import express from "express"
import { Request, Response } from "express" 
import userpwdRouter from "./routes/pwd"
import { errorHandler } from "./Error/ErrorHandler"
import getInstance from "./db/sql/SQLDBConnector"
import toobusy from "toobusy-js"
import { checkEventLoopResponseTime } from "./utils/CheckEventLoop"
import helmet from "helmet"
import config from "./config/default"

// Initialize express and set port
const app = express()

// Set middleware functions
app.use(checkEventLoopResponseTime)
app.use(helmet({
    crossOriginResourcePolicy: config.ENABLE_CORS
}))

// Set router
app.use('/pwd', userpwdRouter)

// Error Handler
app.use(errorHandler)

app.get('/', (request: Request, response: Response) => {
    console.log(request.body)
    response.sendStatus(200)
})

// Event Handling

process.on('SIGINT', function() {
    console.log("Exiting Login Service")
    getInstance().handleExit()
    toobusy.shutdown()
    process.exit()
})

process.on("uncaughtException", function(err) {
    getInstance().handleExit()
    toobusy.shutdown()
    console.error(err)
    process.exit()
})


export default app