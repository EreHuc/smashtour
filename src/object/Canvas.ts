import { CustomError } from '../utils'
import { Direction } from '../type'
import { GameSettings } from './GameSettings.ts'
import { Slot } from './Game.ts'
import { Player } from './Player.ts'
import { RollingPlayer } from '../type/RollingPlayer.ts'
import { Character } from '../const/type/Character.enum.ts'
import { SlotTypeName } from '../const/type/SlotTypeName.enum.ts'
import { Name } from '../const'

export class Canvas extends GameSettings {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    standardWidth = 82.7
    standardHeight = 127
    cardWidth = 0
    cardHeight = 0
    scale = 1

    constructor(
        props: {
            gameSettings: GameSettings
            canvasQuerySelector: string
        } = { gameSettings: new GameSettings(), canvasQuerySelector: '#game' }
    ) {
        super(props.gameSettings)
        const canvas = document.querySelector<HTMLCanvasElement>(props.canvasQuerySelector)
        if (!canvas) {
            throw new CustomError(`no canvas ${props.canvasQuerySelector}`)
        }
        const context = canvas.getContext('2d')
        if (!context) {
            throw new CustomError(`no context for canvas ${props.canvasQuerySelector}`)
        }
        this.context = context
        this.canvas = canvas
        this.canvas.width = 1000
        this.canvas.height = 1000
        this.resize()
    }

    public strokeRectangle(width: number, height: number, x: number, y: number, color: string) {
        this.context.fillStyle = color
        this.context.strokeStyle = color
        this.context.lineWidth = 3
        this.context.strokeRect(x, y, width, height)
    }

    public clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }

    public _populateSlots(): Slot[] {
        const slots: Slot[] = []
        this.corners.forEach((corner) => {
            let tmpCorner: Slot = { ...corner }
            // First draw that corner
            let height = corner.bottom - corner.top
            let width = corner.right - corner.left
            this.strokeRectangle(width, height, corner.left, corner.top, 'red')
            // Now populate slots between with next
            let direction: Direction
            let startX: number
            let startY: number
            switch (corner.type) {
                case 'go':
                    direction = Direction.right_left
                    startX = corner.left
                    startY = corner.top
                    break
                case 'visiting':
                    direction = Direction.bottom_top
                    startX = corner.left
                    startY = corner.top
                    break
                case 'freecharacter':
                    direction = Direction.left_right
                    startX = corner.right - this.standardWidth
                    startY = corner.top
                    break
                case 'tobanned':
                    direction = Direction.top_bottom
                    startX = corner.left
                    startY = corner.bottom - this.standardWidth
                    break
            }

            if (tmpCorner.type === 'visiting') {
                if (tmpCorner.pool?.length) {
                    tmpCorner.name = tmpCorner.pool[Math.floor(Math.random() * tmpCorner.pool.length)] as Character
                    const friendlyNames = this.friendlyNames[corner.name]
                    if (friendlyNames !== undefined) {
                        tmpCorner.friendlyName = friendlyNames
                    } else {
                        tmpCorner.friendlyName = corner.name.charAt(0).toUpperCase() + corner.name.slice(1)
                    }
                }
            } else if (tmpCorner.type === 'banned') {
                const visitingSlot = slots.find((slot) => slot.type === SlotTypeName.visiting)
                if (visitingSlot) {
                    tmpCorner.name = visitingSlot.name
                    tmpCorner.friendlyName = visitingSlot.friendlyName
                }
            }

            slots.push(tmpCorner)

            corner.next?.forEach((nextType, index) => {
                let character: Name
                let slotType = this.slotTypes.find((type) => type.type === nextType)
                if (!slotType) {
                    throw new Error(
                        `no slotType found for next: «${nextType}» index in corner : ${JSON.stringify(corner)}`
                    )
                }
                if (!slotType.pool) {
                    throw new Error(
                        `no slotType pool found for next: «${nextType}» index in corner : ${JSON.stringify(corner)}`
                    )
                }
                if (slotType?.count === undefined) {
                    // First time on this slot, randomise pool!
                    slotType.pool.sort(() => 0.5 - Math.random())
                    if (Array.isArray(slotType.pool[0])) {
                        slotType.pool[0].sort(() => 0.5 - Math.random())
                        character = slotType.pool[0][0]
                    } else {
                        character = slotType.pool[0]
                    }
                    slotType.count = 0
                } else {
                    slotType.count++
                    if (Array.isArray(slotType.pool[0])) {
                        character = slotType.pool[0][slotType.count]
                    } else {
                        // @ts-expect-error slotType.pool is not and string[][]
                        character = slotType.pool[slotType.count]
                    }
                }

                let width, height, ownLeft, ownTop, iconX, iconY
                switch (direction) {
                    case Direction.right_left:
                        startX -= this.standardWidth
                        width = this.standardWidth
                        height = this.standardHeight
                        ownLeft = startX
                        ownTop = startY
                        iconX = startX + this.standardWidth / 2
                        iconY = startY + this.standardHeight - 35
                        break
                    case Direction.bottom_top:
                        startY -= this.standardWidth
                        height = this.standardWidth
                        width = this.standardHeight
                        ownLeft = startX + this.standardHeight
                        ownTop = startY
                        iconX = startX + 35
                        iconY = startY + this.standardWidth / 2
                        break
                    case Direction.left_right:
                        startX += this.standardWidth
                        width = this.standardWidth
                        height = this.standardHeight
                        ownLeft = startX + this.standardWidth
                        ownTop = startY + this.standardHeight
                        iconX = startX + this.standardWidth / 2
                        iconY = startY + 35
                        break
                    case Direction.top_bottom:
                        startY += this.standardWidth
                        height = this.standardWidth
                        width = this.standardHeight
                        ownLeft = startX
                        ownTop = startY + this.standardWidth
                        iconX = startX + this.standardHeight - 35
                        iconY = startY + this.standardWidth / 2
                        break
                }
                let isProperty = !['chest', 'chance', 'banned', 'free', 'lowtiertax', 'lametax'].includes(nextType)
                let isHeavy = this.heavies.includes(character as Character)
                let isTopTier = this.toptiers.includes(character as Character)
                let friendlyName = this.friendlyNames[character]
                if (friendlyName === undefined) {
                    friendlyName = character.charAt(0).toUpperCase() + character.slice(1)
                }

                let characterObj = {
                    name: character,
                    friendlyName,
                    left: startX,
                    right: startX + width,
                    top: startY,
                    bottom: startY + height,
                    ownLeft: ownLeft,
                    ownTop: ownTop,
                    iconX: iconX,
                    iconY: iconY,
                    direction: direction,
                    index: corner.index + index + 1,
                    property: isProperty,
                    owner: undefined,
                    house: false,
                    hotel: false,
                    heavy: isHeavy,
                    toptier: isTopTier,
                    type: nextType,
                    drawSlot: true,
                    opacity: 0,
                }
                slots.push(characterObj)
                this.strokeRectangle(width, height, startX, startY, 'blue')
            })
        })
        return slots
    }

    public _updateGameArea(slots: Slot[], players: Player[], playerColours: string[], showSeries: boolean) {
        this.clear()
        this.drawSlots(slots, players, showSeries)
        slots.forEach((slot) => {
            slot.justWon = false
        })
        players.forEach((player) => this.updatePlayerPosition(player, slots, playerColours))
    }

    public animateCard(rollingPlayer: RollingPlayer) {
        this.context.clearRect(300, 300, 400, 400)
        this.addBoardLogo()
        this.context.save()
        this.context.translate(500, 500)
        this.cardWidth += 4
        this.cardHeight = (200 / 344) * this.cardWidth
        this.context.rotate(((this.cardWidth + 16) * 3 * Math.PI) / 180)
        this.context.drawImage(
            rollingPlayer.chance !== undefined
                ? this.images['chance' + this.chances[rollingPlayer.chance].fileIndex]
                : // @ts-expect-error animateCard is call if rollingPlayer as chance or chest properties
                  this.images['chest' + this.communityChests[rollingPlayer.chest].fileIndex],
            -this.cardWidth / 2,
            -this.cardHeight / 2,
            this.cardWidth,
            this.cardHeight
        )
        this.context.restore()
        if (this.cardWidth < 344) {
            requestAnimationFrame(() => this.animateCard(rollingPlayer))
        } else {
            this.cardWidth = 0
            this.cardHeight = 0
            $('#continue_game').removeClass('hidden')
        }
    }

    private drawSlots(slots: Slot[], players: Player[], showSeries: boolean) {
        this.context.drawImage(this.images.parking, 0, 0, this.standardHeight, this.standardHeight)
        this.addBoardLogo()
        let seriesSeen: string[] = []
        let parkingCount = 0
        slots.forEach((slot) => {
            let rotateBy
            let offsetX = 0
            let offsetY = 0
            switch (slot.direction) {
                case 'right_left':
                    rotateBy = 0
                    this.context.textAlign = 'left'
                    this.context.textBaseline = 'top'
                    offsetX += slot.hotel ? 50 : 60
                    offsetY += slot.hotel ? 0 : 5
                    break
                case 'bottom_top':
                    rotateBy = Math.PI / 2
                    this.context.textAlign = 'left'
                    this.context.textBaseline = 'bottom'
                    offsetY += slot.hotel ? 0 : 5
                    offsetX += slot.hotel ? 50 : 60
                    break
                case 'left_right':
                    rotateBy = Math.PI
                    this.context.textAlign = 'right'
                    this.context.textBaseline = 'bottom'
                    offsetX += slot.hotel ? 50 : 60
                    offsetY += slot.hotel ? 0 : 5
                    break
                case 'top_bottom':
                    rotateBy = -Math.PI / 2
                    this.context.textAlign = 'right'
                    this.context.textBaseline = 'top'
                    offsetY += slot.hotel ? 0 : 5
                    offsetX += slot.hotel ? 50 : 60
                    break
            }
            // Add icon & text
            if (slot.drawSlot) {
                this.context.save()
                let x
                let y
                let w
                let h
                let addText = false
                if (['chest', 'chance', 'station'].includes(slot.type)) {
                    x = slot.ownLeft
                    y = slot.ownTop
                    w = this.standardWidth
                    h = this.standardHeight
                    addText = true
                } else if (['go', 'visiting', 'freecharacter', 'tobanned'].includes(slot.type)) {
                    x = slot.left
                    y = slot.top
                    w = this.standardHeight
                    h = this.standardHeight
                } else {
                    x = slot.iconX
                    y = slot.iconY
                    w = 70
                    h = 70
                    addText = true
                }
                // @ts-expect-error x and y are defined by the if-elseif-else condition above TODO: fix that with is operator
                this.context.translate(x, y)
                // @ts-expect-error rotateBy defined is by the if-elseif-else condition above TODO: fix that with is operator
                this.context.rotate(rotateBy)
                if (addText) {
                    if (['chest', 'chance', 'station'].includes(slot.type)) {
                        this.context.drawImage(this.images[slot.name], 0, 0, w, h)
                        this.context.restore()
                        this.context.save()
                        // @ts-expect-error item.iconX and item.iconY are defined by the if-elseif-else condition above TODO: fix that with is operator
                        this.context.translate(slot.iconX, slot.iconY)
                        // @ts-expect-error rotateBy defined is by the if-elseif-else condition above TODO: fix that with is operator
                        this.context.rotate(rotateBy)
                    } else {
                        if (['lowtiertax', 'lametax', 'utility'].includes(slot.type)) {
                            this.context.drawImage(this.images[slot.name], -40, -45, 80, 80)
                        } else {
                            // Normal slot
                            this.context.drawImage(this.images[slot.name], -35, -35, w, h)
                            if (showSeries) {
                                // @ts-expect-error slot.name isn't a Character but includes doesn't care about that
                                let series = this.seriesNames.find((series) => series.characters.includes(slot.name))
                                if (series && this.images[series.name] && !seriesSeen.includes(series.name)) {
                                    seriesSeen.push(series.name)
                                    this.context.drawImage(this.images[series.name], -160, -180, 206, 110)
                                }
                            }
                        }
                    }

                    this.context.textAlign = 'center'
                    this.context.textBaseline = 'middle'
                    this.context.fillStyle = 'black'
                    this.context.font = '13px "Futura PT Medium"'
                    switch (slot.type) {
                        case 'utility':
                            this.context.fillText(slot.friendlyName.toUpperCase(), 0, -75)
                            break
                        case 'lowtiertax':
                        case 'lametax':
                            this.context.font = '18px "Futura PT Medium"'
                            this.context.fillText(slot.type === 'lowtiertax' ? 'LOW TIER' : 'LAME', 0, -75)
                            this.context.fillText('TAX', 0, -55)
                            break
                        case 'chest':
                            this.context.fillText('COMMUNITY', 0, -70)
                            this.context.fillText('CHEST', 0, -55)
                            break
                        case 'chance':
                            this.context.fillText('CHANCE', 0, -70)
                            break
                        case 'station':
                            this.context.fillText(slot.name.split('_')[0].toUpperCase(), 0, -75)
                            this.context.fillText('STATION', 0, -60)
                            break
                        default:
                            let characterText: string | string[] = slot.friendlyName.toUpperCase()
                            if (characterText.length >= 10) {
                                characterText = characterText.split(' ')
                            } else {
                                characterText = [characterText]
                            }

                            if (characterText[1] === '&') {
                                // put & on shorter line
                                if (characterText[0].length < characterText[2].length) {
                                    characterText[0] = characterText[0] + ' &'
                                } else {
                                    characterText[2] = '& ' + characterText[2]
                                }
                                characterText.splice(1, 1)
                            }
                            if (characterText[1] === 'K.') {
                                characterText[0] = 'KING K.'
                                characterText.splice(1, 1)
                            }
                            if (characterText[1] === 'SUIT') {
                                characterText[0] = 'ZERO SUIT'
                                characterText.splice(1, 1)
                            }
                            for (let i = 0; i < characterText.length; i++) {
                                this.context.fillText(characterText[i], 0, -50 + i * 10)
                            }
                    }
                } else {
                    // Only actually the banned space
                    this.context.drawImage(this.images[slot.name], 0, 0, w, h)
                }

                this.context.restore()
            }

            // Place player icon
            if (slot.owner || slot.owner === 0) {
                if (slot.owner === 'parking') {
                    this.context.fillStyle = 'rgba(0,0,0,0.2)'
                    this.context.fillRect(slot.left, slot.top, slot.right - slot.left, slot.bottom - slot.top)
                    this.context.save()
                    // @ts-expect-error item.ownLeft and item.ownTop is defined by the if-elseif-else condition above TODO: fix that with is operator
                    this.context.translate(slot.ownLeft, slot.ownTop)
                    // @ts-expect-error rotateBy is defined by the if-elseif-else condition above TODO: fix that with is operator
                    this.context.rotate(rotateBy)
                    this.context.drawImage(this.images['parking_token'], this.standardWidth / 2 - 20, -5, 40, 40)
                    this.context.restore()
                    if (slot.type === 'station') {
                        this.context.drawImage(
                            this.images[slot.name],
                            0,
                            110,
                            197,
                            197,
                            this.parkingCoords[parkingCount][0],
                            this.parkingCoords[parkingCount][1],
                            20,
                            20
                        )
                    } else {
                        this.context.drawImage(
                            this.images[slot.name],
                            this.parkingCoords[parkingCount][0],
                            this.parkingCoords[parkingCount][1],
                            20,
                            20
                        )
                    }
                    parkingCount++
                    if (parkingCount === this.parkingCoords.length) {
                        parkingCount = 0
                    }
                } else {
                    // Translucent rectangle over whole spot
                    if (slot.owner === this.losingCharacterIndex && !slot.locked) {
                        if (slot.opacity === undefined) {
                            slot.opacity = 0
                        }
                        this.context.fillStyle = this.playerColours[slot.owner].replace(')', ',' + slot.opacity + ')')
                        slot.opacity += 0.005
                        if (slot.opacity > 0.4) {
                            slot.opacity = 0
                        }
                    } else if (
                        slot.owner === this.upgradeCharacterIndex &&
                        !slot.hotel &&
                        !['station', 'utility'].includes(slot.name)
                    ) {
                        if (slot.opacity === undefined) {
                            slot.opacity = 0
                        }
                        this.context.fillStyle = this.playerColours[slot.owner].replace(')', ',' + slot.opacity + ')')
                        slot.opacity += 0.005
                        if (slot.opacity > 0.4) {
                            slot.opacity = 0
                        }
                    } else {
                        if (typeof slot.owner === 'number') {
                            this.context.fillStyle = this.playerColours[slot.owner].replace(')', ',0.2)')
                        }
                    }

                    this.context.fillRect(slot.left, slot.top, slot.right - slot.left, slot.bottom - slot.top)
                    this.context.save()
                    // @ts-expect-error item.ownLeft and item.ownTop are defined by the if-elseif-else condition above TODO: fix that with is operator
                    this.context.translate(slot.ownLeft, slot.ownTop)
                    // @ts-expect-error rotateBy is defined by the if-elseif-else condition above TODO: fix that with is operator
                    this.context.rotate(rotateBy)
                    if (typeof slot.owner === 'number') {
                        this.context.drawImage(this.images[players[slot.owner].icon], 5, 5, 20, 20)
                    }
                    if (slot.hotel) {
                        this.context.drawImage(this.images.hotel, offsetX, offsetY, 30, 30)
                    } else if (slot.house) {
                        this.context.drawImage(this.images.house, offsetX, offsetY, 20, 20)
                    }
                    this.context.restore()
                }
            }
            players.forEach(({ x = 0, y = 0, playerIndex }) => {
                if (
                    slot.left * this.scale < x * this.scale &&
                    slot.right * this.scale > x * this.scale &&
                    slot.top * this.scale < y * this.scale &&
                    slot.bottom * this.scale > y * this.scale
                ) {
                    this.context.save()
                    this.context.lineWidth = 5
                    this.context.strokeStyle = this.playerColours[playerIndex]
                    this.context.strokeRect(slot.left, slot.top, slot.right - slot.left, slot.bottom - slot.top)
                    this.context.restore()
                }
            })
        })
    }

    private addBoardLogo() {
        // Add middle image
        this.context.save()
        this.context.translate(500, 500)
        this.context.rotate((-48 * Math.PI) / 180)
        this.context.drawImage(this.images.boardMiddle, -240, -135, 480, 270)
        this.context.restore()
    }

    private updatePlayerPosition(player: Player, slots: Slot[], playerColours: string[]) {
        if (player.index !== player.targetIndex) {
            player.progress++
            if (player.progress === 10) {
                player.progress = 0
                if (player.backwards) {
                    player.index--
                    if (player.index === -1) {
                        player.index = 0
                    }
                } else {
                    player.index++
                    if (player.index === 40) {
                        player.index = 0
                    }
                }
                if (player.index === player.targetIndex) {
                    if (player.banned) {
                        player.index = 40
                        player.targetIndex = 40
                    }
                    player.backwards = false
                    this.currentlyAnimating = false
                }
            }
        }

        let occupiedSlot = slots[player.index],
            nextIndex = player.index + 1 === 40 ? 0 : player.index + 1

        if (player.backwards) {
            nextIndex = player.index - 1 === -1 ? 40 : player.index - 1
        }
        let nextSlot = slots[nextIndex]

        player.x = (occupiedSlot.left + occupiedSlot.right) / 2
        player.y = (occupiedSlot.top + occupiedSlot.bottom) / 2
        if (player.index !== player.targetIndex) {
            player.nextX = (nextSlot.left + nextSlot.right) / 2
            player.nextY = (nextSlot.top + nextSlot.bottom) / 2
            player.diffX = player.nextX - player.x
            player.diffY = player.nextY - player.y
            player.diffX = (player.diffX / 10) * player.progress
            player.diffY = (player.diffY / 10) * player.progress
            player.x = player.x + player.diffX
            player.y = player.y + player.diffY
        }
        switch (player.playerIndex) {
            case 0:
                player.x -= 13
                player.y -= 13
                if (player.index === 10) {
                    player.x -= 30
                }
                break
            case 1:
                player.x += 13
                player.y -= 13
                if (player.index === 10) {
                    player.x -= 56
                    player.y += 26
                }
                break
            case 2:
                player.x -= 13
                player.y += 13
                if (player.index === 10) {
                    player.y += 30
                }
                break
            case 3:
                player.x += 13
                player.y += 13
                if (player.index === 10) {
                    player.y += 30
                }
                break
        }
        player.x -= 25
        player.y -= 25
        this.context.save()
        this.context.fillStyle = playerColours[player.playerIndex].replace(')', ', .8)')
        this.context.strokeStyle = playerColours[player.playerIndex]
        this.context.beginPath()
        this.context.arc(player.x + 30, player.y + 30, 30, 0, 2 * Math.PI)
        this.context.stroke()
        this.context.fill()
        this.context.drawImage(this.images[player.icon], player.x, player.y, 60, 60)
        this.context.restore()
    }

    private resize() {
        const gameDiv = document.querySelector('#game_div')
        if (gameDiv) {
            let gameDivRect: DOMRect
            window.addEventListener('resize', () => {
                this.calculateScale(gameDivRect)
                gameDiv.setAttribute('style', `transform: scale(${this.scale})`)
            })
            const resizeObserver = new ResizeObserver((entries) => {
                if (entries.length) {
                    gameDivRect = entries[0].contentRect
                    this.calculateScale(gameDivRect)
                    gameDiv.setAttribute('style', `transform: scale(${this.scale})`)
                }
            })
            resizeObserver.observe(gameDiv)
        } else {
            throw new CustomError('div#game_div is undefined')
        }
    }

    private calculateScale(gameDivRect: DOMRect) {
        const height = window.innerHeight
        const width = window.innerWidth
        const smallestWidth = Math.min(gameDivRect.width, width)
        const smallestHeight = Math.min(gameDivRect.height, height)

        const widthRatio = smallestWidth / gameDivRect.width
        const heightRatio = smallestHeight / gameDivRect.height

        this.scale = Math.min(widthRatio, heightRatio)
    }
}
