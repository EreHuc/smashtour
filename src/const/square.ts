import { SquareType } from '../type'
import { Square } from '../type/Square.ts'

const createSquare =
    <T extends Square = Square, K = Partial<T>, J = Omit<T, keyof K>>(def: K) =>
    (square: J) =>
        ({
            ...def,
            ...square,
        } as unknown as T)

const createPropertySquare = createSquare({ type: SquareType.property })
export const brownPropertySquare = createPropertySquare({
    propertyColor: 'brown',
    handicap: 10,
})
export const lightBluePropertySquare = createPropertySquare({
    propertyColor: 'lightblue',
    handicap: 20,
})
export const magentaPropertySquare = createPropertySquare({
    propertyColor: 'magenta',
    handicap: 30,
})
export const orangePropertySquare = createPropertySquare({
    propertyColor: 'orange',
    handicap: 40,
})
export const redPropertySquare = createPropertySquare({
    propertyColor: 'red',
    handicap: 50,
})
export const yellowPropertySquare = createPropertySquare({
    propertyColor: 'yellow',
    handicap: 60,
})
export const greenPropertySquare = createPropertySquare({
    propertyColor: 'green',
    handicap: 80,
})
export const bluePropertySquare = createPropertySquare({
    propertyColor: 'blue',
    handicap: 100,
})
export const utilitySquare: Square = { type: SquareType.utility, handicap: 0 }
export const stationSquare: Square = {
    type: SquareType.station,
    friendlyName: 'Station',
    handicap: 20,
}
export const chanceSquare: Square = {
    type: SquareType.chance,
    friendlyName: 'Chance',
    handicap: 0,
}
export const chestSquare: Square = {
    type: SquareType.chest,
    friendlyName: 'Chest',
    handicap: 0,
}
export const taxSquare: Square = {
    type: SquareType.tax,
    friendlyName: 'Tax',
    handicap: 0,
}
export const startSquare: Square = {
    type: SquareType.start,
    handicap: 0,
}
export const jailSquare: Square = {
    type: SquareType.jail,
    handicap: 0,
}
export const parkingSquare: Square = {
    type: SquareType.parking,
    handicap: 0,
}
export const toJailSquare: Square = {
    type: SquareType.toJail,
    handicap: 0,
}
