import { SlotTypeName } from './type/SlotTypeName.enum.ts'
import { Pool } from './type'
import { Character } from './type/Character.enum.ts'
import { CornerName } from './type/CornerName.enum.ts'

export interface Corner {
    name: CornerName
    friendlyName: string
    left: number
    right: number
    top: number
    bottom: number
    index: number
    next?: SlotTypeName[]
    pool?: Pool[]
    drawSlot: boolean
    type: CornerName
}

export const corners: Corner[] = [
    {
        name: CornerName.go,
        type: CornerName.go,
        friendlyName: 'Go',
        left: 873,
        right: 1000,
        top: 873,
        bottom: 1000,
        index: 0,
        next: [
            SlotTypeName.brown,
            SlotTypeName.chest,
            SlotTypeName.brown,
            SlotTypeName.lowtiertax,
            SlotTypeName.station,
            SlotTypeName.lightblue,
            SlotTypeName.chance,
            SlotTypeName.lightblue,
            SlotTypeName.lightblue,
        ],
        drawSlot: false,
    },
    {
        name: CornerName.visiting,
        type: CornerName.visiting,
        friendlyName: 'Just Visiting',
        left: 0,
        right: 127,
        top: 871,
        bottom: 1000,
        index: 10,
        pool: [Character.steve, Character.kazuya, Character.rob],
        next: [
            SlotTypeName.pink,
            SlotTypeName.utility,
            SlotTypeName.pink,
            SlotTypeName.pink,
            SlotTypeName.station,
            SlotTypeName.orange,
            SlotTypeName.chest,
            SlotTypeName.orange,
            SlotTypeName.orange,
        ],
        drawSlot: true,
    },
    {
        name: CornerName.freecharacter,
        type: CornerName.freecharacter,
        friendlyName: 'Free Character',
        left: 0,
        right: 127,
        top: 0,
        bottom: 127,
        index: 20,
        next: [
            SlotTypeName.red,
            SlotTypeName.chance,
            SlotTypeName.red,
            SlotTypeName.red,
            SlotTypeName.station,
            SlotTypeName.yellow,
            SlotTypeName.yellow,
            SlotTypeName.utility,
            SlotTypeName.yellow,
        ],
        drawSlot: false,
    },
    {
        name: CornerName.tobanned,
        type: CornerName.tobanned,
        friendlyName: 'Get Banned',
        left: 873,
        right: 1000,
        top: 0,
        bottom: 127,
        index: 30,
        next: [
            SlotTypeName.green,
            SlotTypeName.green,
            SlotTypeName.chest,
            SlotTypeName.green,
            SlotTypeName.station,
            SlotTypeName.chance,
            SlotTypeName.blue,
            SlotTypeName.lametax,
            SlotTypeName.blue,
        ],
        drawSlot: false,
    },
    {
        name: CornerName.banned,
        type: CornerName.banned,
        friendlyName: 'Banned!',
        left: 0,
        right: 127,
        top: 871,
        bottom: 1000,
        index: 40,
        drawSlot: false,
    },
]
