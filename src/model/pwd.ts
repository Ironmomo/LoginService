import User from "./user"
/*
    PwdRequestObject
*/
export type PwdRequestObject = {
    username: string // min 3 max 12
    password: string // min 8 max 24 containing at least one of the following chars: !@#$*()_,.?-
}


export function isPwdRequestObject(obj: any): obj is PwdRequestObject {

    return (
        typeof obj === 'object' &&
        obj !== null &&
        'username' in obj &&
        typeof obj.username === 'string' &&
        User.matchesUsernamePattern(obj.username) &&
        'password' in obj &&
        typeof obj.password === 'string' &&
        User.matchesPasswordPattern(obj.password) &&
        Object.keys(obj).length === 2
    )
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
    API Response Object
*/

export type APIResponse = {
    message: string
}