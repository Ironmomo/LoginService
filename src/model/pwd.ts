/*
    PwdRequestObject
*/
export type PwdRequestObject = {
    username: string // min 3 max 12
    password: string // min 8 max 24 containing at least one of the following chars: !@#$*()_,.?-
}

/*
    Message Object
*/
export type MessageObject = {
    status: boolean,
    message: string
}

/*
    User authentication Message Object
*/
export type UserAuthMessageObject = {
    message: "Password compared" | "Tried too many times" | "Error" | "No valid user"
} & MessageObject


/*
    User signup Message Object
*/
export type UserSignupMessageObject = {
    message: "Username or Password don't meet the constraints" | "User created" | "Username exists" | "Error"
} & MessageObject

/* 
    API Response Object
*/

export type APIResponse = {
    message: string
}