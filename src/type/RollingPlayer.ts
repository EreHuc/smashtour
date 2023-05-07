import { Token } from '../object'

export type RollingPlayer = Token & {
    chest?: number
    chance?: number
}
