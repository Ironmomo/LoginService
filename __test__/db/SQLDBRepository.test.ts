import { jest } from '@jest/globals'
// Import the SQLDBManager class and the types
import { SQLDBRepository } from '../../src/db/sql/SQLDBRepository'


// Mock the SQLConnector module
jest.mock('../../dist/db/sql/SQLDBConnector', () => ({
  SQLConnector: jest.fn().mockImplementation(() => ({
    executeQuery: jest.fn(),
    handleExit: jest.fn()
  })),
}))


describe('SQLDBManager', () => {
  // Test suite for getUserPassword method
  describe('getUserByUsername', () => {
    // Test case for successful retrieval of user password
    it('should return user password when username exists in the database', async () => {
      const user = {username: 'mockUsername', password: 'mockPassword', login_count: 0, last_attempt: new Date()}
      // Mock the response from the executeQuery method of SQLConnector
      const mockExecuteQuery = jest.fn().mockResolvedValue({
        status: 'DATA',
        data: [{...user}],
      } as never)

      // Create an instance of SQLDBRepository
      const dbManager = new SQLDBRepository()

      // Mock the executeQuery method of SQLConnector
      dbManager.connector.executeQuery = mockExecuteQuery as any

      // Call the getUserPassword method and assert the result
      await expect(dbManager.getUserByUsername('mockUsername')).resolves.toEqual(user)

    })

    // Test case for handling database errors
    it('should return error object when database error occurs', async () => {
      // Mock the response from the executeQuery method of SQLConnector to simulate a database error
      const mockExecuteQuery = jest.fn().mockResolvedValue({ status: 'ERROR', errorMsg: "Database Error"} as never)

      // Create an instance of SQLDBRepository
      const dbManager = new SQLDBRepository()

      // Mock the executeQuery method of SQLConnector
      dbManager.connector.executeQuery = mockExecuteQuery as any

      // Call the getUserPassword method and assert the result
      await expect(dbManager.getUserByUsername('mockUsername')).rejects.toMatch('Database Error')
    })

    // Test case for handling no db entry
    it('should return null when database has no matching entry', async () => {
      // Mock the response from the executeQuery method of SQLConnector to simulate no entry
      const mockExecuteQuery = jest.fn().mockResolvedValue({
        status: 'EMPTY'
    } as never)

      // Create an instance of SQLDBRepository
      const dbManager = new SQLDBRepository()

      // Mock the executeQuery method of SQLConnector
      dbManager.connector.executeQuery = mockExecuteQuery as any

      // Call the getUserPassword method and assert the result
      await expect(dbManager.getUserByUsername('mockUsername')).resolves.toBeNull()
    })
  })
  // Test suite for createNewUser
  describe('createNewUser', () => {
    it('should return successfull', async () => {
      
      // Mock the response from the executeQuery method of SQLConnector
      const mockExecuteQuery = jest.fn().mockResolvedValue({
        status: 'DATA',
        data: 1,
      } as never)

      // Create an instance of SQLDBRepository
      const dbManager = new SQLDBRepository()

      // Mock the executeQuery method of SQLConnector
      dbManager.connector.executeQuery = mockExecuteQuery as any

      // Call the getUserPassword method and assert the result
      await expect(dbManager.createNewUser('validUser', 'somePassword')).resolves.toEqual({ status: 'DATA', data: 1})

    })

    it('should return unsuccessfull', async () => {     
      // Mock the response from the executeQuery method of SQLConnector
      const mockExecuteQuery = jest.fn().mockResolvedValue({
        status: 'ERROR',
        data: "Some error Msg",
      } as never)

      // Create an instance of SQLDBRepository
      const dbManager = new SQLDBRepository()

      // Mock the executeQuery method of SQLConnector
      dbManager.connector.executeQuery = mockExecuteQuery as any

      // Call the getUserPassword method and assert the result
      await expect(dbManager.createNewUser('invalidUser', 'somePassword')).resolves.toEqual({status: 'ERROR', data: "Some error Msg"})
    })
  })
})
