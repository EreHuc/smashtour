export interface CommunityChest {
    fileIndex: number
    targetIndex?: number
    playerText?: string
    handicapIncrease?: number
    gotoProperty?: string
    type?: string
    banned?: boolean
    showChest?: boolean
}

export const communityChests: CommunityChest[] = [
    { fileIndex: 1, targetIndex: 0 },
    { fileIndex: 2, playerText: 'Free hit on each opponent!' },
    { fileIndex: 3, handicapIncrease: 50 },
    { fileIndex: 4, gotoProperty: 'toptier' },
    { fileIndex: 5, type: 'lightblue' },
    { fileIndex: 6, type: 'pink' },
    { fileIndex: 7, type: 'orange' },
    { fileIndex: 8, type: 'red' },
    { fileIndex: 9, type: 'yellow' },
    { fileIndex: 10, type: 'green' },
    { fileIndex: 11, type: 'blue' },
    { fileIndex: 12, type: 'brown' },
    { fileIndex: 13, banned: true },
    { fileIndex: 14, targetIndex: 20 },
    { fileIndex: 15, showChest: true },
]
