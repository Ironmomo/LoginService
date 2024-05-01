import { authenticate } from '../../src/routes/pwd/service/service'
import { SQLDBRepository } from '../../src/db/sql/SQLDBRepository'
import User  from '../../src/model/user'

// Mock the SQLDBRepository
jest.mock('../../src/db/sql/SQLDBRepository')

describe('authenticate function', () => {

    it('should authenticate a user with valid credentials', async () => {
        // Mock getUserByUsername method of SQLDBRepository
        const mockGetUserByUsername = jest.fn();
        const mockIsValidLogin = jest.fn().mockReturnValue({ status: true });
        const mockResetLogin = jest.fn();
        const mockUpdateUserLogin = jest.fn();

        // Mock user data
        const mockUser: User = {
            username: 'testuser',
            isValidLogin: mockIsValidLogin,
            resetLogin: mockResetLogin,
            logLogin: jest.fn(),
        } as any

        // Mock SQLDBRepository instance
        (SQLDBRepository as jest.Mock<SQLDBRepository>).mockImplementation(() => ({
            getUserByUsername: mockGetUserByUsername.mockResolvedValue(mockUser),
            updateUserLogin: mockUpdateUserLogin.mockResolvedValue(undefined),
        }) as any) 

        // Call authenticate function
        const result = await authenticate('testuser', 'password123')

        // Expectations
        expect(mockGetUserByUsername).toHaveBeenCalledWith('testuser')
        expect(mockIsValidLogin).toHaveBeenCalledWith('password123')
        expect(mockResetLogin).toHaveBeenCalled()
        expect(mockUpdateUserLogin).toHaveBeenCalledWith(mockUser)
        expect(result.status).toBe(true)
    })

    it('should return false if user is not found', async () => {
        // Mock getUserByUsername method of SQLDBRepository to return null
        const mockGetUserByUsername = jest.fn().mockResolvedValue(null);

        // Mock SQLDBRepository instance
        (SQLDBRepository as jest.Mock<SQLDBRepository>).mockImplementation(() => ({
            getUserByUsername: mockGetUserByUsername,
        }) as any)

        // Call authenticate function
        const result = await authenticate('nonexistentuser', 'password123')

        // Expectations
        expect(mockGetUserByUsername).toHaveBeenCalledWith('nonexistentuser')
        expect(result.status).toBe(false)
        expect(result.message).toBe('No valid user')
    })

    it('should return false if login is invalid', async () => {
        // Mock getUserByUsername method of SQLDBRepository
        const mockGetUserByUsername = jest.fn();
        const mockIsValidLogin = jest.fn().mockReturnValue({ status: false });

        // Mock user data
        const mockUser: User = {
            username: 'testuser',
            isValidLogin: mockIsValidLogin,
            resetLogin: jest.fn(),
            logLogin: jest.fn(),
        } as any

        // Mock SQLDBRepository instance
        (SQLDBRepository as jest.Mock<SQLDBRepository>).mockImplementation(() => ({
            getUserByUsername: mockGetUserByUsername.mockResolvedValue(mockUser),
            updateUserLogin: jest.fn(),
        }) as any)

        // Call authenticate function
        const result = await authenticate('testuser', 'invalidpassword')

        // Expectations
        expect(mockIsValidLogin).toHaveBeenCalledWith('invalidpassword')
        expect(mockUser.logLogin).toHaveBeenCalled()
        expect(result.status).toBe(false)
    })

    it('should return error message if an error occurs', async () => {
        // Mock getUserByUsername method of SQLDBRepository to throw an error
        const mockGetUserByUsername = jest.fn().mockRejectedValue(new Error('Database error'));

        // Mock SQLDBRepository instance
        (SQLDBRepository as jest.Mock<SQLDBRepository>).mockImplementation(() => ({
            getUserByUsername: mockGetUserByUsername,
        }) as any)

        // Call authenticate function
        const result = await authenticate('testuser', 'password123')

        // Expectations
        expect(result.status).toBe(false)
        expect(result.message).toBe('Error')
    })
})
