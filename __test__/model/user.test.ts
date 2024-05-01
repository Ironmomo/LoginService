import config from '../../src/config/default';
import User from '../../src/model/user'
import bcrypt from 'bcrypt'

// Mock bcrypt methods
jest.mock('bcrypt', () => ({
    compare: jest.fn(),
}));

describe('User model tests', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('Validate isValidLogin method', () => {

        // Positiv

        it('should validate login with correct password', async () => {
            const user = new User('testuser', 'hashedPassword', 0, new Date());
            (bcrypt.compare as jest.Mock).mockResolvedValue(true)
    
            const result = await user.isValidLogin('password123')
    
            expect(result.status).toBe(true)
            expect(result.message).toBe('Password compared')
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')
        })

        it('should validate login with correct password', async () => {
            const user = new User('testuser', 'hashedPassword', config.MAX_LOGIN_ATTEMPT - 1, new Date());
            (bcrypt.compare as jest.Mock).mockResolvedValue(true)
    
            const result = await user.isValidLogin('password123')
    
            expect(result.status).toBe(true)
            expect(result.message).toBe('Password compared')
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')
        })
    
        it('should validate login with correct password, exceeded login attempts but Login threshold has been reached', async () => {
            // Set minutes past sine last_attempt to be just equal to LOGIN_THRESHOLD 
            const last_attempt = new Date()
            last_attempt.setTime(last_attempt.getTime() - config.LOGIN_THRESHOLD * 60 * 1000)
            const user = new User('testuser', 'hashedPassword', config.MAX_LOGIN_ATTEMPT, last_attempt);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true)
    
            const result = await user.isValidLogin('password123')
    
            expect(result.status).toBe(true)
        })
    
        // Negative

        it('should validate login with wrong password', async () => {
            const user = new User('testuser', 'hashedPassword', 0, new Date());
            (bcrypt.compare as jest.Mock).mockResolvedValue(false)
    
            const result = await user.isValidLogin('password123')
    
            expect(result.status).toBe(false)
            expect(result.message).toBe('Password compared')
            expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword')
        })

        it('should handle too many login attempts', async () => {
            const user = new User('testuser', 'hashedPassword', config.MAX_LOGIN_ATTEMPT, new Date());
            (bcrypt.compare as jest.Mock).mockResolvedValue(true)

            const result = await user.isValidLogin('password123')
    
            expect(result.status).toBe(false)
            expect(result.message).toBe('Tried too many times')
        })
    })

    describe('Validate reset and log method', () => {

        it('should reset login count', () => {
            const user = new User('testuser', 'hashedPassword', 3, new Date())
    
            user.resetLogin()
    
            expect(user.login_count).toBe(0)
        })
    
        it('should increment login count', () => {
            const user = new User('testuser', 'hashedPassword', 0, new Date())
    
            user.logLogin()
    
            expect(user.login_count).toBe(1)
        })
    })

    describe('Validate user object structure', () => {
        it('should validate user object structure to be true', () => {
            const userObject = {
                username: 'testuser',
                password: 'hashedPassword',
                login_count: 0,
                last_attempt: new Date(),
            }
    
            const isValidUser = User.isUserObj(userObject)
    
            expect(isValidUser).toBe(true)
        })
    
        it('should validate user object structure to be false', () => {
            const userObject = {
                username: 'testuser',
                password: 'hashedPassword',
                login_count: 0,
            }
    
            const isValidUser = User.isUserObj(userObject)
    
            expect(isValidUser).toBe(false)
        })
    
        it('should validate user object structure to be false', () => {
            const userObject = {
                username: 'testuser',
                password: 'hashedPassword',
                login_count: '0',
                last_attempt: new Date(),
            }
    
            const isValidUser = User.isUserObj(userObject)
    
            expect(isValidUser).toBe(false)
        })
    
        it('should validate user object structure to be false', () => {
            const userObject = {
                username: 'testuser',
                password: 'hashedPassword',
                login_count: 0,
                last_attempt: new Date(),
                extra_propertie: "some value"
            }
    
            const isValidUser = User.isUserObj(userObject)
    
            expect(isValidUser).toBe(false)
        })
    })

    describe('Validate Username and Password pattern', () => {

        // Positiv

        it('should validate username pattern', () => {
            const isValidUsername = User.matchesUsernamePattern('testuser123')
    
            expect(isValidUsername).toBe(true)
        })
    
        it('should validate username pattern', () => {
            const isValidUsername = User.matchesUsernamePattern('tes')
    
            expect(isValidUsername).toBe(true)
        })

        it('should validate username pattern', () => {
            const isValidUsername = User.matchesUsernamePattern('testuser1234')
    
            expect(isValidUsername).toBe(true)
        })
    
        it('should validate password pattern', () => {
            const isValidPassword = User.matchesPasswordPattern('password123!')
    
            expect(isValidPassword).toBe(true)
        })
    
        it('should validate password pattern', () => {
            const isValidPassword = User.matchesPasswordPattern('1234567.')
    
            expect(isValidPassword).toBe(true)
        })

        it('should validate password pattern', () => {
            const isValidPassword = User.matchesPasswordPattern('password123!123456789123')
    
            expect(isValidPassword).toBe(true)
        })

        // Negative
    
        it('should validate username pattern', () => {
            const isValidUsername = User.matchesUsernamePattern('te')
    
            expect(isValidUsername).toBe(false)
        })

        it('should validate username pattern', () => {
            const isValidUsername = User.matchesUsernamePattern('testuser12340')
    
            expect(isValidUsername).toBe(false)
        })
    
        it('should validate password pattern to be false', () => {
            const isValidPassword = User.matchesPasswordPattern('123456.')
    
            expect(isValidPassword).toBe(false)
        })

        it('should validate password pattern', () => {
            const isValidPassword = User.matchesPasswordPattern('password123!1234567891230')
    
            expect(isValidPassword).toBe(false)
        })
    })
})
