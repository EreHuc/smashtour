import { CustomError } from '../utils'
import { Chance, CommunityChest, Corner, Name, SlotType } from '../const'
import { GameSettings } from './GameSettings.ts'
import { Player } from './Player.ts'
import { Direction } from '../type'
import { Canvas } from './Canvas.ts'
import { RollingPlayer } from '../type/RollingPlayer.ts'
import { Character } from '../const/type/Character.enum.ts'

export type Slot = Omit<Corner, 'name' | 'type'> & {
    name: Name
    type: Name
    owner?: number | string
    locked?: boolean
    house?: boolean
    hotel?: boolean
    justWon?: boolean
    left?: number
    right?: number
    top?: number
    bottom?: number
    ownLeft?: number
    ownTop?: number
    iconX?: number
    iconY?: number
    direction?: Direction
    index?: number
    property?: boolean
    heavy?: boolean
    toptier?: boolean
    drawSlot?: boolean
    opacity?: number
}

export class Game extends Canvas {
    rounds: number
    started: boolean
    slots: Slot[]
    players: Player[]
    processingRoll = false
    finishedAnimatingAction?: string
    rollingPlayer?: RollingPlayer
    total?: number

    constructor(props?: { gameSettings: GameSettings; canvasQuerySelector: string }) {
        super(props)
        this.rounds = 1
        this.started = false
        this.slots = []
        this.players = []
    }

    public start() {
        this.started = true
        this.canvas.addEventListener('mousedown', (e) => {
            this.getCursorPosition(e)
        })
        if (!this.slots.length) {
            this.populateSlots()
        }
    }

    public loadGameState(continuing: boolean = false) {
        $('#bottom_board').removeClass('hidden')
        this.slots = JSON.parse(localStorage.slots)
        this.players = JSON.parse(localStorage.players)
        this.loadGameSettingsState(JSON.parse(localStorage.gameSettings))
        $('.win').removeClass('hidden')
        $('.roll').addClass('hidden')
        $('#top_board').html('')
        this.players.forEach((player) => {
            this.addPlayerText(player)
            if (continuing) {
                this.configurePlayer(player)
            }
        })
        if (!continuing) {
            requestAnimationFrame(() => this.updateGameArea())
        }
    }

    public continueGame() {
        this.loadGameState(true)
        this.start()
        requestAnimationFrame(() => this.updateGameArea())
    }

    public configureGame(players: Player[]) {
        this.players = players
        this.players.forEach((player) => this.configurePlayer(player))

        switch (this.players.length) {
            case 3:
                this.winCondition = 2
                break
            case 4:
                this.winCondition = 1
                break
            default:
                this.winCondition = 3
        }
        // Create "token" object with settings

        this.start()
    }

    public win(playerIndex: number) {
        this.matchSettings.length = 0
        this.currentTurn = 0
        this.recentWinner = this.players[playerIndex]
        this.recentWinner.wins++
        // Winner is unbanned
        if (this.recentWinner.banned) {
            this.newMessage(this.recentWinner.name + ' won, now unbanned!', true)
            this.recentWinner.banned = false
            this.recentWinner.index = 10
            this.recentWinner.targetIndex = 10
        } else {
            this.newMessage(this.recentWinner.name + ' won!', true)
        }

        // If the loser is on a property owned by opponent, winner steals a random character
        // if (slots[loser.index].owner == winner.playerIndex) {
        //     claimRandomCharacter(winner, loser)
        // }
        // Other player checks
        this.loserCheck(0)
    }

    public randomiseBoard() {
        this.slotTypes.forEach((slot) => {
            slot.count = undefined
        })
        this.slots = []
        this.populateSlots()
    }

    public toggleDLC() {
        if (this.dlc) {
            // If on, turn off
            this.dlc = false
            $('#toggleDLC').html('Turn DLC On')
            this.slotTypes.forEach((slotType) => {
                if (slotType.no_dlc) {
                    slotType.orig_pool = slotType.pool
                    slotType.pool = slotType.no_dlc
                }
            })
            this.randomiseBoard()
        } else {
            this.dlc = true
            $('#toggleDLC').html('Turn DLC Off')
            this.slotTypes.forEach((slotType) => {
                if (slotType.orig_pool) {
                    slotType.pool = slotType.orig_pool
                }
            })
            this.randomiseBoard()
        }
    }

    public processCard() {
        if (!this.rollingPlayer) {
            return
        }
        const rollingPlayer = this.rollingPlayer
        let cardDetails: Chance & CommunityChest =
            typeof rollingPlayer.chance !== 'undefined'
                ? this.chances[rollingPlayer.chance]
                : // @ts-expect-error at this point chances or chest is set for rolling player
                  this.communityChests[rollingPlayer.chest]
        rollingPlayer.chance = undefined
        rollingPlayer.chest = undefined
        let willAnimate = false
        if (cardDetails.targetIndex || cardDetails.targetIndex === 0) {
            if (cardDetails.targetIndex > -1) {
                rollingPlayer.targetIndex = cardDetails.targetIndex
            } else {
                rollingPlayer.targetIndex += cardDetails.targetIndex
                rollingPlayer.backwards = true
            }
            willAnimate = true
        } else if (cardDetails.text) {
            this.matchSettings.push(cardDetails.text)
            $('#match_settings .text').html('')
            this.matchSettings.forEach((text) => {
                $('#match_settings .text').prepend(`<br />${text}`)
            })
        } else if (cardDetails.playerText) {
            rollingPlayer.text = cardDetails.playerText
        } else if (cardDetails.type) {
            this.claimRandomCharacter(rollingPlayer, cardDetails.type)
        } else if (cardDetails.goto) {
            let gotoSlot = this.slots.find((slot) => slot.type === cardDetails.goto && slot.index > rollingPlayer.index)
            if (!gotoSlot) {
                gotoSlot = this.slots.find((slot) => slot.type === cardDetails.goto)
            }
            if (!gotoSlot) {
                throw 'Unable to find slot to go to for type ' + cardDetails.goto
            } else {
                rollingPlayer.targetIndex = gotoSlot.index
                willAnimate = true
            }
        } else if (cardDetails.gotoProperty !== undefined) {
            const gotoProperty = cardDetails.gotoProperty as keyof Slot
            let gotoSlot = this.slots.find((slot) => slot[gotoProperty] && slot.index > rollingPlayer.index)
            if (!gotoSlot) {
                gotoSlot = this.slots.find((slot) => slot[gotoProperty])
            }
            if (!gotoSlot) {
                throw 'Unable to find slot to go to for property ' + cardDetails.gotoProperty
            } else {
                rollingPlayer.targetIndex = gotoSlot.index
                willAnimate = true
            }
        } else if (cardDetails.showChest) {
            rollingPlayer.showChest = cardDetails
        } else if (cardDetails.showChance) {
            rollingPlayer.showChance = cardDetails
        } else if (cardDetails.banned) {
            rollingPlayer.banned = true
            rollingPlayer.index = 40
            rollingPlayer.targetIndex = 40
        } else if (cardDetails.handicapIncrease) {
            this.players.forEach((player) => {
                if (player.playerIndex !== rollingPlayer.playerIndex) {
                    this.addHandicap(player, 50)
                    this.addPlayerText(player)
                }
            })
        } else {
            console.log('non implemented card:')
            console.log(cardDetails)
        }

        if (willAnimate) {
            this.currentlyAnimating = true

            let newSlot = this.slots[rollingPlayer.targetIndex],
                slotType = newSlot.type

            switch (slotType) {
                case 'chest':
                    this.finishedAnimatingAction = 'chest'
                    break
                case 'chance':
                    this.finishedAnimatingAction = 'chance'
                    break
                case 'tobanned':
                    rollingPlayer.banned = true
                    break
            }
        }
        window.requestAnimationFrame(() => this.updateGameArea())
    }

    public rollDice() {
        let loops = 0
        let pip = '<span class="pip"></span>'
        let dice_roll = setInterval(() => {
            let die1 = Math.floor(Math.random() * 6) + 1,
                die2 = Math.floor(Math.random() * 6) + 1
            $('#die_1').html(pip.repeat(die1))
            $('#die_2').html(pip.repeat(die2))
            loops++
            if (loops === 10) {
                clearInterval(dice_roll)

                if (this.dieResult > 0) {
                    die1 = this.dieResult
                    die2 = 0
                    this.dieResult = 0
                }

                this.diceResult(die1, die2)
            }
        }, 50)
    }

    private getCursorPosition(event: MouseEvent) {
        const rect = (event.target as Element).getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        let clickedSlot = this.slots.find(
            (slot) =>
                slot.left * this.scale < x &&
                slot.right * this.scale > x &&
                slot.top * this.scale < y &&
                slot.bottom * this.scale > y
        )
        if (clickedSlot) {
            console.log(clickedSlot.name)
            this.processClickedSlot(clickedSlot)
        }
    }

    private processClickedSlot(clickedSlot: Slot) {
        if (!this.recentWinner) {
            return
        }

        if (this.losingCharacterIndex || this.losingCharacterIndex === 0) {
            if (clickedSlot.owner === this.losingCharacterIndex && !clickedSlot.locked) {
                this.newMessage(this.recentWinner.name + ' has stolen ' + clickedSlot.friendlyName, true)
                this.players[this.losingCharacterIndex].charactersLost++
                let nextLoser = this.losingCharacterIndex + 1
                this.losingCharacterIndex = undefined
                this.currentlyAnimating = false
                if (this.recentWinner) {
                    this.allocateOwner(clickedSlot.index, this.recentWinner)
                }
                if (!this.over) {
                    this.loserCheck(nextLoser)
                }
            } else {
                this.newMessage(
                    this.players[this.losingCharacterIndex].name + ' does not own ' + clickedSlot.friendlyName + '!',
                    true
                )
            }
        } else if (this.upgradeCharacterIndex || this.upgradeCharacterIndex === 0) {
            if (
                clickedSlot.owner === this.upgradeCharacterIndex &&
                !clickedSlot.hotel &&
                !['station', 'utility'].includes(clickedSlot.type)
            ) {
                if (!clickedSlot.house) {
                    clickedSlot.house = true
                    this.newMessage(
                        this.recentWinner.name + ' has upgraded ' + clickedSlot.friendlyName + ' to a house!'
                    )
                } else {
                    clickedSlot.hotel = true
                    this.newMessage(
                        this.recentWinner.name + ' has upgraded ' + clickedSlot.friendlyName + ' to a hotel!'
                    )
                }

                this.upgradeCharacterIndex = undefined
                this.currentlyAnimating = false
                this.allWinChecksDone()
            }
        }
    }

    private allocateOwner(slotIndex: number, newOwner: Player | RollingPlayer) {
        // Set new owner, remove house or hotel if it had them
        newOwner.charactersWon++
        this.slots[slotIndex].owner = newOwner.playerIndex
        this.slots[slotIndex].house = false
        this.slots[slotIndex].hotel = false
        this.slots[slotIndex].justWon = true
        // See if this player owns the set and lock it if so
        let slotType = this.slots[slotIndex].type
        let slotSet = this.slots.filter((slot) => slot.type === slotType)
        let ownedInSet = slotSet.filter((slot) => slot.owner === newOwner.playerIndex).length
        if (ownedInSet === slotSet.length) {
            newOwner.setCount++
            slotSet.forEach((item) => (item.locked = true))
            if (newOwner.setCount === this.winCondition) {
                this.gameOver(newOwner)
            }
        }
    }

    private gameOver(winner: Player) {
        const matchSettings$ = $('#match_settings .text')
        matchSettings$.html(
            `<div style='display: flex; flex-direction: column; align-items: center'><span>${winner.name} has won by holding ${winner.setCount} sets!</span><button type='button' class='button-1' onclick='location.reload()'>Restart</button></div>`
        )

        $('#bottom_board').addClass('hidden')
        this.losingCharacterIndex = undefined
        this.currentlyAnimating = false
        this.over = true
        this.players.forEach((player, index) => {
            let playerSection = $('.player[data-number="' + index + '"] .owned_characters')
            playerSection.html('')
            playerSection.append('Match Wins: ' + player.wins + '<br />')
            playerSection.append('Match Losses: ' + player.losses + '<br />')
            playerSection.append('Dice Total: ' + player.diceTotal + '<br />')
            let averageRoll = player.diceTotal / this.rounds
            playerSection.append('Average Roll: ' + averageRoll.toFixed(2) + '<br />')
            playerSection.append('Characters Won: ' + player.charactersWon + '<br />')
            playerSection.append('Characters Lost: ' + player.charactersLost + '<br />')
            playerSection.append('Final Sets: ' + player.setCount + '<br />')
        })
    }

    private loserCheck(playerIndex: number) {
        console.log('loser check ' + playerIndex)
        if (!this.recentWinner) {
            throw new CustomError('no recent winner for loser check')
        }
        if (playerIndex === this.players.length) {
            this.loserChecksDone()
            return
        }
        // Don't process winner, either jump to next or loser checks are done!
        if (playerIndex === this.recentWinner.playerIndex) {
            this.loserCheck(playerIndex + 1)
            return
        }
        const loser = this.players[playerIndex]
        // Update stats and clear variables
        loser.losses++
        loser.character = ''
        loser.handicap = 0
        loser.text = ''
        // If lost on a tax, cough up a character
        if (this.slots[loser.index].type.includes('tax')) {
            let loserOwns = this.slots.filter((slot) => slot.owner === playerIndex && !slot.locked)
            if (loserOwns.length) {
                const lostCharacterIndex = loserOwns[Math.floor(Math.random() * loserOwns.length)].index
                this.slots[lostCharacterIndex].owner = 'parking'
                loser.charactersLost++
                this.newMessage(loser.name + ' has lost ' + this.slots[lostCharacterIndex].friendlyName)
            } else {
                this.newMessage(loser.name + ' has no characters to lose!')
            }
        }
        // If lost on the winners hotel, they get to pick a character
        if (this.slots[loser.index].hotel && this.slots[loser.index].owner === this.recentWinner.playerIndex) {
            // Check if loser has any characters to lose!
            if (this.slots.filter((slot) => slot.owner === playerIndex).length) {
                this.newMessage(this.recentWinner.name + ', pick one of ' + loser.name + "'s characters to steal!")
                this.losingCharacterIndex = playerIndex
                this.currentlyAnimating = true
                window.requestAnimationFrame(() => this.updateGameArea())
            } else {
                this.newMessage(loser.name + ' has no characters to steal!')
                this.loserCheck(playerIndex + 1)
            }
        } else if (this.slots[loser.index].house && this.slots[loser.index].owner === this.recentWinner.playerIndex) {
            // Losing on winners house, lose random not locked character
            let loserOwns = this.slots.filter((slot) => slot.owner === playerIndex && !slot.locked)
            if (loserOwns.length) {
                let lostCharacterIndex = loserOwns[Math.floor(Math.random() * loserOwns.length)].index
                this.allocateOwner(this.slots[lostCharacterIndex].index, this.recentWinner)
                loser.charactersLost++
                this.newMessage(loser.name + ' has lost ' + this.slots[lostCharacterIndex].name)
            } else {
                this.newMessage(loser.name + ' has no ' + this.slots[loser.index].type + ' characters to steal!')
            }
            this.loserCheck(playerIndex + 1)
        } else {
            this.loserCheck(playerIndex + 1)
        }
    }

    private loserChecksDone() {
        let gotSomething = false
        if (!this.recentWinner) {
            throw new CustomError('no recent winner for loser check done')
        }
        // If the slot the winner is on is an unclaimed property, they win it
        if (!this.slots[this.recentWinner.index].justWon) {
            if (
                typeof this.slots[this.recentWinner.index].owner == 'undefined' &&
                this.slots[this.recentWinner.index].property
            ) {
                //slots[gameSettings.recentWinner.index].owner = gameSettings.recentWinner.playerIndex;
                this.allocateOwner(this.recentWinner.index, this.recentWinner)
                gotSomething = true
            } else if (
                this.slots[this.recentWinner.index].owner === this.recentWinner.playerIndex &&
                !['station', 'utility'].includes(this.slots[this.recentWinner.index].type)
            ) {
                // If they won on their own property which isn't a station or utility
                if (!this.slots[this.recentWinner.index].house) {
                    // Make a house if not yet
                    this.slots[this.recentWinner.index].house = true
                    gotSomething = true
                } else if (!this.slots[this.recentWinner.index].hotel) {
                    // Otherwise make a hotel!
                    this.slots[this.recentWinner.index].hotel = true
                    gotSomething = true
                }
            }
        }
        // If they're on a chance or community chest, they win a random character
        if (['chance', 'chest'].includes(this.slots[this.recentWinner.index].type)) {
            gotSomething = true
            this.claimRandomCharacter(this.recentWinner)
        }
        if (gotSomething) {
            this.allWinChecksDone()
            // @ts-expect-error gameSettings.recentWinner is defined
        } else if (!this.slots.filter((slot) => slot.owner === this.recentWinner.playerIndex).length) {
            // Claim a free character if you have none!
            this.claimRandomCharacter(this.recentWinner)
            this.allWinChecksDone()
        } else if (
            this.slots.filter(
                (slot) =>
                    // @ts-expect-error gameSettings.recentWinner is defined
                    slot.owner === this.recentWinner.playerIndex &&
                    !['station', 'utility'].includes(slot.type) &&
                    !slot.hotel
            ).length
        ) {
            // Otherwise let them upgrade a character, if they have any that aren't hotels
            this.newMessage(this.recentWinner.name + ', pick a character to upgrade!')
            this.upgradeCharacterIndex = this.recentWinner.playerIndex
            this.currentlyAnimating = true
            window.requestAnimationFrame(() => this.updateGameArea())
        } else {
            this.allWinChecksDone()
        }
    }

    private allWinChecksDone() {
        if (!this.recentWinner) {
            throw new CustomError('no recent winner for allWinChecksDone')
        }
        // Update stats and cleanup
        this.recentWinner.character = ''
        this.recentWinner.handicap = 0
        this.recentWinner.text = ''

        if (!this.over) {
            this.rounds++
        }

        $('.win').addClass('hidden')
        $('.roll').removeClass('hidden')
        this.updateGameArea()
        const undoButton = document.createElement('button')
        undoButton.type = 'button'
        undoButton.classList.add('button-1')
        undoButton.innerHTML = 'Undo'
        undoButton.setAttribute('style', 'margin-top: 20px')
        undoButton.addEventListener('click', () => this.loadGameState())
        this.newMessage(undoButton, false)
    }

    private claimRandomCharacter(claimer: Player, type?: string) {
        let charactersToClaim = this.slots.filter(
            (character) => character.property && typeof character.owner == 'undefined'
        )
        if (type) {
            charactersToClaim = this.slots.filter(
                (character) => character.property && typeof character.owner == 'undefined' && character.type === type
            )
        }
        let claimedIndex
        if (charactersToClaim.length) {
            claimedIndex = charactersToClaim[Math.floor(Math.random() * charactersToClaim.length)].index
            this.allocateOwner(claimedIndex, claimer)
            this.newMessage(claimer.name + ' won ' + this.slots[claimedIndex].friendlyName + '!')
        } else {
            // None to claim, check owned characters who aren't already a house and not a station or utility
            charactersToClaim = this.slots.filter(
                (character) =>
                    character.owner === claimer.playerIndex &&
                    !character.house &&
                    !['station', 'utility'].includes(character.type) &&
                    !character.justWon
            )
            if (type) {
                // Or that specific type
                charactersToClaim = this.slots.filter(
                    (character) =>
                        character.owner === claimer.playerIndex &&
                        !character.house &&
                        character.type === type &&
                        !character.justWon
                )
            }
            if (charactersToClaim.length) {
                claimedIndex = charactersToClaim[Math.floor(Math.random() * charactersToClaim.length)].index
                this.slots[claimedIndex].house = true
                this.newMessage(this.slots[claimedIndex].friendlyName + ' has been upgraded to a house!')
            } else {
                charactersToClaim = this.slots.filter(
                    (character) =>
                        character.owner === claimer.playerIndex &&
                        !character.hotel &&
                        !['station', 'utility'].includes(character.type) &&
                        !character.justWon
                )
                if (type) {
                    charactersToClaim = this.slots.filter(
                        (character) =>
                            character.owner === claimer.playerIndex &&
                            !character.hotel &&
                            character.type === type &&
                            !character.justWon
                    )
                }
                if (charactersToClaim.length) {
                    claimedIndex = charactersToClaim[Math.floor(Math.random() * charactersToClaim.length)].index
                    this.slots[claimedIndex].hotel = true
                    this.newMessage(this.slots[claimedIndex].friendlyName + ' has been upgraded to a hotel!')
                } else {
                    this.newMessage('No characters to claim or upgrade!')
                }
            }
        }

        return claimedIndex
    }

    private populateSlots() {
        this.slots = this._populateSlots()

        if (!this.slots.find((slot) => slot.heavy)) {
            const ridley = this.slots.find((slot) => slot.name === Character.ridley)
            if (ridley) {
                ridley.heavy = true
                console.log('ridley is now a heavy')
            } else {
                this.slots
                    .filter((slot) => slot.name === Character.samus || slot.name === Character.dark_samus)
                    .forEach((slot) => (slot.heavy = true))
                console.log('samuses now heavies')
            }
        }

        this.updateGameArea(true)
    }

    private processLandedSlot() {
        if (!this.rollingPlayer) {
            return
        }
        const rollingPlayer = this.rollingPlayer
        this.newMessage(rollingPlayer.name + ' landed on ' + this.slots[rollingPlayer.index].friendlyName)

        let slot = this.slots[rollingPlayer.index],
            slotType = slot.type,
            slotOwner = slot.owner

        let slotOwned =
            typeof slot.owner !== 'undefined' && slot.owner !== rollingPlayer.playerIndex && slot.owner !== 'parking'
        let ownedCount = slotOwned
            ? this.slots.filter((slot) => slot.owner === slotOwner && slot.type === slotType).length
            : 0
        let setTotal = this.slots.filter((slot) => slot.type === slotType).length
        let characterToPlay = slot.friendlyName
        let handicap = 0
        switch (slotType) {
            case 'free':
            case 'go':
                //alert('free character!');
                this.claimRandomCharacter(rollingPlayer)
                if (slotType === 'free') {
                    this.slots
                        .filter((slot) => slot.owner === 'parking')
                        .forEach((character) => {
                            this.allocateOwner(character.index, rollingPlayer)
                            this.newMessage(rollingPlayer.name + ' has claimed ' + character.friendlyName + '!<br />')
                        })
                    characterToPlay = 'Captain Falcon'
                } else {
                    characterToPlay = 'Terry'
                }

                break
            case 'lowtiertax':
            case 'lametax':
                rollingPlayer.text = 'Win, or lose a character!'
                break
            case 'utility':
                if (slotOwned) {
                    // if someone else owns the utility
                    // @ts-expect-error this.total is set a this point of game and expect getSlotProperty to not return undefined TODO: fix this !!
                    handicap = this.getSlotProperty(slotType, ownedCount === 2 ? 'two' : 'one')[this.total]
                }
                break
            case 'station':
                if (slotOwned) {
                    // @ts-expect-error ownedCount is set a this point of game and expect getSlotProperty to not return undefined TODO: fix this !!
                    handicap = this.getSlotProperty(slotType, 'handicaps')[ownedCount]
                }
                break
            default:
                if (slotOwned) {
                    // @ts-expect-error ownedCount is set a this point of game and expect getSlotProperty to not return undefined TODO: fix this !!
                    handicap = this.getSlotProperty(slotType, ownedCount === setTotal ? 'handicapSet' : 'handicap')
                }
                console.log(slotType)
        }

        characterToPlay = characterToPlay.toUpperCase()
        rollingPlayer.character = characterToPlay
        this.addHandicap(rollingPlayer, handicap)
        this.addPlayerText(rollingPlayer)

        this.updateGameArea()
    }

    private getSlotProperty(type: string, property: keyof SlotType): SlotType[keyof SlotType] | undefined {
        const slot = this.slotTypes.find((types) => types.type === type)
        return slot ? slot[property] : undefined
    }

    private addHandicap(player: Player, handicap: number) {
        player.handicap += handicap
        if (!this.handicapBands.includes(player.handicap)) {
            player.handicap = this.handicapBands.find((band) => band < player.handicap) ?? 0
        }
    }

    private addPlayerText(player: Player) {
        const $playerSettings = $('#p' + player.playerIndex + 'settings')
        if (player.character) {
            $playerSettings.html(
                `${player.character}<br /><span class='handicap handicap-${player.handicap}'>${player.handicap} %</span>`
            )
            if (player.text) {
                $playerSettings.append(`<br /><span style="font-size:16px;">${player.text}</span>`)
            }
        } else {
            $playerSettings.html('')
        }
    }

    private addPlayerCards() {
        $('.owned_characters').html('')
        // Add any held cards to area
        this.players.forEach((player) => {
            if (player.showChest || player.showChance) {
                let ownedElement = $('.player[data-number="' + player.playerIndex + '"] .owned_characters')
                if (player.showChest) {
                    const img = new Image(120)
                    img.src = `cards/chest/CC${player.showChest.fileIndex}.jpg`
                    img.classList.add('pointer')
                    img.setAttribute('style', 'width:120px;margin-bottom:3px;')
                    img.addEventListener('click', () => {
                        this.useCard(player.playerIndex, 'chest')
                    })
                    ownedElement.prepend(img)
                }
                if (player.showChance) {
                    const img = new Image(120)
                    img.src = `./assets/img/cards/chance/CHANCE${player.showChance.fileIndex}.jpg`
                    img.classList.add('pointer')
                    img.setAttribute('style', 'width:120px;margin-bottom:3px;margin-right:5px;')
                    img.addEventListener('click', () => {
                        this.useCard(player.playerIndex, 'chance')
                    })
                }
            }
        })
        let cardOrder = [
            5, 15, 25, 35, 1, 3, 6, 8, 9, 11, 13, 14, 16, 18, 19, 21, 23, 24, 26, 27, 29, 31, 32, 34, 37, 39, 12, 28,
        ]
        cardOrder.forEach((slotIndex) => {
            let item = this.slots[slotIndex]
            let characterColour = this.getSlotProperty(item.type, 'colour') ?? ''
            let characterCard = `<div class='character_card' style='background-color: ${characterColour}'>
              <img src='${this.images[item.name].src}' class='owned_${item.type}' width='30px'>
              ${item.friendlyName}
            `

            if (item.hotel) {
                characterCard += ' <img src="./assets/img/hotel.png" />'
            } else if (item.house) {
                characterCard += ' <img src="./assets/img/house.png" />'
            }
            characterCard += '</div>'
            $(`.player[data-number="${item.owner}"] .owned_characters`).append(characterCard)
        })
    }

    private useCard(playerIndex: number, cardType: string) {
        this.players[playerIndex].character = 'CHOICE'
        if (cardType === 'chest') {
            this.players[playerIndex].showChest = undefined
        } else {
            this.players[playerIndex].showChance = undefined
        }
        this.addPlayerText(this.players[playerIndex])
        requestAnimationFrame(() => this.updateGameArea())
    }

    private configurePlayer(player: Player) {
        let num = player.playerIndex
        // Add player name and colour to section
        $(`.player[data-number="${num}"], #p${num}name`)
            .prepend(`${player.name} <img width="40px" src="./assets/img/tokens/${player.icon}.png" />`)
            .css('color', this.playerColours[num])
            .removeClass('hidden')
        // Add player name and colour to win button and board area
        $(`#p${num}button`).html(player.name).css('background-color', this.playerColours[num]).removeClass('hidden')
    }

    private updateGameArea(showSeries: boolean = false) {
        this._updateGameArea(this.slots, this.players, this.playerColours, showSeries)
        if (this.currentlyAnimating) {
            window.requestAnimationFrame(() => this.updateGameArea(showSeries))
        } else {
            if (this.processingRoll) {
                switch (this.finishedAnimatingAction) {
                    case 'chance':
                        if (this.rollingPlayer) {
                            this.rollingPlayer.chance = this.chanceCounter
                            this.animateCard(this.rollingPlayer)
                        }
                        this.chanceCounter++
                        if (this.chanceCounter === 15) {
                            this.chanceCounter = 0
                        }
                        break
                    case 'chest':
                        if (this.rollingPlayer) {
                            this.rollingPlayer.chest = this.chestCounter
                            this.animateCard(this.rollingPlayer)
                        }
                        this.chestCounter++
                        if (this.chestCounter === 15) {
                            this.chestCounter = 0
                        }
                        break
                    default:
                        this.processingRoll = false
                        this.processLandedSlot()
                        if (this.currentTurn > this.players.length - 1) {
                            $('.win').removeClass('hidden')
                            $('.roll').addClass('hidden')
                            localStorage.setItem('slots', JSON.stringify(this.slots))
                            localStorage.setItem('players', JSON.stringify(this.players))
                            localStorage.setItem('gameSettings', JSON.stringify(this.saveGameSettingsState()))
                        } else {
                            $('#roll_dice').removeClass('hidden')
                        }
                }
                this.finishedAnimatingAction = undefined
            }
            if (!this.over) {
                this.addPlayerCards()
            }
        }
    }

    private diceResult(die1: number, die2: number) {
        this.processingRoll = true
        this.rollingPlayer = this.players[this.currentTurn]

        this.currentTurn++

        this.rollingPlayer.diceTotal += die1 + die2

        if (die1 === die2 && this.rollingPlayer.banned) {
            this.newMessage('Rolled doubles, unbanned!', true)
            this.rollingPlayer.banned = false
            this.rollingPlayer.index = 10
            this.rollingPlayer.targetIndex = 10
        }

        if (this.rollingPlayer.banned) {
            this.newMessage(this.rollingPlayer.name + ' did not roll doubles, still banned!', true)
            $('#roll_dice').removeClass('hidden')
            requestAnimationFrame(() => this.updateGameArea())
            return
        }

        this.total = die1 + die2
        const override$ = $('#override')
        if (override$.val()) {
            this.total = parseInt(override$.val() as string)
        }
        this.rollingPlayer.targetIndex += this.total
        if (this.rollingPlayer.targetIndex >= 40) {
            this.rollingPlayer.targetIndex -= 40
        }

        let newSlot = this.slots[this.rollingPlayer.targetIndex],
            slotType = newSlot.type

        switch (slotType) {
            case 'chest':
                this.finishedAnimatingAction = 'chest'
                break
            case 'chance':
                this.finishedAnimatingAction = 'chance'
                break
            case 'tobanned':
                this.rollingPlayer.banned = true
                break
        }

        this.currentlyAnimating = true
        window.requestAnimationFrame(() => this.updateGameArea())
    }

    private newMessage(message: JQuery.htmlString | JQuery.Node, clearFirst: boolean = false) {
        console.log('adding message')
        const topBoard$ = $('#top_board')
        if (clearFirst) {
            topBoard$.html(message)
            topBoard$.append(`<br />`)
        } else {
            topBoard$.append(message)
            topBoard$.append(`<br />`)
        }
    }
}
