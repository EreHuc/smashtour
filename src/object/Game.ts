import DiceBox from '@3d-dice/dice-box'
import { GameSettings } from './GameSettings.ts'
import { Character } from './Character.ts'
import { Card, Cards, Characters, Direction, Errors, SquareType } from '../type'
import { Slot } from './Slot.ts'
import { GameCanvas } from './canvas'
import { Player } from './Player.ts'
import { cards, playerTokens } from '../const'
import { closestHandicap, GameError, shuffleArray } from '../utils'

export class Game extends GameCanvas {
    get currentStep(): (typeof this.steps)[number] {
        return this._currentStep
    }
    set currentStep(value: (typeof this.steps)[number]) {
        this._currentStep = value
    }
    private slots: Slot[] = []
    private players: Player[] = []
    private readonly steps = ['rollDice', 'battle', 'losers', 'winner', 'result', 'gameOver'] as const
    private readonly diceBox: DiceBox
    private characters = Object.values(Characters)
    private cards = cards
    private request?: number
    private _currentStep: (typeof this.steps)[number] = 'rollDice'
    private playerTurn?: number
    private lap = 0
    private losers: Player[] = []
    private winner?: Player

    constructor(settings: GameSettings) {
        super(settings)
        this.diceBox = new DiceBox('#dice', {
            assetPath: '/dice/',
            throwForce: 15,
            theme: 'default',
            themeColor: '#ffffff',
            gravity: 2,
        })
        this.diceBox.init().then(() => {
            this.randomise().then(() => {
                const btnContainer = document.querySelector<HTMLDivElement>('div#buttons_container')
                if (!btnContainer) {
                    throw new GameError('no buttons container')
                }
                btnContainer.classList.remove('hidden')
                this.canvas.addEventListener('mousemove', (ev) => {
                    const x = ev.offsetX
                    const y = ev.offsetY

                    if (
                        this.slots.some((slot) => this.isInSlot(slot, x, y) && slot.blink) ||
                        this.players.some(
                            (p, i) =>
                                (p.chooseCharCard && this.uiCanvas.isInChooseCharCard(i, x, y)) ||
                                (p.freeJailCard && this.uiCanvas.isInFreeJailCard(i, x, y))
                        )
                    ) {
                        this.canvas.style.cursor = 'pointer'
                    } else {
                        this.canvas.style.cursor = 'default'
                    }
                })
            })
        })
    }

    public start(playerNames: string[]) {
        const startForm = document.querySelector<HTMLButtonElement>('form#start')
        if (!startForm) {
            throw new GameError('no start form')
        }
        startForm.classList.add('hidden')
        const playerColors = ['#000000', '#ff0000', '#00ff00', '#0000ff']
        let randomTokens = playerTokens.sort(() => 0.5 - Math.random())
        this.players = playerNames.map((name, i) => {
            let [currentTokens, ...restTokens] = randomTokens
            randomTokens = restTokens
            return new Player(name, playerColors[i], this.slots.length, currentTokens)
        })
        shuffleArray(this.players)
        this.uiCanvas.addGeneralInfos(`Turn order : \n- ${this.players.map((player) => player.name).join('\n- ')}`)
        this.message(`Turn order : \n- ${this.players.map((player) => player.name).join('\n- ')}`)
        this.playerTurn = undefined
        Promise.all(
            this.players.map(
                (p) =>
                    new Promise<void>((resolve) => {
                        p.image.onload = () => {
                            resolve()
                        }
                    })
            )
        )
            .then(() => this.draw())
            .then(() => {
                this.currentStep = 'rollDice'
                this.nextStep()
            })
    }

    public resume() {
        const gameState = window.localStorage.getItem('game')
        if (gameState) {
            try {
                this.loadGame(JSON.parse(gameState) as Game)
                    .then(() => this.draw())
                    .then(() => {
                        const startForm = document.querySelector<HTMLButtonElement>('form#start')
                        if (!startForm) {
                            throw new GameError('no start form')
                        }
                        startForm.classList.add('hidden')

                        this.message('Previous game loaded')
                        return this.nextStep()
                    })
            } catch (e) {
                if (e instanceof Error && e.name === Errors.GameError) {
                    this.message(e.message)
                }
                this.message('Invalid previous game state')
                // No state loaded continue as usual
            }
        } else {
            this.message('No game state to load')
        }
    }

    public randomise() {
        return this.populateSlot()
            .then((slots) => {
                this.slots = slots
                return
            })
            .then(() => {
                shuffleArray(this.cards)
                shuffleArray(this.players)
            })
            .then(() => this.draw())
    }

    // TODO: Public for debug purpose only, need to be private to avoid unwanted drawing
    public draw() {
        if (!this.request) {
            return this.animate()
        }
        return Promise.reject('draw: try to animate more than once')
    }

    public rollDice(playerIndex: number) {
        const currentPlayer = this.players[playerIndex]
        if (currentPlayer) {
            if (!this.request) {
                this.diceBox.roll(['2d6']).then((result) => {
                    this.processDiceResult(currentPlayer, result)
                        .then(() => this.draw())
                        .then(() => this.processLandedSlot(currentPlayer))
                        .then(() => this.draw())
                        .then(() => this.processRollDice())
                })
            } else {
                throw new GameError('rollDice: already animating')
            }
        } else {
            throw new GameError(`rollDice: no current player for id: ${playerIndex}`)
        }
    }

    public setBattleWinner(playerIndex: number) {
        const { winner, losers } = this.players.reduce(
            (acc, player, index) => {
                if (index === playerIndex) {
                    acc.winner = player
                } else {
                    acc.losers.push(player)
                }
                return acc
            },
            { losers: [] } as unknown as {
                winner: Player
                losers: Player[]
            }
        )
        if (!winner) {
            throw new GameError(`rollDice: no battle winner for id: ${playerIndex}`)
        }
        this.winner = winner
        this.losers = losers
        this.nextStep()
    }

    /* STATE MANAGER */
    private saveState() {
        window.localStorage.setItem('game', JSON.stringify(this))
    }

    private loadGame(state: Game) {
        const characters = Object.values(Characters)
        const slots: Slot[] = state.slots.map((slot) => {
            const currentChar = characters.find((char) => char === slot.character?.name)
            return {
                ...slot,
                character: currentChar ? new Character(currentChar) : undefined,
            }
        })
        this._currentStep = state._currentStep
        this.playerTurn = state.playerTurn
        this.lap = state.lap
        this.players = state.players.map((p) => {
            const player = new Player(p.name, p.color, this.slots.length, p.imgSrc)
            player.load(p)
            if (player.freeJailCard) {
                this.processFreeJailCard(player)
            }
            if (player.chooseCharCard) {
                this.processCharacterChoiceCard(player)
            }
            return player
        })
        this.losers = state.losers.map((loser) => {
            const player = this.players.find((p) => p.id === loser.id)
            if (!player) {
                throw new GameError(`Loser with id: ${loser.id} doesn't match with players`)
            }
            return player
        })
        if (state.winner !== undefined) {
            const winner = this.players.find((p) => p.id === state.winner?.id)
            if (!winner) {
                throw new GameError(`Winner with id: ${state.winner.id} doesn't match with players`)
            }
            this.winner = winner
        } else {
            this.winner = state.winner
        }

        return this.waitForSlotImagesLoad(slots).then(() => {
            this.slots = slots
            console.log(this)
        })
    }

    /* RANDOM CHARACTER SELECTION */
    private pickRandomCharacter() {
        const index = Math.floor(Math.random() * this.characters.length)
        const char = this.characters[index]
        this.characters = this.characters.filter((_, i) => i !== index)
        return new Character(char)
    }

    private resetCharacterList() {
        this.characters = Object.values(Characters)
    }

    /* CREATE SLOT */
    private populateSlot(): Promise<Slot[]> {
        this.resetCharacterList()
        const slots = this.settings.squareList.map((square, i) => {
            const offset = Math.floor(i / (this.squarePerRow + 1))
            const index = i % (this.squarePerRow + 1)
            const isCorner = index === 0
            let h = this.cardHeight
            let x = 0
            let y = 0
            let w = isCorner ? this.cardHeight : this.cardWidth
            let direction: Direction
            let character: Character | undefined

            if (square.type !== SquareType.toJail) {
                switch (this.settings.rule) {
                    case 'random':
                        character = this.pickRandomCharacter()
                        break
                }
            }

            switch (offset) {
                case 0:
                    x = this.cardWidth * Math.max(index - 1, 0) + this.cardHeight * Math.min(index, 1)
                    y = 0
                    direction = Direction.top_right
                    break
                case 1:
                    x = this.canvasWidth - this.cardHeight
                    y = this.cardWidth * Math.max(index - 1, 0) + this.cardHeight * Math.min(index, 1)
                    h = w
                    w = this.cardHeight
                    direction = Direction.bottom_right
                    break
                case 2:
                    x = this.canvasWidth - this.cardWidth * index - this.cardHeight
                    y = this.canvasHeight - this.cardHeight
                    direction = Direction.bottom_left
                    break
                case 3:
                    x = 0
                    y = this.canvasHeight - this.cardWidth * index - this.cardHeight
                    h = w
                    w = this.cardHeight
                    direction = Direction.top_left
                    break
                default:
                    throw new GameError("A square can't have more than 4 corners !")
            }
            return {
                x,
                y,
                w,
                h,
                isCorner,
                direction,
                character,
                upgrade: 0,
                blink: false,
                locked: false,
                ...square,
            }
        })

        if (this.settings.rule === 'random') {
            const allTypeCard = (): void => {
                // check topTiers
                if (!slots.some((s) => s.character && this.settings.topTiers.includes(s.character.name))) {
                    const newSlot = slots[Math.floor(Math.random() * slots.length)]
                    if (newSlot.character) {
                        newSlot.character = new Character(
                            this.settings.topTiers[Math.floor(Math.random() * this.settings.topTiers.length)]
                        )
                    }
                    return allTypeCard()
                }

                // check pokemons
                if (!slots.some((s) => s.character && this.settings.pokemons.includes(s.character.name))) {
                    const newSlot = slots[Math.floor(Math.random() * slots.length)]
                    if (newSlot.character) {
                        newSlot.character = new Character(
                            this.settings.pokemons[Math.floor(Math.random() * this.settings.pokemons.length)]
                        )
                    }
                    return allTypeCard()
                }

                // check marios
                if (!slots.some((s) => s.character && this.settings.marios.includes(s.character.name))) {
                    const newSlot = slots[Math.floor(Math.random() * slots.length)]
                    if (newSlot.character) {
                        newSlot.character = new Character(
                            this.settings.marios[Math.floor(Math.random() * this.settings.marios.length)]
                        )
                    }
                    return allTypeCard()
                }

                // check heavies
                if (!slots.some((s) => s.character && this.settings.heavies.includes(s.character.name))) {
                    const newSlot = slots[Math.floor(Math.random() * slots.length)]
                    if (newSlot.character) {
                        newSlot.character = new Character(
                            this.settings.heavies[Math.floor(Math.random() * this.settings.heavies.length)]
                        )
                    }
                    return allTypeCard()
                }

                return
            }
            allTypeCard()
        }

        return this.waitForSlotImagesLoad(slots).then(() => slots)
    }

    /* ANIMATION ( requestAnimationFrame ) */
    private animate() {
        let start: number | undefined,
            shouldDraw = false
        return new Promise<void>((resolve) => {
            const animation = (time: number) => {
                if (start === undefined) {
                    start = time
                }
                const elapsed = time - start
                if (elapsed === 0) {
                    shouldDraw = this.drawBoard(this.slots, this.players)
                }

                if (shouldDraw) {
                    if (elapsed > 150) {
                        start = undefined
                    }
                    this.request = window.requestAnimationFrame(animation)
                } else {
                    this.request = undefined
                    resolve()
                }
            }

            this.request = window.requestAnimationFrame(animation)
        })
    }

    /* GAME STEP */
    private nextStep() {
        this.saveState()
        switch (this.currentStep) {
            case 'rollDice':
                this.playerTurn = undefined
                this.uiCanvas.resetGeneralInfos()
                this.currentStep = 'battle'
                this.processRollDice()
                break
            case 'battle':
                const winnerBtnContainer = document.querySelector<HTMLDivElement>('#winner_btn_container')
                const winnerButtons = document.querySelectorAll<HTMLButtonElement>('.winner')
                if (!winnerBtnContainer) {
                    throw new GameError('No Battle buttons container')
                }
                this.uiCanvas.resetGeneralInfos()
                this.diceBox.clear()
                this.players.forEach((player, index) => {
                    this.processHandicap(this.slots[player.slotIndex], player, index)
                })
                this.uiCanvas.addGeneralInfos('Battle begins, who won ?')
                this.message('Battle begins, who won ?')
                this.currentStep = 'losers'
                this.draw().then(() => {
                    winnerButtons.forEach((btn) => {
                        const playerIndex = btn.getAttribute('data-player-index')
                        if (playerIndex) {
                            const player = this.players[parseInt(playerIndex)]
                            if (player) {
                                btn.innerHTML = player.name
                            } else {
                                btn.classList.add('hidden')
                            }
                        }
                    })
                    winnerBtnContainer.classList.remove('hidden')
                })
                break
            case 'losers':
                this.uiCanvas.resetBattleInfos()
                this.uiCanvas.resetDiceResult()
                this.uiCanvas.resetExtraInfos()
                this.uiCanvas.resetGeneralInfos()
                this.currentStep = 'winner'
                this.processLosers(this.losers)
                this.draw().then(() => this.nextStep())
                break
            case 'winner':
                if (!this.winner) {
                    throw new GameError('No result without winner')
                }
                this.currentStep = 'gameOver'
                this.processWinner(this.winner)
                    .then(() => this.draw())
                    .then(() => this.nextStep())

                break
            case 'gameOver':
                this.uiCanvas.resetGeneralInfos()
                this.currentStep = 'rollDice'
                this.processGameOver()
                break
        }
        // players roll dice
        // players fight
        // looser is on house => lost char randomly
        // looser is on hotel => lost char
        // winner is on property => win or upgrade char is already possessed
        // winner not on property => win char or upgrade is no char available
    }

    /* SLOT OWNERSHIP */
    private giveSlotOwnership(player: Player | undefined, slot: Slot) {
        slot.owner = player ? player.id : player
        // slot.upgrade = 0
        let slotsInSet: Slot[] = []
        if (player) {
            if (slot.propertyColor) {
                slotsInSet = this.slots.filter(({ propertyColor }) => propertyColor === slot.propertyColor)
            } else if (slot.type === SquareType.station) {
                slotsInSet = this.slots.filter(({ type }) => type === SquareType.station)
            }
            if (slotsInSet.every(({ owner }) => owner === player.id)) {
                slotsInSet.forEach((slotInSet) => {
                    slotInSet.locked = true
                })
            } else {
                slotsInSet.forEach((slotInSet) => {
                    slotInSet.locked = false
                })
            }
        }
    }

    private giveRandomSlotOwnership(
        player: Player,
        slots = this.slots.filter((slot) => slot.owner === undefined),
        loser?: Player
    ) {
        const notOwnedSlot = slots.filter(
            (slot) => slot.type === SquareType.property || slot.type === SquareType.station
        )
        if (notOwnedSlot.length) {
            const randomSlot = notOwnedSlot[Math.floor(Math.random() * notOwnedSlot.length)]
            this.giveSlotOwnership(player, randomSlot)
            this.uiCanvas.addGeneralInfos(
                `${player.name} randomly own ${randomSlot.character?.friendlyName.join(' ')}${
                    loser ? ` from ${loser.name}` : ''
                }`
            )
            this.message(
                `${player.name} randomly own ${randomSlot.character?.friendlyName.join(' ')}${
                    loser ? ` from ${loser.name}` : ''
                }`
            )
            return true
        }
        return false
    }

    /* ROLL DICE */
    /** Select witch player should roll if not, go to next step */
    private processRollDice() {
        const rollBtn = document.querySelector<HTMLButtonElement>('button#roll')
        if (!rollBtn) {
            throw new GameError('No Roll dice button')
        }
        if (this.playerTurn === undefined) {
            this.playerTurn = 0
        } else if (this.players.length - 1 > this.playerTurn) {
            this.playerTurn += 1
        } else {
            this.playerTurn = undefined
        }
        if (rollBtn && this.playerTurn !== undefined) {
            rollBtn.classList.remove('hidden')
            rollBtn.setAttribute('data-player-index', this.playerTurn.toString())
        } else {
            this.nextStep()
        }
    }

    private async processLandedSlot(player: Player): Promise<void> {
        let landedSlot = this.slots[player.slotIndex]
        let reevaluate = false
        const playerIndex = this.players.findIndex((p) => p.id === player.id)

        switch (landedSlot.type) {
            case SquareType.toJail:
                const jailSlotIndex = this.slots.findIndex((slot) => slot.type === SquareType.jail)
                player.slotIndex = jailSlotIndex
                player.currentSlotIndex = jailSlotIndex
                player.inJail = this.lap
                landedSlot = this.slots[jailSlotIndex]
                break
            case SquareType.start:
                this.giveRandomSlotOwnership(player)
                break
            case SquareType.parking:
                const slotsOwnByTax = this.slots.filter((slot) => slot.owner === 'tax')
                slotsOwnByTax.forEach((slot) => {
                    this.giveSlotOwnership(player, slot)
                })
                break
            case SquareType.chance:
                const card = this.selectCard()
                await this.displayCard(card)
                switch (card.id) {
                    case Cards.goBack:
                        await this.processGoBack(player)
                        break
                    case Cards.destroy:
                        await this.processDestroyProperty(player)
                        break
                    case Cards.goToStation:
                        await this.processGoToNextStation(player)
                        reevaluate = true
                        break
                    case Cards.goToStart:
                        await this.processGoToStart(player)
                        reevaluate = true
                        break
                    case Cards.goToPokemon:
                        await this.processGoToNextPkmn(player)
                        reevaluate = true
                        break
                    case Cards.goToTopTiers:
                        await this.processGoToNextTopTier(player)
                        reevaluate = true
                        break
                    case Cards.goToMarios:
                        await this.processGoToNextMarios(player)
                        reevaluate = true
                        break
                    case Cards.freeJailCard:
                        this.processFreeJailCard(player)
                        break
                    case Cards.goToJail:
                        await this.processGoToJail(player)
                        reevaluate = true
                        break
                    case Cards.goToTax:
                        await this.processGoToTax(player)
                        reevaluate = true
                        break
                    case Cards.goToParking:
                        await this.processGoToParking(player)
                        reevaluate = true
                        break
                    case Cards.playAsRandom:
                        this.processPlayAsRandom()
                        this.uiCanvas.addExtraInfos(playerIndex, 'Play as random')
                        break
                    case Cards.goToNextHeavies:
                        await this.processGoToNextHeavies(player)
                        reevaluate = true
                        break
                    case Cards.characterChoiceCard:
                        this.processCharacterChoiceCard(player)
                        break
                    case Cards.hitOneFreeMove:
                        this.uiCanvas.addExtraInfos(playerIndex, 'Hit one free move')
                        break
                    case Cards.pickStage:
                        this.uiCanvas.addExtraInfos(playerIndex, 'Pick the next stage')
                        break
                    case Cards.randomStage:
                        this.uiCanvas.addExtraInfos(playerIndex, 'Random stage !')
                        break
                    case Cards.metalFight:
                        this.uiCanvas.addExtraInfos(playerIndex, 'Metal fight !')
                        break
                }
                break
            default:
        }

        if (reevaluate) {
            return this.processLandedSlot(player)
        }

        this.processHandicap(landedSlot, player, playerIndex, false)

        return
    }

    private processHandicap(slot: Slot, player: Player, playerIndex: number, logs = true) {
        let handicap = slot.owner ? (slot.owner === player.id ? 0 : slot.handicap) : 0
        if (slot.type === SquareType.station) {
            handicap =
                handicap * this.slots.filter((s) => s.owner === slot.owner && s.type === SquareType.station).length
        } else if (slot.owner && slot.propertyColor) {
            const isFullSet = this.slots
                .filter((s) => s.propertyColor === slot.propertyColor)
                .every((s) => s.owner === slot.owner)
            if (isFullSet) {
                handicap += 50
            }
        }

        handicap = closestHandicap(handicap)

        this.uiCanvas.addBattleInfos(
            player,
            playerIndex,
            `${player.name}: ${slot.character?.friendlyName.join(' ')} - ${handicap}%`
        )
        if (logs) {
            if (slot.character) {
                this.message(`${player.name}: ${slot.character?.friendlyName.join(' ')} - ${handicap}%`)
            }
        }
    }

    private processDiceResult(player: Player, dice: IndividualDieResult[]) {
        const [die1, die2] = dice
        // const [die1, die2] = [{ value: 0 }, { value: 0 }] as IndividualDieResult[]
        this.uiCanvas.addDiceResult(
            this.players.findIndex((p) => p.id === player.id),
            [die1, die2]
        )
        if (player.inJail) {
            if (die1.value === die2.value) {
                player.slotIndex += die1.value + die2.value
                player.inJail = undefined
                this.uiCanvas.addGeneralInfos(`${player.name} roll double, out of jail`)
                this.message(`${player.name} roll double, out of jail`)
            } else if (player.inJail + 3 <= this.lap) {
                player.slotIndex += die1.value + die2.value
                player.inJail = undefined
                this.uiCanvas.addGeneralInfos(`${player.name} is out of jail, roll ${die1.value + die2.value}`)
                this.message(`${player.name} is out of jail, roll ${die1.value + die2.value}`)
            } else {
                this.message(`${player.name} is still in jail`)
                this.uiCanvas.addGeneralInfos(`${player.name} is still in jail`)
            }
        } else {
            player.slotIndex += die1.value + die2.value
            this.message(`${player.name} roll ${die1.value + die2.value}`)
            this.uiCanvas.addGeneralInfos(`${player.name} roll ${die1.value + die2.value}`)
        }
        return Promise.resolve()
    }

    /* LOSER */
    private processLosers(losers: Player[]) {
        if (!this.winner) {
            throw new GameError("Can't have no winner if losers")
        }
        const currentLoser = losers[0]

        if (!currentLoser) {
            console.log('no more losers, next step')
            return
        }

        const loserSlot = this.slots[currentLoser.slotIndex]

        const charOwnedByLoser = this.slots.filter((slot) => slot?.owner === currentLoser.id && !slot.locked)
        if (charOwnedByLoser.length) {
            switch (loserSlot.type) {
                case SquareType.tax:
                    this.giveRandomSlotOwnership({ name: 'Tax', id: 'tax' } as Player, charOwnedByLoser, currentLoser)
                    break
                default:
                    switch (this.slots[currentLoser.slotIndex].upgrade) {
                        // HOTEL
                        case 2:
                            this.setSlotBlink(currentLoser)
                            this.uiCanvas.addGeneralInfos(`${this.winner.name} choose a character to gain`)
                            this.message(`${this.winner.name} choose a character to gain`)
                            const handler = (ev: MouseEvent) => {
                                const x = ev.offsetX
                                const y = ev.offsetY
                                charOwnedByLoser.forEach((slot) => {
                                    if (this.isInSlot(slot, x, y)) {
                                        this.giveSlotOwnership(this.winner, slot)
                                        this.uiCanvas.addGeneralInfos(
                                            `${currentLoser.name} lost ${slot?.character?.friendlyName.join(' ')}`
                                        )
                                        this.message(
                                            `${currentLoser.name} lost ${slot?.character?.friendlyName.join(' ')}`
                                        )
                                        this.resetBlink()
                                        this.losers = this.losers.slice(1)
                                        this.canvas.removeEventListener('mousedown', handler)
                                        this.processLosers(this.losers)
                                    }
                                })
                            }
                            this.canvas.addEventListener('mousedown', handler)
                            break
                        // HOUSE
                        case 1:
                            this.giveRandomSlotOwnership(this.winner, charOwnedByLoser, currentLoser)
                            this.losers = losers.slice(1)
                            this.processLosers(this.losers)
                            break
                        // DEFAULT PROPERTY LEVEL
                        default:
                            this.losers = losers.slice(1)
                            this.processLosers(this.losers)
                            break
                    }
            }
        } else {
            console.log('no char to lose, next loser !')
            this.losers = losers.slice(1)
            this.processLosers(this.losers)
        }

        return
    }

    /* WINNER */
    private processWinner(winner: Player) {
        const handleWinner = () => {
            const winnerSlot = this.slots[winner.slotIndex]
            this.uiCanvas.addGeneralInfos(`${winner.name} win battle`)
            this.message(`${winner.name} win battle`)

            if ([SquareType.toJail, SquareType.tax].includes(winnerSlot.type)) {
                return Promise.resolve(false)
            }

            if (winnerSlot.type === SquareType.jail && winner.inJail) {
                winner.inJail = undefined
                this.uiCanvas.addGeneralInfos(`${winner.name} is now out of jail`)
                this.message(`${winner.name} is now out of jail`)
                return Promise.resolve(true)
            }

            if ([SquareType.chance, SquareType.jail, SquareType.start, SquareType.parking].includes(winnerSlot.type)) {
                const isGiven = this.giveRandomSlotOwnership(winner)
                if (!isGiven) {
                    return Promise.resolve(true)
                }
                return Promise.resolve(false)
            }

            if (winnerSlot.owner === undefined) {
                this.giveSlotOwnership(winner, winnerSlot)
                this.uiCanvas.addGeneralInfos(`${winner.name} now own ${winnerSlot?.character?.friendlyName.join(' ')}`)
                this.message(`${winner.name} now own ${winnerSlot?.character?.friendlyName.join(' ')}`)
                return Promise.resolve(false)
            }

            if (winner.id === winnerSlot.owner && winnerSlot.upgrade < 2 && winnerSlot.type !== SquareType.station) {
                winnerSlot.upgrade += 1
                return Promise.resolve(false)
            }

            return Promise.resolve(true)
        }

        const handler = (ev: MouseEvent) => {
            const x = ev.offsetX
            const y = ev.offsetY

            this.slots.forEach((slot) => {
                if (this.isInSlot(slot, x, y) && slot.blink && slot.owner === winner.id) {
                    slot.upgrade += 1
                }
            })
            this.resetBlink()
            this.canvas.removeEventListener('mousedown', handler)
        }

        return handleWinner().then((isWinnerUpgrade) => {
            if (isWinnerUpgrade) {
                this.setSlotBlink(
                    winner,
                    this.slots.filter((slot) => slot.upgrade < 2 && slot.type !== SquareType.station)
                )
                this.canvas.addEventListener('mousedown', handler)
            }
        })
    }

    /* GAME OVER */
    private processGameOver() {
        const sets = this.players.reduce((acc, player) => {
            acc[player.id] = {}
            this.slots.forEach((slot) => {
                const owned = slot.owner === player.id ? 1 : 0
                if (slot.propertyColor) {
                    const propertySlot = acc[player.id][slot.propertyColor] || { owned: 0, total: 0 }
                    acc[player.id][slot.propertyColor] = {
                        ...propertySlot,
                        owned: propertySlot.owned + owned,
                        total: propertySlot.total + 1,
                    }
                    return
                }
                if (slot.type === SquareType.station) {
                    const station = acc[player.id][slot.type] || { owned: 0, total: 0 }
                    acc[player.id][slot.type] = {
                        ...station,
                        owned: station.owned + owned,
                        total: station.total + 1,
                    }
                }
            })
            return acc
        }, {} as Record<string, Record<string, Record<'owned' | 'total', number>>>)
        let setToWin: number
        switch (this.players.length) {
            case 4:
                setToWin = 1
                break
            case 3:
                setToWin = 2
                break
            default:
                setToWin = 3
        }
        const winner = Object.entries(sets).find(
            ([_, properties]) =>
                Object.values(properties).reduce((acc, { owned, total }) => {
                    if (owned === total) {
                        acc += 1
                    }
                    return acc
                }, 0 as number) > setToWin
        )

        this.lap += 1

        if (winner) {
            const player = this.players.find((p) => p.id === winner[0])
            this.uiCanvas.addGeneralInfos(
                `${player?.name} win with ${Object.values(winner[1]).reduce((acc, { owned, total }) => {
                    if (owned === total) {
                        acc += 1
                    }
                    return acc
                }, 0 as number)} sets !`
            )
            this.message(
                `${player?.name} win with ${Object.values(winner[1]).reduce((acc, { owned, total }) => {
                    if (owned === total) {
                        acc += 1
                    }
                    return acc
                }, 0 as number)} sets !`
            )
        } else {
            /** reset */
            this.winner = undefined
            this.losers = []
            this.playerTurn = 0
            /** end reset */
            this.nextStep()
        }
    }

    /* CARDS EFFECT */
    private processGoBack(player: Player) {
        player.slotIndex -= 3
        return Promise.resolve()
    }

    private processDestroyProperty(player: Player) {
        const handler = (ev: MouseEvent) => {
            const x = ev.offsetX
            const y = ev.offsetY
            this.slots.forEach((slot) => {
                if (this.isInSlot(slot, x, y) && slot.blink && slot.owner !== player.id) {
                    this.giveSlotOwnership(undefined, slot)
                    this.resetBlink()
                    this.canvas.removeEventListener('click', handler)
                }
            })
        }
        this.canvas.addEventListener('click', handler)
        this.slots.forEach((slot) => {
            if (slot.owner && slot.owner !== player.id) {
                slot.blink = true
            }
        })
        return this.draw().then(() => true)
    }

    private processGoToNextStation(player: Player) {
        const slots = [
            ...this.slots.slice((player.slotIndex + 1) % this.slots.length),
            ...this.slots.slice(0, (player.slotIndex + 1) % this.slots.length),
        ]
        const nextStationIndex = slots.findIndex((slot) => slot.type === SquareType.station) + 1
        player.slotIndex += nextStationIndex
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processGoToStart(player: Player) {
        player.slotIndex = 0
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processGoToNextPkmn(player: Player) {
        const slots = [
            ...this.slots.slice((player.slotIndex + 1) % this.slots.length),
            ...this.slots.slice(0, (player.slotIndex + 1) % this.slots.length),
        ]
        const nextPokemonIndex =
            slots.findIndex((slot) => slot.character && this.settings.pokemons.includes(slot.character.name)) + 1
        player.slotIndex += nextPokemonIndex
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processGoToNextTopTier(player: Player) {
        const slots = [
            ...this.slots.slice((player.slotIndex + 1) % this.slots.length),
            ...this.slots.slice(0, (player.slotIndex + 1) % this.slots.length),
        ]
        const nextTopTierIndex =
            slots.findIndex((slot) => slot.character && this.settings.topTiers.includes(slot.character.name)) + 1

        player.slotIndex += nextTopTierIndex
        console.log('processGoToNextTopTier@Game.ts -', nextTopTierIndex, this.slots[player.slotIndex])
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processGoToNextMarios(player: Player) {
        const slots = [
            ...this.slots.slice((player.slotIndex + 1) % this.slots.length),
            ...this.slots.slice(0, (player.slotIndex + 1) % this.slots.length),
        ]
        const nextMariosIndex =
            slots.findIndex((slot) => slot.character && this.settings.marios.includes(slot.character.name)) + 1
        player.slotIndex += nextMariosIndex
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processGoToNextHeavies(player: Player) {
        const slots = [
            ...this.slots.slice((player.slotIndex + 1) % this.slots.length),
            ...this.slots.slice(0, (player.slotIndex + 1) % this.slots.length),
        ]
        const nextHeavyIndex =
            slots.findIndex((slot) => slot.character && this.settings.heavies.includes(slot.character.name)) + 1
        player.slotIndex += nextHeavyIndex
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processFreeJailCard(player: Player) {
        const handler = (ev: MouseEvent) => {
            const x = ev.offsetX
            const y = ev.offsetY

            if (
                player.chooseCharCard &&
                this.uiCanvas.isInFreeJailCard(
                    this.players.findIndex((p) => p.id === player.id),
                    x,
                    y
                )
            ) {
                player.inJail = undefined
                player.freeJailCard = false
                this.uiCanvas.addGeneralInfos(`${player.name} is now free`)
                this.message(`${player.name} is now free`)
                this.drawBoard(this.slots, this.players)
                this.canvas.removeEventListener('mousedown', handler)
            }
        }
        player.freeJailCard = true
        this.canvas.addEventListener('mousedown', handler)
    }

    private processCharacterChoiceCard(player: Player) {
        const handler = (ev: MouseEvent) => {
            const x = ev.offsetX
            const y = ev.offsetY
            const playerIndex = this.players.findIndex((p) => p.id === player.id)

            if (player.chooseCharCard && this.uiCanvas.isInChooseCharCard(playerIndex, x, y)) {
                player.chooseCharCard = false
                this.uiCanvas.addExtraInfos(playerIndex, `${player.name} choose his character`)
                this.message(`${player.name} choose his character`)
                this.drawBoard(this.slots, this.players)
                this.canvas.removeEventListener('mousedown', handler)
            }
        }
        player.chooseCharCard = true
        this.canvas.addEventListener('mousedown', handler)
    }

    private processGoToJail(player: Player) {
        player.slotIndex = this.slots.findIndex((slot) => slot.type === SquareType.toJail)
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processGoToTax(player: Player) {
        player.slotIndex = this.slots.findIndex((slot) => slot.type === SquareType.tax)
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processGoToParking(player: Player) {
        player.slotIndex = this.slots.findIndex((slot) => slot.type === SquareType.parking)
        return Promise.resolve(this.slots[player.slotIndex])
    }

    private processPlayAsRandom() {
        return { character: { friendlyName: ['Random'] } } as Slot
    }

    /* BLINK */
    private setSlotBlink(player: Player, slots: Slot[] = this.slots) {
        slots.forEach((slot) => {
            if (slot?.owner === player.id) {
                slot.blink = true
            }
        })
    }

    private resetBlink() {
        this.slots.forEach((s) => {
            if (s.blink) {
                s.blink = false
            }
        })
    }

    /* UTILITIES */
    private message(message: string) {
        const logs = document.querySelector<HTMLDivElement>('#logs ul')
        if (logs) {
            const pElem = document.createElement('li')
            pElem.innerHTML = message
            logs.appendChild(pElem)
        }
        console.info(message)
    }

    private waitForSlotImagesLoad(slots: Slot[]) {
        return Promise.all(
            slots
                .filter((slot) => slot.character !== undefined)
                .map(
                    (slot) =>
                        new Promise<void>((resolve) => {
                            // @ts-expect-error slot.character is defined
                            slot.character.image.onload = () => resolve()
                        })
                )
        )
    }

    private displayCard(card: Card) {
        const dialog = document.querySelector<HTMLDialogElement>('dialog#card')
        const confirmCardBtn = document.querySelector<HTMLButtonElement>('button#confirm')
        if (!dialog) {
            throw new GameError('dialog for displaying card is missing')
        }
        if (!confirmCardBtn) {
            throw new GameError('confirm button is missing')
        }
        return new Promise<void>((resolve) => {
            confirmCardBtn.innerHTML = card.text
            dialog.showModal()
            let handler = () => {
                dialog.close()
                resolve()
                confirmCardBtn.removeEventListener('click', handler)
            }
            confirmCardBtn.addEventListener('click', handler)
        })
    }

    private selectCard() {
        const [selected, ...cards] = this.cards
        this.cards = [...cards, selected]
        return selected
    }
}
