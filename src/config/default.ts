type DefaultConfig = {
    // PWD Authentication
    MAX_LOGIN_ATTEMPT: number
    LOGIN_THRESHOLD: number

    // PWD Request Validation
    PWD_PAYLOAD_LIMIT: number

    // CORS
    ENABLE_CORS: boolean
}

const config: DefaultConfig = {
    MAX_LOGIN_ATTEMPT: 5,
    LOGIN_THRESHOLD: 15,
    PWD_PAYLOAD_LIMIT: 250,
    ENABLE_CORS: true
}

export default config
