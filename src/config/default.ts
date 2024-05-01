type DefaultConfig = {
    // PWD Authentication
    MAX_LOGIN_ATTEMPT: number
    LOGIN_THRESHOLD: number

    // PWD Request Validation
    PWD_PAYLOAD_LIMIT: number
}

const config: DefaultConfig = {
    MAX_LOGIN_ATTEMPT: 5,
    LOGIN_THRESHOLD: 15,
    PWD_PAYLOAD_LIMIT: 60
}

export default config
