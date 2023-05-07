export interface Chance {
    fileIndex: number
    playerText?: string
    targetIndex?: number
    goto?: string
    text?: string
    banned?: boolean
    showChance?: boolean
    gotoProperty?: string
}

export const chances: Chance[] = [
    { fileIndex: 1, playerText: 'Pick stage!' },
    { fileIndex: 2, targetIndex: -3 },
    { fileIndex: 3, goto: 'station' },
    { fileIndex: 4, text: 'Pokeballs on!' },
    { fileIndex: 5, text: 'Assist Trophies on!' },
    { fileIndex: 6, text: 'Launch rate to 1.5x!' },
    { fileIndex: 7, text: 'Random stage!' },
    { fileIndex: 8, playerText: 'Play as random!' },
    { fileIndex: 9, text: 'Final Smash Meter on!' },
    { fileIndex: 10, banned: true },
    { fileIndex: 11, showChance: true },
    { fileIndex: 12, goto: 'yellow' },
    { fileIndex: 13, gotoProperty: 'heavy' },
    { fileIndex: 14, goto: 'lowtiertax' },
    { fileIndex: 15, text: 'Items on high!' },
]
