type DefaultConfig = {
    // PWD Authentication
    MAX_LOGIN_ATTEMPT: number
    LOGIN_THRESHOLD: number
    NUMBER_OF_HASHES: number

    // PWD Request Validation
    PWD_PAYLOAD_LIMIT: number

    // CORS
    ENABLE_CORS: boolean
}

const config: DefaultConfig = {
    MAX_LOGIN_ATTEMPT: 5,
    LOGIN_THRESHOLD: 15,
    PWD_PAYLOAD_LIMIT: 250,
    ENABLE_CORS: true,
    NUMBER_OF_HASHES: 12
}

export default config
