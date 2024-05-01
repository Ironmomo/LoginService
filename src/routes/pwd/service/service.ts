import { SQLDBRepository } from "../../../db/sql/SQLDBRepository"
import { UserAuthMessageObject } from "../../../model/pwd"

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