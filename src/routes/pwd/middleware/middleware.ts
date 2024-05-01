import { RequestHandler, Request, Response, NextFunction } from "express"
import { APIResponse, isPwdRequestObject } from "../../../model/pwd"

export const validateAuthObj: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    if (isPwdRequestObject(request.body) === false) {
        return response.status(400).json({ message: "No valid Request body" } as APIResponse)
    }

    next()
}