export type ErrorType = 'CUSTOM_ERROR'

export class CustomError extends Error {
    type: ErrorType
    constructor(message?: string) {
        super(message)
        this.type = 'CUSTOM_ERROR'
    }
}
