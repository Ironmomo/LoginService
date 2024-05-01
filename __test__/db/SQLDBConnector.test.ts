import { SQLConnector } from '../../src/db/sql/SQLDBConnector'

// Create a global variable to hold the SQLConnector instance
let sqlConnector: SQLConnector

// Describe the test suite for SQLConnector
describe('SQLConnector', () => {
  // Before each test suite, create a new instance of SQLConnector
  beforeEach(() => {
    sqlConnector = new SQLConnector()
  })

  // After each test suite, call the handleExit method to clean up
  afterEach(() => {
    // Call the handleExit method if the instance exists
    if (sqlConnector) {
      sqlConnector.handleExit()
    }
  })

  // Test suite for executeQuery method
  describe('executeQuery', () => {
    // Test case for executing a query successfully
    it('should execute a query successfully', async () => {
      // Execute a query (assuming you have a test database with appropriate data)
      const result = await sqlConnector.executeQuery('SELECT * FROM test_table') as any

      // Assert the result
      expect(result.status).toBe('DATA')
      expect(result.data).toBeDefined()
      // Add more specific assertions based on your test data
    })

    // Test case for executing a query successfully
    it('should execute a query successfully with values existing', async () => {
      // Execute a query (assuming you have a test database with appropriate data)
      const result = await sqlConnector.executeQuery('SELECT * FROM test_table WHERE username = ?', 'user1') as any

      // Assert the result
      expect(result.status).toBe('DATA')
      expect(result.data).toBeDefined()
      // Add more specific assertions based on your test data
    })

    // Test case for executing a query successfully
    it('should execute a query successfully with multiple values existing', async () => {
      // Execute a query (assuming you have a test database with appropriate data)
      const result = await sqlConnector.executeQuery('SELECT * FROM test_table WHERE username = ? AND password = ?', 'user1', 'compass1') as any

      // Assert the result
      expect(result.status).toBe('DATA')
      expect(result.data).toBeDefined()
      // Add more specific assertions based on your test data
    })

    // Test case for executing a query successfully
    it('should execute a query successfully with values non-existing', async () => {
      // Execute a query (assuming you have a test database with appropriate data)
      const result = await sqlConnector.executeQuery('SELECT * FROM test_table WHERE username = ?', 'user2') as any

      // Assert the result
      expect(result.status).toBe('EMPTY')
      expect(result.data).toBeUndefined()
      // Add more specific assertions based on your test data
    })

    // Test case for handling errors during query execution
    it('should handle errors during query execution', async () => {
      // Execute a query that is expected to fail
      const result = await sqlConnector.executeQuery('SELECT * FROM non_existent_table') as any

      // Assert the result
      expect(result.status).toBe('ERROR')
      expect(result.errorMsg).toBeDefined()
      // Add more specific assertions based on the expected error
    })
  })

  // Test suite for handleExit method
  describe('handleExit', () => {
    // Test case for closing the database connection
    it('should close the database connection', () => {
      // Call the handleExit method
      sqlConnector.handleExit()

      // Assert that the connection is closed
      expect(sqlConnector.isExiting).toBeTruthy()
    })
  })
})
