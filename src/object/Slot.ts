import { Direction, SquareType, Square } from '../type'
import { Character } from './Character.ts'
import { Player } from './Player.ts'

export class Slot implements Square {
    propertyColor?: string
    direction: Direction
    h: number
    type: SquareType
    w: number
    x: number
    y: number
    friendlyName?: string
    character?: Character
    isCorner: boolean
    owner?: Player['id']
    upgrade: number
    blink: boolean
    handicap: number
    locked: boolean

    constructor(props: Slot) {
        this.propertyColor = props.propertyColor
        this.direction = props.direction
        this.h = props.h
        this.type = props.type
        this.w = props.w
        this.x = props.x
        this.y = props.y
        this.character = props.character
        this.friendlyName = props.friendlyName
        this.isCorner = props.isCorner
        this.upgrade = props.upgrade
        this.blink = props.blink
        this.handicap = props.handicap
        this.locked = props.locked
    }
}
