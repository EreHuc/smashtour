import { chances, communityChests } from '../const'

export class Player {
    playerIndex: number
    icon: string
    name: string
    index: number
    targetIndex: number
    progress: number
    setCount: number
    wins: number
    losses: number
    diceTotal: number
    charactersWon: number
    charactersLost: number
    banned: boolean
    handicap: number
    character?: string
    text?: string
    backwards?: boolean
    x?: number
    y?: number
    nextX?: number
    nextY?: number
    diffX?: number
    diffY?: number
    showChest?: (typeof chances)[number]
    showChance?: (typeof communityChests)[number]

    constructor(playerIndex: number, name: string, icon: string) {
        this.playerIndex = playerIndex
        this.icon = icon
        this.name = name
        this.index = 0
        this.targetIndex = 0
        this.progress = 0
        this.setCount = 0
        this.wins = 0
        this.losses = 0
        this.diceTotal = 0
        this.charactersWon = 0
        this.charactersLost = 0
        this.banned = false
        this.handicap = 0
    }
}
