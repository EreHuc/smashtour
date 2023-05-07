import { CustomError } from '../utils'
import { Direction } from '../type'
import { GameSettings } from './GameSettings.ts'
import { Slot } from './Game.ts'
import { Token } from './Token.ts'
import { RollingPlayer } from '../type/RollingPlayer.ts'

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
            // First draw that corner
            let height = corner.bottom - corner.top,
                width = corner.right - corner.left
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
                case 'free':
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

            if (corner.type === 'visiting') {
                // @ts-expect-error item.pool is defined on corner type «visiting»
                corner.name = corner.pool[Math.floor(Math.random() * 3)]
                corner.friendlyName =
                    corner.name in this.friendlyNames
                        ? // @ts-expect-error corner.name is keyof friendlyNames
                          this.friendlyNames[corner.name]
                        : corner.name.charAt(0).toUpperCase() + corner.name.slice(1)
            } else if (corner.type === 'banned') {
                corner.name = slots[10].name
                corner.friendlyName = slots[10].friendlyName
            }

            slots.push(corner)

            corner.next?.forEach((nextType, index) => {
                let character: string
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
                let isHeavy = this.heavies.includes(character)
                let isTopTier = this.toptiers.includes(character)

                let characterObj = {
                    name: character,
                    friendlyName:
                        character in this.friendlyNames
                            ? // @ts-expect-error character is keyof friendlyNames
                              this.friendlyNames[character]
                            : character.charAt(0).toUpperCase() + character.slice(1),
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

    public _updateGameArea(slots: Slot[], players: Token[], playerColours: string[], showSeries: boolean) {
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

    private drawSlots(slots: Slot[], players: Token[], showSeries: boolean) {
        this.context.drawImage(this.images.parking, 0, 0, this.standardHeight, this.standardHeight)
        this.addBoardLogo()
        let seriesSeen: string[] = []
        let parkingCount = 0
        slots.forEach((item) => {
            let rotateBy
            let offsetX = 0
            let offsetY = 0
            switch (item.direction) {
                case 'right_left':
                    rotateBy = 0
                    this.context.textAlign = 'left'
                    this.context.textBaseline = 'top'
                    offsetX += item.hotel ? 50 : 60
                    offsetY += item.hotel ? 0 : 5
                    break
                case 'bottom_top':
                    rotateBy = Math.PI / 2
                    this.context.textAlign = 'left'
                    this.context.textBaseline = 'bottom'
                    offsetY += item.hotel ? 0 : 5
                    offsetX += item.hotel ? 50 : 60
                    break
                case 'left_right':
                    rotateBy = Math.PI
                    this.context.textAlign = 'right'
                    this.context.textBaseline = 'bottom'
                    offsetX += item.hotel ? 50 : 60
                    offsetY += item.hotel ? 0 : 5
                    break
                case 'top_bottom':
                    rotateBy = -Math.PI / 2
                    this.context.textAlign = 'right'
                    this.context.textBaseline = 'top'
                    offsetY += item.hotel ? 0 : 5
                    offsetX += item.hotel ? 50 : 60
                    break
            }
            // Add icon & text
            if (item.drawSlot) {
                this.context.save()
                let x
                let y
                let w
                let h
                let addText = false
                if (['chest', 'chance', 'station'].includes(item.type)) {
                    x = item.ownLeft
                    y = item.ownTop
                    w = this.standardWidth
                    h = this.standardHeight
                    addText = true
                } else if (['go', 'visiting', 'freecharacter', 'tobanned'].includes(item.type)) {
                    x = item.left
                    y = item.top
                    w = this.standardHeight
                    h = this.standardHeight
                } else {
                    x = item.iconX
                    y = item.iconY
                    w = 70
                    h = 70
                    addText = true
                }
                // @ts-expect-error x and y are defined by the if-elseif-else condition above TODO: fix that with is operator
                this.context.translate(x, y)
                // @ts-expect-error rotateBy defined is by the if-elseif-else condition above TODO: fix that with is operator
                this.context.rotate(rotateBy)
                if (addText) {
                    if (['chest', 'chance', 'station'].includes(item.type)) {
                        this.context.drawImage(this.images[item.name], 0, 0, w, h)
                        this.context.restore()
                        this.context.save()
                        // @ts-expect-error item.iconX and item.iconY are defined by the if-elseif-else condition above TODO: fix that with is operator
                        this.context.translate(item.iconX, item.iconY)
                        // @ts-expect-error rotateBy defined is by the if-elseif-else condition above TODO: fix that with is operator
                        this.context.rotate(rotateBy)
                    } else {
                        if (['lowtiertax', 'lametax', 'utility'].includes(item.type)) {
                            this.context.drawImage(this.images[item.name], -40, -45, 80, 80)
                        } else {
                            // Normal slot
                            this.context.drawImage(this.images[item.name], -35, -35, w, h)
                            if (showSeries) {
                                let series = this.seriesNames.find(function (series) {
                                    return series.characters.includes(item.name)
                                })
                                if (series && this.images.series[series.name] && !seriesSeen.includes(series.name)) {
                                    seriesSeen.push(series.name)
                                    this.context.drawImage(this.images.series[series.name], -160, -180, 206, 110)
                                }
                            }
                        }
                    }

                    this.context.textAlign = 'center'
                    this.context.textBaseline = 'middle'
                    this.context.fillStyle = 'black'
                    this.context.font = '13px "Futura PT Medium"'
                    switch (item.type) {
                        case 'utility':
                            this.context.fillText(item.friendlyName.toUpperCase(), 0, -75)
                            break
                        case 'lowtiertax':
                        case 'lametax':
                            this.context.font = '18px "Futura PT Medium"'
                            this.context.fillText(item.type === 'lowtiertax' ? 'LOW TIER' : 'LAME', 0, -75)
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
                            this.context.fillText(item.name.toUpperCase(), 0, -75)
                            this.context.fillText('STATION', 0, -60)
                            break
                        default:
                            let characterText: string | string[] = item.friendlyName.toUpperCase()
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
                    this.context.drawImage(this.images[item.name], 0, 0, w, h)
                }

                this.context.restore()
            }

            // Place player icon
            if (item.owner || item.owner === 0) {
                if (item.owner === 'parking') {
                    this.context.fillStyle = 'rgba(0,0,0,0.2)'
                    this.context.fillRect(item.left, item.top, item.right - item.left, item.bottom - item.top)
                    this.context.save()
                    // @ts-expect-error item.ownLeft and item.ownTop is defined by the if-elseif-else condition above TODO: fix that with is operator
                    this.context.translate(item.ownLeft, item.ownTop)
                    // @ts-expect-error rotateBy is defined by the if-elseif-else condition above TODO: fix that with is operator
                    this.context.rotate(rotateBy)
                    this.context.drawImage(this.images['parking_token'], this.standardWidth / 2 - 20, -5, 40, 40)
                    this.context.restore()
                    if (item.type === 'station') {
                        this.context.drawImage(
                            this.images[item.name],
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
                            this.images[item.name],
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
                    if (item.owner === this.losingCharacterIndex && !item.locked) {
                        if (item.opacity === undefined) {
                            item.opacity = 0
                        }
                        this.context.fillStyle = this.playerColours[item.owner].replace(')', ',' + item.opacity + ')')
                        item.opacity += 0.005
                        if (item.opacity > 0.4) {
                            item.opacity = 0
                        }
                    } else if (
                        item.owner === this.upgradeCharacterIndex &&
                        !item.hotel &&
                        !['station', 'utility'].includes(item.type)
                    ) {
                        if (item.opacity === undefined) {
                            item.opacity = 0
                        }
                        this.context.fillStyle = this.playerColours[item.owner].replace(')', ',' + item.opacity + ')')
                        item.opacity += 0.005
                        if (item.opacity > 0.4) {
                            item.opacity = 0
                        }
                    } else {
                        if (typeof item.owner === 'number') {
                            this.context.fillStyle = this.playerColours[item.owner].replace(')', ',0.2)')
                        }
                    }

                    this.context.fillRect(item.left, item.top, item.right - item.left, item.bottom - item.top)
                    this.context.save()
                    // @ts-expect-error item.ownLeft and item.ownTop are defined by the if-elseif-else condition above TODO: fix that with is operator
                    this.context.translate(item.ownLeft, item.ownTop)
                    // @ts-expect-error rotateBy is defined by the if-elseif-else condition above TODO: fix that with is operator
                    this.context.rotate(rotateBy)
                    if (typeof item.owner === 'number') {
                        this.context.drawImage(this.images[players[item.owner].icon], 5, 5, 20, 20)
                    }
                    if (item.hotel) {
                        this.context.drawImage(this.images.hotel, offsetX, offsetY, 30, 30)
                    } else if (item.house) {
                        this.context.drawImage(this.images.house, offsetX, offsetY, 20, 20)
                    }
                    this.context.restore()
                }
            }
            players.forEach(({ x = 0, y = 0, playerIndex }) => {
                if (
                    item.left * this.scale < x * this.scale &&
                    item.right * this.scale > x * this.scale &&
                    item.top * this.scale < y * this.scale &&
                    item.bottom * this.scale > y * this.scale
                ) {
                    this.context.save()
                    this.context.lineWidth = 5
                    this.context.strokeStyle = this.playerColours[playerIndex]
                    this.context.strokeRect(item.left, item.top, item.right - item.left, item.bottom - item.top)
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

    private updatePlayerPosition(player: Token, slots: Slot[], playerColours: string[]) {
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
