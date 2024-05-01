import { RequestHandler, Request, Response, NextFunction } from "express"
import { APIResponse, PwdRequestObject } from "../../../model/pwd"
import User from "../../../model/user"

/**
 * Middleware function to validate the structure of authentication request objects.
 * 
 * This middleware checks if the request body matches the structure of a password request object.
 * If the request body does not match the expected structure, it sends a 400 Bad Request response
 * with a corresponding error message.
 * 
 */
export const validateAuthObj: RequestHandler = async (request: Request, response: Response, next: NextFunction) => {
    if (isPwdRequestObject(request.body) === false) {
        return response.status(400).json({ message: "No valid Request body" } as APIResponse)
    }

    next()
}


/**
 * Checks if the provided object matches the structure of a password request object.
 * 
 * A password request object is expected to have the following properties:
 * - `username`: A string representing the username.
 * - `password`: A string representing the password.
 * 
 * Additionally, both the username and password must match the respective patterns defined in the User class.
 * 
 * @param {any} obj - The object to be validated.
 * @returns {boolean} Returns true if the object matches the structure of a password request object; otherwise, returns false.
 */
function isPwdRequestObject(obj: any): obj is PwdRequestObject {

    return (
        typeof obj === 'object' &&
        obj !== null &&
        'username' in obj &&
        typeof obj.username === 'string' &&
        User.matchesUsernamePattern(obj.username) &&
        'password' in obj &&
        typeof obj.password === 'string' &&
        User.matchesPasswordPattern(obj.password) &&
        Object.keys(obj).length === 2
    )
}