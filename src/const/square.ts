import { SquareType, Square } from '../type'

const createSquare =
    <T extends Square = Square, K = Partial<T>, J = Omit<T, keyof K>>(def: K) =>
    (square: J) =>
        ({
            ...def,
            ...square,
        } as unknown as T)

const createPropertySquare = createSquare({ type: SquareType.property })
const brownPropertySquare = createPropertySquare({
    propertyColor: 'brown',
    handicap: 10,
})
const lightBluePropertySquare = createPropertySquare({
    propertyColor: 'lightblue',
    handicap: 20,
})
const magentaPropertySquare = createPropertySquare({
    propertyColor: 'magenta',
    handicap: 30,
})
const orangePropertySquare = createPropertySquare({
    propertyColor: 'orange',
    handicap: 40,
})
const redPropertySquare = createPropertySquare({
    propertyColor: 'red',
    handicap: 50,
})
const yellowPropertySquare = createPropertySquare({
    propertyColor: 'yellow',
    handicap: 60,
})
const greenPropertySquare = createPropertySquare({
    propertyColor: 'green',
    handicap: 80,
})
const bluePropertySquare = createPropertySquare({
    propertyColor: 'blue',
    handicap: 100,
})
const stationSquare: Square = {
    type: SquareType.station,
    friendlyName: 'Station',
    handicap: 20,
}
const chanceSquare: Square = {
    type: SquareType.chance,
    friendlyName: 'Chance',
    handicap: 0,
}
const taxSquare: Square = {
    type: SquareType.tax,
    friendlyName: 'Tax',
    handicap: 0,
}
const startSquare: Square = {
    type: SquareType.start,
    handicap: 0,
}
const jailSquare: Square = {
    type: SquareType.jail,
    handicap: 0,
}
const parkingSquare: Square = {
    type: SquareType.parking,
    handicap: 0,
}
const toJailSquare: Square = {
    type: SquareType.toJail,
    handicap: 0,
}
export const squareList = [
    startSquare,
    brownPropertySquare,
    brownPropertySquare,
    brownPropertySquare,
    stationSquare,
    lightBluePropertySquare,
    lightBluePropertySquare,
    lightBluePropertySquare,
    jailSquare,
    magentaPropertySquare,
    magentaPropertySquare,
    magentaPropertySquare,
    stationSquare,
    orangePropertySquare,
    chanceSquare,
    orangePropertySquare,
    parkingSquare,
    redPropertySquare,
    chanceSquare,
    redPropertySquare,
    stationSquare,
    yellowPropertySquare,
    yellowPropertySquare,
    yellowPropertySquare,
    toJailSquare,
    greenPropertySquare,
    chanceSquare,
    greenPropertySquare,
    stationSquare,
    bluePropertySquare,
    taxSquare,
    bluePropertySquare,
]
