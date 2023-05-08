import { Player } from '../object'

export type RollingPlayer = Player & {
    chest?: number
    chance?: number
}
