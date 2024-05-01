import getInstance from "./SQLDBConnector"
import { SQLConnector } from "./SQLDBConnector"
import User  from "../../model/user"

export class SQLDBRepository {

    connector: SQLConnector

    constructor() {
        this.connector = getInstance()
    }

    /**
     * Retrieves user information from the database based on the provided username.
     * @param {string} username - The username of the user to retrieve.
     * @returns {Promise<User | null>} A promise that resolves to a User object containing the user information if found, return null if no user has been found or rejects with an error message if an error occurs.
     */
    getUserByUsername(username: string): Promise<User | null> {

        return new Promise(async (resolve, reject) => {
            try {
                // Query data from db
                const data = await this.connector.executeQuery('SELECT * from user_table WHERE username = ?', username)

                switch(data.status) {
                    case "DATA":
                        if (!User.isUserObj(data.data[0])) throw new Error("No valid Data Object")
                        const userData: User = data.data[0]
                        resolve(new User(userData.username, userData.password, userData.login_count, userData.last_attempt))
                        break   
                    case "EMPTY":
                        resolve(null)
                    case "ERROR":
                        throw new Error("Database Error")
                    default: throw new Error("No valid data status")
                }
                
            } catch (error: any) {
                reject(error.message)
            }

        })
    }

    /**
     * Updates the login count and last login attempt timestamp for a user in the database.
     * 
     * @param {User} user - An object representing the user whose login information needs to be updated.
     *                      It should have the following properties:
     *                      - username: The unique identifier of the user in the database.
     *                      - login_count: The updated login count for the user.
     *                      - last_attempt: The timestamp of the user's last login attempt.
     * @returns {Promise<boolean>} - A Promise that resolves to true if the user's login information is successfully updated,
     *                               or rejects with an error if any database operation fails.
     * @throws {Error} - Throws an error with a descriptive message if any database operation fails or if the provided data is invalid.
     */
    updateUserLogin(user: User): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                const data = await this.connector.executeQuery('UPDATE user_table SET login_count = ?, last_attempt = ? WHERE username = ?', user.login_count, user.last_attempt, user.username)
                
                switch(data.status) {
                    case "DATA":
                        if (data.data !== 1) throw new Error("Invalid number of affected rows") 
                        resolve(true)
                        break
                    case "ERROR":
                        throw new Error("Database Error")
                    case "EMPTY":
                        throw new Error("No User found")
                    default: throw new Error("No valid data status")
                }

            } catch (error) {
                reject(error)
            }
        })
    }

    closeConnection(): void {
        this.connector.handleExit()
    }

}