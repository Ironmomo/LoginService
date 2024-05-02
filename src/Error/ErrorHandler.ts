import { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import { APIResponse } from "../model/pwd"

export const errorHandler: ErrorRequestHandler = async (error ,request: Request, response: Response, next: NextFunction) => {
    console.error(error.stack)
    return response.status(500).json({ message: "Error happend! We are working on it!"} as APIResponse)
}