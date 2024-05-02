import { SQLDBRepository } from "../../../db/sql/SQLDBRepository"
import { DBResponseObject } from "../../../db/types"
import { UserAuthMessageObject, UserSignupMessageObject } from "../../../model/pwd"
import User from "../../../model/user"

/**
 * Registers a new user with the provided username and password.
 * @param username The username for the new user.
 * @param password The password for the new user.
 * @returns A promise that resolves to a UserSignupMessageObject indicating the result of the signup process.
 */
export async function signup(username: string, password: string) {
    try {
        // Verify if the provided username and password meet the constraints
        if (!(User.matchesUsernamePattern(username) && User.matchesPasswordPattern(password))) {
            // username or password do not meet the constaints
            return {
                message: "Username or Password don't meet the constraints",
                status: false
            } as UserSignupMessageObject

        } else {
            // Check if username exists
            // Create user
            // Initialize SQL database repository
            const repository = new SQLDBRepository()
            const encrypted_pwd = await User.encryptPassword(password)

            const response = await repository.createNewUser(username, encrypted_pwd)
    
            // Check if an Error happend (e.g. username allready existing)
            if (response.status === "ERROR" && response.errorMsg.includes("Duplicate")) {
                return {
                    message: "Username exists",
                    status: false
                } as UserSignupMessageObject

            } else if(response.status === 'DATA' && response.data === 1) {
                return {
                    message: "User created",
                    status: true
                } as UserSignupMessageObject

            } else {
                throw new Error("SignUp unexpected case")
            }
        }
    } catch (error) {
        console.error(error)
        return {
            message: "Error",
            status: false
        } as UserSignupMessageObject
    }
}

/**
 * Authenticates a user by verifying the provided username and password.
 * 
 * @param {string} username - The username of the user to authenticate.
 * @param {string} password - The password associated with the username.
 * @returns {Promise<UserAuthMessageObject>} A promise that resolves to a UserAuthMessageObject indicating the result of the authentication process.
 * @throws {Error} Throws an error if any errors occur during the authentication process.
 */
export async function authenticate(username: string, password: string): Promise<UserAuthMessageObject>  {
    // Initialize SQL database repository
    const repository = new SQLDBRepository()

    try {
        // Retrieve user data from the database based on the provided username
        const user = await repository.getUserByUsername(username)
        
        // Check if user is null
        if (user === null) {
            return {
                status: false,
                message: "No valid user"
            }
        }

        // Validate the login
        const isValid = await user.isValidLogin(password)

        // If the login is valid, reset the user's login attempt count
        // Otherwise, log the login attempt
        if (isValid.status) {
            user.resetLogin()
        } else {
            user.logLogin()
        }
        await repository.updateUserLogin(user)

        // Return the authentication result
        return isValid

    } catch (error) {
        // Log any errors that occur during the authentication process
        console.error(error)
        return { 
            status: false,
            message: "Error"
        }
    }
}