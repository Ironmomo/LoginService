import { RequestHandler, Request, Response, NextFunction } from "express"
import { authenticate as userAuth } from "../service/service"
import { APIResponse } from "../../../model/pwd"
import { sleep } from "../../../utils/utils"

const MIN_FAILED_RESPONSE_TIME = 450

export const authenticate: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // TODO MAKE FAILED PWD AND FAILED USERNAME RESPONSE DURATION SAME
        const startTime = new Date().getTime()
        // Authenticate
        const authValidation = await userAuth(request.body.username, request.body.password)
        // Valid
        if (authValidation.status === true) return response.status(200).json({ message: "Valid" } as APIResponse)
        // Invalid
        // Enforce minumum Responsetime to prevent reasoning about failed authentication
        await enforceResponseTime(startTime)

        if (authValidation.message === "Error") return response.status(500).json({ message: "Server Side Error happend. We are working on it!" } as APIResponse)
        if (authValidation.status === false && authValidation.message === "Tried too many times") return response.status(400).json({ message: authValidation.message } as APIResponse)
        if (authValidation.status === false && (authValidation.message === "Password compared" || authValidation.message === "No valid user")) return response.status(400).json({ message: "Invalid Username or Password" } as APIResponse)
    } catch (error) {
        // Forward unhandled Error to Errorhandler
        next(error)
    }
}

async function enforceResponseTime(startTime: number): Promise<void> {
    // Check time passed for validation
    const duration = new Date().getTime() - startTime
    // Enforce minimum duration of response to prevent reasoning about failed authentication
    if (duration <= MIN_FAILED_RESPONSE_TIME) await sleep(MIN_FAILED_RESPONSE_TIME - duration)
}