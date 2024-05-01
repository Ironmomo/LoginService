type DataDBResponseObject<T> = {
    status: "DATA"
    data: T
}

type EmptyDBResponseObject = {
    status: "EMPTY"
}

type ErrorDBResponseObject = {
    status: "ERROR"
    errorMsg: string
}

export type DBResponseObject<T> = DataDBResponseObject<T> | EmptyDBResponseObject | ErrorDBResponseObject
