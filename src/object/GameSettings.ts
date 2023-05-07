import { Token } from '../object'
import {
    chances,
    communityChests,
    corners,
    friendlyNames,
    heavies,
    images,
    parkingCoords,
    playerColours,
    playerTokens,
    seriesNames,
    SlotType,
    slotTypes,
    toptiers,
    handicapBands,
} from '../const'

let defaultGameSettings = {
    winCondition: 3,
    rounds: 1,
    over: false,
    losingCharacterIndex: undefined,
    upgradeCharacterIndex: undefined,
    recentWinner: undefined,
    chestCounter: 0,
    chanceCounter: 0,
    shuffleCards: true,
    dieResult: 0,
    currentlyAnimating: false,
    currentTurn: 0,
    matchSettings: [] as string[],
    dlc: true,
    chances,
    communityChests,
    corners,
    friendlyNames,
    heavies,
    images,
    playerTokens,
    seriesNames,
    slotTypes,
    toptiers,
    parkingCoords,
    playerColours,
    handicapBands,
} as const

interface GameSettingsProps {
    winCondition: 3 | 2 | 1
    rounds: number
    over: boolean
    losingCharacterIndex?: number
    upgradeCharacterIndex?: number
    recentWinner?: Token
    chestCounter: number
    chanceCounter: number
    shuffleCards: boolean
    dieResult: number
    currentlyAnimating: boolean
    currentTurn: number
    matchSettings: string[]
    dlc: boolean
    chances: typeof chances
    communityChests: typeof communityChests
    corners: typeof corners
    images: typeof images
    playerTokens: typeof playerTokens
    seriesNames: typeof seriesNames
    slotTypes: typeof slotTypes
    friendlyNames: typeof friendlyNames
    heavies: typeof heavies
    toptiers: typeof toptiers
    parkingCoords: typeof parkingCoords
    playerColours: typeof playerColours
    handicapBands: typeof handicapBands
}

export class GameSettings {
    winCondition: 3 | 2 | 1
    rounds: number
    over: boolean
    losingCharacterIndex?: number
    upgradeCharacterIndex?: number
    recentWinner?: Token
    chestCounter: number
    chanceCounter: number
    shuffleCards: boolean
    dieResult: number
    currentlyAnimating: boolean
    currentTurn: number
    matchSettings: string[]
    dlc: boolean
    chances: typeof chances
    communityChests: typeof communityChests
    corners: typeof corners
    images: typeof images
    playerTokens: typeof playerTokens
    seriesNames: typeof seriesNames
    slotTypes: SlotType[]
    friendlyNames: typeof friendlyNames
    heavies: typeof heavies
    toptiers: typeof toptiers
    parkingCoords: typeof parkingCoords
    playerColours: typeof playerColours
    handicapBands: typeof handicapBands

    constructor(settings: Partial<GameSettingsProps> = {}) {
        const gameSettings = {
            ...defaultGameSettings,
            ...settings,
        }
        this.winCondition = gameSettings.winCondition
        this.rounds = gameSettings.rounds
        this.over = gameSettings.over
        this.losingCharacterIndex = gameSettings.losingCharacterIndex
        this.upgradeCharacterIndex = gameSettings.upgradeCharacterIndex
        this.recentWinner = gameSettings.recentWinner
        this.chestCounter = gameSettings.chestCounter
        this.chanceCounter = gameSettings.chanceCounter
        this.shuffleCards = gameSettings.shuffleCards
        this.dieResult = gameSettings.dieResult
        this.currentlyAnimating = gameSettings.currentlyAnimating
        this.currentTurn = gameSettings.currentTurn
        this.matchSettings = gameSettings.matchSettings
        this.dlc = gameSettings.dlc
        this.chances = gameSettings.chances
        this.communityChests = gameSettings.communityChests
        this.corners = gameSettings.corners
        this.images = gameSettings.images
        this.playerTokens = gameSettings.playerTokens
        this.seriesNames = gameSettings.seriesNames
        this.slotTypes = gameSettings.slotTypes
        this.friendlyNames = gameSettings.friendlyNames
        this.heavies = gameSettings.heavies
        this.toptiers = gameSettings.toptiers
        this.parkingCoords = gameSettings.parkingCoords
        this.playerColours = gameSettings.playerColours
        this.handicapBands = gameSettings.handicapBands
        this.loadImages()

        if (this.shuffleCards) {
            this._shuffleCards()
        }
    }

    public saveGameSettingsState(): Partial<GameSettingsProps> {
        return {
            winCondition: this.winCondition,
            rounds: this.rounds,
            over: this.over,
            losingCharacterIndex: this.losingCharacterIndex,
            upgradeCharacterIndex: this.upgradeCharacterIndex,
            recentWinner: this.recentWinner,
            chestCounter: this.chestCounter,
            chanceCounter: this.chanceCounter,
            shuffleCards: this.shuffleCards,
            dieResult: this.dieResult,
            currentlyAnimating: this.currentlyAnimating,
            currentTurn: this.currentTurn,
            matchSettings: this.matchSettings,
            dlc: this.dlc,
            chances: this.chances,
            communityChests: this.communityChests,
            corners: this.corners,
            playerTokens: this.playerTokens,
            seriesNames: this.seriesNames,
            slotTypes: this.slotTypes,
            friendlyNames: this.friendlyNames,
            heavies: this.heavies,
            toptiers: this.toptiers,
            parkingCoords: this.parkingCoords,
            playerColours: this.playerColours,
            handicapBands: this.handicapBands,
        }
    }

    public loadGameSettingsState(gameSettingsProps: GameSettingsProps) {
        this.winCondition = gameSettingsProps.winCondition
        this.rounds = gameSettingsProps.rounds
        this.over = gameSettingsProps.over
        this.losingCharacterIndex = gameSettingsProps.losingCharacterIndex
        this.upgradeCharacterIndex = gameSettingsProps.upgradeCharacterIndex
        this.recentWinner = gameSettingsProps.recentWinner
        this.chestCounter = gameSettingsProps.chestCounter
        this.chanceCounter = gameSettingsProps.chanceCounter
        this.shuffleCards = gameSettingsProps.shuffleCards
        this.dieResult = gameSettingsProps.dieResult
        this.currentlyAnimating = gameSettingsProps.currentlyAnimating
        this.currentTurn = gameSettingsProps.currentTurn
        this.matchSettings = gameSettingsProps.matchSettings
        this.dlc = gameSettingsProps.dlc
        this.chances = gameSettingsProps.chances
        this.communityChests = gameSettingsProps.communityChests
        this.corners = gameSettingsProps.corners
        this.playerTokens = gameSettingsProps.playerTokens
        this.seriesNames = gameSettingsProps.seriesNames
        this.slotTypes = gameSettingsProps.slotTypes
        this.friendlyNames = gameSettingsProps.friendlyNames
        this.heavies = gameSettingsProps.heavies
        this.toptiers = gameSettingsProps.toptiers
        this.parkingCoords = gameSettingsProps.parkingCoords
        this.playerColours = gameSettingsProps.playerColours
        this.handicapBands = gameSettingsProps.handicapBands
    }

    private _shuffleCards() {
        this.communityChests = this.communityChests.sort(() => 0.5 - Math.random())
        this.chances = this.chances.sort(() => 0.5 - Math.random())
    }

    private loadImages() {
        if (localStorage.slots && !window.location.search.includes('room')) {
            $('#resume_div').removeClass('hidden')
        } else {
            $('#setup_div').removeClass('hidden')
        }

        let canvasFont = new FontFace('Futura PT Medium', 'url(./assets/font/FuturaCyrillicMedium.woff)')
        canvasFont.load().then(() => {
            document.fonts.add(canvasFont)
        })

        let playerDropdowns = $('select.player_token_select')
        this.playerTokens.forEach((token) => {
            if (token !== 'parking_token') {
                playerDropdowns.append(
                    `<option value="${token}" data-content="<img width='50px' src='./assets/img/tokens/${token}.png' />"></option>`
                )
            }
        })
        playerDropdowns.val('')
        playerDropdowns.selectpicker({
            noneSelectedText: '?',
        })
        playerDropdowns.on('changed.bs.select', function () {
            // @ts-expect-error this is not inferred and cast as any
            const currentSelect = $(this)
            currentSelect.find('option').removeAttr('disabled')
            $(`select.player_token_select`)
                .not(`#${currentSelect.attr('id')}`)
                .each((_, element) => {
                    $(element).find(`option[value="${currentSelect.val()}"]`).attr('disabled', 'true')
                })

            playerDropdowns.selectpicker('refresh')
        })

        this.images.house = new Image()
        this.images.house.src = './assets/img/house.png'
        this.images.hotel = new Image()
        this.images.hotel.src = './assets/img/hotel.png'
        this.images.boardMiddle = new Image()
        this.images.boardMiddle.src = './assets/img/top_image.png'
        this.images.parking = new Image()
        this.images.parking.src = './assets/img/parking.png'

        this.slotTypes.forEach((slotType) => {
            if (slotType.pool) {
                const folder = ['station', 'chest', 'chance', 'visiting'].includes(slotType.type)
                    ? slotType.type
                    : 'slots'
                const extension = ['chest', 'chance', 'station'].includes(slotType.type)
                    ? 'png'
                    : folder === 'slots'
                    ? 'webp'
                    : 'jpg'

                slotType.pool.forEach((poolItem) => {
                    if (Array.isArray(poolItem)) {
                        poolItem.forEach((innerPool) => {
                            if (!images[innerPool]) {
                                images[innerPool] = new Image()
                                images[innerPool].src = `./assets/img/${folder}/${innerPool}.${extension}`
                            }
                        })
                    } else {
                        if (!images[poolItem]) {
                            images[poolItem] = new Image()
                            images[poolItem].src = `./assets/img/${folder}/${poolItem}.${extension}`
                        }
                    }
                })
            }
        })

        this.communityChests.forEach((chest) => {
            this.images['chest' + chest.fileIndex] = new Image()
            this.images['chest' + chest.fileIndex].src = `./assets/img/cards/chest/CC ${chest.fileIndex}.jpg`
        })

        this.chances.forEach((chance) => {
            this.images['chance' + chance.fileIndex] = new Image()
            this.images['chance' + chance.fileIndex].src = `./assets/img/cards/chance/CHANCE ${chance.fileIndex}.jpg`
        })

        this.playerTokens.forEach((token) => {
            this.images[token] = new Image()
            this.images[token].src = `./assets/img/tokens/${token}.png`
        })

        this.seriesNames.forEach((series) => {
            this.images.series[series.name] = new Image()
            this.images.series[series.name].src = `./assets/img/series/${series.name}.png`
        })
    }
}
