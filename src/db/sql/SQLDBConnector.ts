import mysql from 'mysql2/promise'
import type { ResultSetHeader } from 'mysql2/promise'
import { DBResponseObject } from '../types'
import dotenv from "dotenv"
dotenv.config()

/**
 * SQLConnector is used to execute Queries against a MYSQL Database. It follows the Singleton Design Pattern. Therefore you have to use the getInstance Function
 * to get an Instance of SQLConnector
*/

export class SQLConnector {

    pool: mysql.Pool
    isExiting: boolean

    //TODO: Env
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: 10,
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD
        })

        this.isExiting = false
    }

    /**
     * Generic function to execute a query. Make sure to use prepared statements to prevent sql injections.
     * @param {string} query for the db formulated as a prepared statement
     * @param  {...any} values to insert into the prepared statement
     * @returns {Promise<DBResponseObject<any>>} a Promise which resolves the data from the db or rejects and provides the error
     */
    async executeQuery(query: string, ...values: any): Promise<DBResponseObject<any>> {
        let toReturn: DBResponseObject<any> = {
            status: 'EMPTY'
        }
        try {
            const [rows, fields] = await this.pool.query(query, values)
            if (rows instanceof Object && !(rows instanceof Array) && rows.affectedRows > 0) {
                toReturn = {
                    status: 'DATA',
                    data: rows.affectedRows
                }
            }
            else if (rows instanceof Array && rows.length >= 1) {
                toReturn = {
                    status: 'DATA',
                    data: rows
                }   
            }
        } catch (error: any) {
            toReturn = { status: 'ERROR', errorMsg: error.message}
        }
        return toReturn
    }

    /**
     * To close the connection to the db
     */
    #closeConnection(): void {
        this.pool.end()
    }

    /**
     * Call this method when the connection should be closed
     */
    handleExit(): void {
        if (!this.isExiting) {
            this.isExiting = true;
            console.log('Exiting application. Closing SQL connection...');
            this.#closeConnection();
        }
    }
}


// Create a singleton instance
let sqlConnectorInstance = new SQLConnector()

// Handle cleanup before process exit
process.on('beforeExit', () => {
    sqlConnectorInstance.handleExit()
});



// Export the singleton instance
export default function getInstance() {
    if (sqlConnectorInstance.isExiting) {
        sqlConnectorInstance = new SQLConnector()
    }
    return sqlConnectorInstance
}