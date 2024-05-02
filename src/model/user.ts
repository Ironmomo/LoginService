import config from '../config/default'
import { calcDateDifferenceMinutes } from "../utils/utils"
import bcrypt from 'bcrypt'
import { UserAuthMessageObject } from "./pwd"


/**
 * Represents a user with username, password, login count, and last login attempt details.
*/
export default class User {
    username: string
    password : string
    login_count: number
    last_attempt: Date

    /**
     * Constructs a new User object.
     * @param username The username of the user.
     * @param password The password of the user.
     * @param loginCount The number of login attempts made by the user.
     * @param lastAttempt The date of the last login attempt made by the user.
    */
    constructor(username: string, password: string, loginCount: number, lastAttempt: Date) {
        this.username = username
        this.password = password
        this.login_count = loginCount
        this.last_attempt = lastAttempt
    }

    /**
     * Checks if the provided password matches the user's password.
     * @param password The password to validate.
     * @returns A promise that resolves to a UserAuthMessageObject indicating the result of the password validation.
    */
    async isValidLogin (password: string): Promise<UserAuthMessageObject> {
        if ( config.MAX_LOGIN_ATTEMPT <= this.login_count ) {
             if ( config.LOGIN_THRESHOLD > calcDateDifferenceMinutes(this.last_attempt, new Date())) {
                return {
                    status: false,
                    message: "Tried too many times"
                }
             } else {
                return await this.#comparePwd(password)
             }
        } else {
            return await this.#comparePwd(password)
        }
    }

    /**
     * Compares the provided password with the hashed password stored in the user object.
     * @param password The password to be compared.
     * @returns A promise that resolves to a UserAuthMessageObject indicating the result of the password comparison.
     */
    async #comparePwd(password:string): Promise<UserAuthMessageObject> {
        const match = await bcrypt.compare(password, this.password);
        return {
            status: match,
            message: "Password compared"
        }
    }

    /**
     * Resets the login count and updates the last login attempt timestamp for the user.
     */
    resetLogin(): void {
        this.login_count = 0
        this.last_attempt = new Date()
    }

    /**
     * Increments the login count and updates the last login attempt timestamp for the user.
     */
    logLogin(): void {
        this.login_count += calcDateDifferenceMinutes(this.last_attempt, new Date()) >= config.LOGIN_THRESHOLD ? 0 : 1
        this.last_attempt = new Date()
    }

    /**
     * Checks if the provided object is an instance of User and contains the required properties.
     * @param object The object to be checked.
     * @returns True if the object is an instance of User and contains the required properties, otherwise false.
     */
    static isUserObj(object: Object): object is User {
        
        return (typeof object === 'object' &&
            'username' in object && typeof object.username === "string" &&
            'password' in object && typeof object.password === 'string' &&
            'login_count' in object && typeof object.login_count === 'number' &&
            'last_attempt' in object &&
            Object.keys(object).length === 4
          )
    }

    /**
     * Checks if the provided username matches the required pattern.
     * @param username The username to be checked.
     * @returns True if the username matches the pattern, otherwise false.
     */
    static matchesUsernamePattern(username: string): boolean {
        return /^[a-zA-Z0-9!@#$*(),.?_-]{3,12}$/.test(username)
    }

    /**
     * Checks if the provided password matches the required pattern.
     * @param password The password to be checked.
     * @returns True if the password matches the pattern, otherwise false.
     */
    static matchesPasswordPattern(password: string): boolean {
        return /^(?=.*[!@#$*()_,.?-])[a-zA-Z0-9!@#$*()_,.-?]{8,24}$/.test(password)
    }

    /**
     * Encrypts the provided password using bcrypt.
     * @param password The password to be encrypted.
     * @returns A promise that resolves to the encrypted password.
     */
    static async encryptPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, config.NUMBER_OF_HASHES)
    }
}
