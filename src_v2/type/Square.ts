import { SquareType } from './SquareType.enum.ts'

export interface Square {
    propertyColor?: string
    type: SquareType
    friendlyName?: string
    handicap: number
}
