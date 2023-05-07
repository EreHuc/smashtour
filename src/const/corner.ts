export interface Corner {
    name: string
    friendlyName: string
    left: number
    right: number
    top: number
    bottom: number
    index: number
    next?: string[]
    type: string
    pool?: string[]
    drawSlot: boolean
}

export const corners: Corner[] = [
    {
        name: 'go',
        friendlyName: 'Go',
        left: 873,
        right: 1000,
        top: 873,
        bottom: 1000,
        index: 0,
        next: ['brown', 'chest', 'brown', 'lowtiertax', 'station', 'lightblue', 'chance', 'lightblue', 'lightblue'],
        type: 'go',
        drawSlot: false,
    },
    {
        name: 'visiting',
        friendlyName: 'Just Visiting',
        left: 0,
        right: 127,
        top: 871,
        bottom: 1000,
        index: 10,
        pool: ['steve', 'kazuya', 'rob'],
        next: ['pink', 'utility', 'pink', 'pink', 'station', 'orange', 'chest', 'orange', 'orange'],
        type: 'visiting',
        drawSlot: true,
    },
    {
        name: 'freecharacter',
        friendlyName: 'Free Character',
        left: 0,
        right: 127,
        top: 0,
        bottom: 127,
        index: 20,
        next: ['red', 'chance', 'red', 'red', 'station', 'yellow', 'yellow', 'utility', 'yellow'],
        type: 'free',
        drawSlot: false,
    },
    {
        name: 'tobanned',
        friendlyName: 'Get Banned',
        left: 873,
        right: 1000,
        top: 0,
        bottom: 127,
        index: 30,
        next: ['green', 'green', 'chest', 'green', 'station', 'chance', 'blue', 'lametax', 'blue'],
        type: 'tobanned',
        drawSlot: false,
    },
    {
        name: 'banned',
        friendlyName: 'Banned!',
        left: 0,
        right: 127,
        top: 871,
        bottom: 1000,
        index: 40,
        type: 'banned',
        drawSlot: false,
    },
]
