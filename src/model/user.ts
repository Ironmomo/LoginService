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

    async #comparePwd(password:string): Promise<UserAuthMessageObject> {
        const match = await bcrypt.compare(password, this.password);
        return {
            status: match,
            message: "Password compared"
        }
    }

    resetLogin(): void {
        this.login_count = 0
        this.last_attempt = new Date()
    }

    logLogin(): void {
        this.login_count += 1
        this.last_attempt = new Date()
    }

    static isUserObj(object: Object): object is User {
        
        return (typeof object === 'object' &&
            'username' in object && typeof object.username === "string" &&
            'password' in object && typeof object.password === 'string' &&
            'login_count' in object && typeof object.login_count === 'number' &&
            'last_attempt' in object &&
            Object.keys(object).length === 4
          )
    }

    static matchesUsernamePattern(username: string): boolean {
        return /^[a-zA-Z0-9!@#$*(),.?_-]{3,12}$/.test(username)
    }

    static matchesPasswordPattern(password: string): boolean {
        return /^(?=.*[!@#$*()_,.?-])[a-zA-Z0-9!@#$*()_,.-?]{8,24}$/.test(password)
    }
}
