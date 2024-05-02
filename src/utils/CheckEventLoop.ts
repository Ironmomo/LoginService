import { RequestHandler, Request, Response, NextFunction } from "express"
import { APIResponse } from "../model/pwd"
import toobusy from "toobusy-js"

/**
 * Middleware to check the response time of the event loop.
 * If the event loop is too busy, it responds with a 503 status code.
 * Otherwise, it passes the request to the next middleware.
 */
export const checkEventLoopResponseTime: RequestHandler = (req: Request , res: Response, next: NextFunction) => {
    if (toobusy()) {
        res.status(503).json({ message: "Too busy. Can't handle request"} as APIResponse)
    } else {
        next()
    }
}