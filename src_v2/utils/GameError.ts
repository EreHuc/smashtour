import { Errors } from '../type'

export class GameError extends Error {
    constructor(message: string) {
        super(message)

        this.name = Errors.GameError
    }
}
