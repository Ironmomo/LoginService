import { RequestHandler, Request, Response, NextFunction } from "express"
import { authenticate as userAuth, signup as userSignup } from "../service/service"
import { APIResponse } from "../../../model/pwd"
import { sleep } from "../../../utils/utils"

const MIN_FAILED_RESPONSE_TIME = 450

/**
 * Handles the registration process for a new user.
 */
export const register: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
        // Perform user signup with provided username and password
        const register = await userSignup(request.body.username, request.body.password)

        // On success
        if (register.status === true) return response.status(200).json({ message: `User with username: ${request.body.username} created` } as APIResponse)
        
            // On failure
        if (register.status === false) {
            if (register.message === "Error") throw new Error()
            else {
                // Enforce minimum Responsetime to slow down username bruteforcing
                await sleep(250)
                return response.status(400).json({ message: register.message} as APIResponse)
            }
        }
    } catch (error) {
        // Forward unhandled Error to Errorhandler
        next(error)
    }
}

/**
 * RequestHandler for user authentication.
 * Verifies the provided username and password and returns appropriate responses.
 */
export const authenticate: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    try {
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

/**
 * Enforces a minimum response time to prevent reasoning about failed authentication.
 * @param startTime The start time of the authentication process.
 */
async function enforceResponseTime(startTime: number): Promise<void> {
    // Check time passed for validation
    const duration = new Date().getTime() - startTime
    // Enforce minimum duration of response to prevent reasoning about failed authentication
    if (duration <= MIN_FAILED_RESPONSE_TIME) await sleep(MIN_FAILED_RESPONSE_TIME - duration)
}