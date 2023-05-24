import { Draw } from './Draw.ts'
import { DrawSettings } from './DrawSettings.ts'
import { GameSettings } from '../GameSettings.ts'
import { GameError, ownContext } from '../../utils'
import { Slot } from '../Slot.ts'
import { Player } from '../Player.ts'
import { SquareType } from '../../type'
import { Character } from '../Character.ts'
import color from 'color'

export class UiCanvas extends DrawSettings implements Draw {
    private readonly canvas: OffscreenCanvas
    private readonly context: OffscreenCanvasRenderingContext2D
    readonly playerCardWidth = 100
    readonly playerCardHeight = 50
    private battleInfos: Array<{ player: Player; index: number; message: string }> = []
    private diceResults: Array<{ index: number; dice: IndividualDieResult[] }> = []
    private extraInfos: Array<{ index: number; message: string }> = []
    private generalInfos: string[] = []

    constructor(settings: GameSettings) {
        super(settings)
        this.canvas = new OffscreenCanvas(this.canvasWidth, this.canvasHeight)
        const context = this.canvas.getContext('2d')
        if (!context) {
            throw new GameError('no context for ui canvas')
        }
        this.context = context
    }

    public draw(slots: Slot[], players: Player[], matrix: DOMMatrix) {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.drawOwnedCharacters(slots, players)
        players.forEach((player, index) => {
            this.drawCardCharacters(player, index)
            this.drawPlayerName(player, index)
        })
        this.drawPlayerZone(matrix)
        this.battleInfos.forEach((infos) => {
            this.drawBattleInfo(infos.player, infos.index, infos.message)
        })
        this.diceResults.forEach((results) => {
            this.drawDiceResult(results.index, results.dice)
        })
        this.extraInfos.forEach((infos) => {
            this.drawExtraInfo(infos.index, infos.message)
        })
        this.generalInfos.forEach((message, index) => {
            this.drawGeneralInfo(message, index)
        })
        return {
            canvas: this.canvas,
        }
    }

    public isInFreeJailCard(playerIndex: number, x: number, y: number) {
        const rect = new Path2D()
        switch (playerIndex) {
            case 0:
                rect.moveTo(this.canvasWidth / 2 - 10, 10)
                rect.lineTo(this.canvasWidth / 2 - 10, this.playerCardHeight + 10)
                rect.lineTo(this.canvasWidth / 2 - 10 - this.playerCardWidth, this.playerCardHeight + 10)
                rect.lineTo(this.canvasWidth / 2 - 10 - this.playerCardWidth, 10)
                rect.closePath()
                break
            case 1:
                rect.moveTo(this.canvasWidth / 2 + 10, 10)
                rect.lineTo(this.canvasWidth / 2 + 10, 10 + this.playerCardHeight)
                rect.lineTo(this.canvasWidth / 2 + 10 + this.playerCardWidth, 10 + this.playerCardHeight)
                rect.lineTo(this.canvasWidth / 2 + 10 + this.playerCardWidth, 10)
                break
            case 2:
                rect.moveTo(this.canvasWidth / 2 - 10, this.canvasHeight - 10)
                rect.lineTo(this.canvasWidth / 2 - 10, this.canvasHeight - 10 - this.playerCardHeight)
                rect.lineTo(
                    this.canvasWidth / 2 - 10 - this.playerCardWidth,
                    this.canvasHeight - 10 - this.playerCardHeight
                )
                rect.lineTo(this.canvasWidth / 2 - 10 - this.playerCardWidth, this.canvasHeight - 10)
                break
            default:
                rect.moveTo(this.canvasWidth / 2 + 10, this.canvasHeight - 10)
                rect.lineTo(this.canvasWidth / 2 + 10, this.canvasHeight - 10 - this.playerCardHeight)
                rect.lineTo(
                    this.canvasWidth / 2 + 10 + this.playerCardWidth,
                    this.canvasHeight - 10 - this.playerCardHeight
                )
                rect.lineTo(this.canvasWidth / 2 + 10 + this.playerCardWidth, this.canvasHeight - 10)
        }
        return this.context.isPointInPath(rect, x, y)
    }

    public isInChooseCharCard(playerIndex: number, x: number, y: number) {
        const rect = new Path2D()
        switch (playerIndex) {
            case 0:
                rect.moveTo(this.canvasWidth / 2 - 10, this.playerCardHeight + 20)
                rect.lineTo(this.canvasWidth / 2 - 10, this.playerCardHeight + 20 + this.playerCardHeight)
                rect.lineTo(
                    this.canvasWidth / 2 - 10 - this.playerCardWidth,
                    this.playerCardHeight + 20 + this.playerCardHeight
                )
                rect.lineTo(this.canvasWidth / 2 - 10 - this.playerCardWidth, this.playerCardHeight + 20)
                rect.closePath()
                break
            case 1:
                rect.moveTo(this.canvasWidth / 2 + 10, 20 + this.playerCardHeight)
                rect.lineTo(this.canvasWidth / 2 + 10, 20 + this.playerCardHeight + this.playerCardHeight)
                rect.lineTo(
                    this.canvasWidth / 2 + 10 + this.playerCardWidth,
                    20 + this.playerCardHeight + this.playerCardHeight
                )
                rect.lineTo(this.canvasWidth / 2 + 10 + this.playerCardWidth, 20 + this.playerCardHeight)
                break

            case 2:
                rect.moveTo(this.canvasWidth / 2 - 10, this.canvasHeight - 20 - this.playerCardHeight)
                rect.lineTo(
                    this.canvasWidth / 2 - 10,
                    this.canvasHeight - 20 - this.playerCardHeight - this.playerCardHeight
                )
                rect.lineTo(
                    this.canvasWidth / 2 - 10 - this.playerCardWidth,
                    this.canvasHeight - 20 - this.playerCardHeight - this.playerCardHeight
                )
                rect.lineTo(
                    this.canvasWidth / 2 - 10 - this.playerCardWidth,
                    this.canvasHeight - 20 - this.playerCardHeight
                )
                break
            default:
                rect.moveTo(this.canvasWidth / 2 + 10, this.canvasHeight - 20 - this.playerCardHeight)
                rect.lineTo(
                    this.canvasWidth / 2 + 10,
                    this.canvasHeight - 20 - this.playerCardHeight - this.playerCardHeight
                )
                rect.lineTo(
                    this.canvasWidth / 2 + 10 + this.playerCardWidth,
                    this.canvasHeight - 20 - this.playerCardHeight - this.playerCardHeight
                )
                rect.lineTo(
                    this.canvasWidth / 2 + 10 + this.playerCardWidth,
                    this.canvasHeight - 20 - this.playerCardHeight
                )
        }
        return this.context.isPointInPath(rect, x, y)
    }

    public addBattleInfos(player: Player, index: number, message: string) {
        this.battleInfos.push({ player, index, message })
    }

    public resetBattleInfos() {
        this.battleInfos = []
    }

    public addDiceResult(index: number, dice: IndividualDieResult[]) {
        this.diceResults.push({ index, dice })
    }

    public resetDiceResult() {
        this.diceResults = []
    }

    public addExtraInfos(index: number, message: string) {
        this.extraInfos.push({ index, message })
    }

    public resetExtraInfos() {
        this.extraInfos = []
    }

    public addGeneralInfos(message: string) {
        this.generalInfos.push(message)
    }

    public resetGeneralInfos() {
        this.generalInfos = []
    }

    private drawOwnedCharacters(slots: Slot[], players: Player[]) {
        const size = 40
        const height = 20
        Object.entries(
            slots.reduce((acc, slot) => {
                if (slot.owner && slot.owner !== 'tax') {
                    const playerIndex = players.findIndex((p) => p.id === slot.owner)
                    if (!acc[playerIndex]) {
                        acc[playerIndex] = []
                    }
                    acc[playerIndex].push({
                        type: slot.type,
                        propertyColor: slot.propertyColor,
                        character: slot.character,
                    })
                }
                return acc
            }, {} as Record<string, Array<{ type: SquareType; propertyColor?: string; character?: Character }>>)
        ).forEach(([playerIndex, properties]) => {
            properties
                .sort((a, b) => a.type.localeCompare(b.type))
                .forEach(({ propertyColor, character }, index) => {
                    ownContext(this.context, (ctx) => {
                        switch (playerIndex) {
                            case '0':
                                ctx.translate(size + 10, 10 + index * (height + 10))
                                ctx.textAlign = 'left'
                                break
                            case '1':
                                ctx.translate(this.canvasWidth - size - (size + 10), 10 + index * (height + 10))
                                ctx.textAlign = 'right'
                                break
                            case '2':
                                ctx.translate(size + 10, this.canvasHeight - (height + 10) - index * (height + 10))
                                ctx.textAlign = 'left'
                                break
                            default:
                                ctx.translate(
                                    this.canvasWidth - size - (size + 10),
                                    this.canvasHeight - (height + 10) - index * (height + 10)
                                )
                                ctx.textAlign = 'right'
                                break
                        }
                        if (character) {
                            ctx.fillStyle = propertyColor ?? 'black'
                            ctx.drawImage(character.image, 0, -height / 2, size, size)
                            ctx.font = `${height / 2}px Futura`
                            ctx.textBaseline = 'middle'
                            ctx.lineWidth = 3
                            const { width } = ctx.measureText(character.friendlyName.join(' '))
                            switch (playerIndex) {
                                case '0':
                                    ctx.beginPath()
                                    ctx.rect(size + 10, 0, width + 16, height)
                                    ctx.stroke()
                                    ctx.fill()
                                    ctx.closePath()
                                    ctx.fillStyle = color(propertyColor ?? 'black').isDark() ? 'white' : 'black'
                                    ctx.fillText(character.friendlyName.join(' '), size + 10 + 8, height / 2)
                                    break
                                case '1':
                                    ctx.beginPath()
                                    ctx.rect(-10, 0, -(width + 16), height)
                                    ctx.stroke()
                                    ctx.fill()
                                    ctx.closePath()
                                    ctx.fillStyle = color(propertyColor ?? 'black').isDark() ? 'white' : 'black'
                                    ctx.fillText(character.friendlyName.join(' '), -10 - 8, height / 2)
                                    break
                                case '2':
                                    ctx.beginPath()
                                    ctx.rect(size + 10, 0, width + 16, height)
                                    ctx.stroke()
                                    ctx.fill()
                                    ctx.closePath()
                                    ctx.fillStyle = color(propertyColor ?? 'black').isDark() ? 'white' : 'black'
                                    ctx.fillText(character.friendlyName.join(' '), size + 10 + 8, height / 2)
                                    break
                                default:
                                    ctx.beginPath()
                                    ctx.rect(0, 0, -(width + 16), height)
                                    ctx.stroke()
                                    ctx.fill()
                                    ctx.closePath()
                                    ctx.fillStyle = color(propertyColor ?? 'black').isDark() ? 'white' : 'black'
                                    ctx.fillText(character.friendlyName.join(' '), -8, height / 2)
                                    break
                            }
                        }
                    })
                })
        })
    }

    private drawCardCharacters(player: Player, index: number) {
        ownContext(this.context, (ctx) => {
            ctx.fillStyle = 'white'
            ctx.lineWidth = 3
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.font = '15px Futura'
            switch (index) {
                case 0:
                    ctx.translate(this.canvasWidth / 2 - 10 - this.playerCardWidth, 10)
                    if (player.freeJailCard) {
                        ctx.beginPath()
                        ctx.rect(0, 0, this.playerCardWidth, this.playerCardHeight)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                    }
                    if (player.chooseCharCard) {
                        ctx.beginPath()
                        ctx.rect(0, 10 + this.playerCardHeight, this.playerCardWidth, this.playerCardHeight)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                        ctx.beginPath()
                        ctx.fillStyle = 'black'
                        ctx.fillText(
                            'Chose Char',
                            this.playerCardWidth / 2,
                            this.playerCardHeight / 2 + 10 + this.playerCardHeight
                        )
                        ctx.closePath()
                    }
                    break
                case 1:
                    ctx.translate(this.canvasWidth / 2 + 10, 10)
                    if (player.freeJailCard) {
                        ctx.beginPath()
                        ctx.rect(0, 0, this.playerCardWidth, this.playerCardHeight)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                    }
                    if (player.chooseCharCard) {
                        ctx.beginPath()
                        ctx.rect(0, 10 + this.playerCardHeight, this.playerCardWidth, this.playerCardHeight)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                        ctx.beginPath()
                        ctx.fillStyle = 'black'
                        ctx.fillText(
                            'Chose Char',
                            this.playerCardWidth / 2,
                            this.playerCardHeight / 2 + 10 + this.playerCardHeight
                        )
                        ctx.closePath()
                    }
                    break
                case 2:
                    ctx.translate(
                        this.canvasWidth / 2 - 10 - this.playerCardWidth,
                        this.canvasHeight - 10 - this.playerCardHeight
                    )
                    if (player.freeJailCard) {
                        ctx.beginPath()
                        ctx.rect(0, 0, this.playerCardWidth, this.playerCardHeight)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                    }
                    if (player.chooseCharCard) {
                        ctx.beginPath()
                        ctx.rect(0, -10 - this.playerCardHeight, this.playerCardWidth, this.playerCardHeight)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                        ctx.beginPath()
                        ctx.fillStyle = 'black'
                        ctx.fillText(
                            'Chose Char',
                            this.playerCardWidth / 2,
                            this.playerCardHeight / 2 - 10 - this.playerCardHeight
                        )
                        ctx.closePath()
                    }
                    break
                default:
                    ctx.translate(this.canvasWidth / 2 + 10, this.canvasHeight - 10 - this.playerCardHeight)
                    if (player.freeJailCard) {
                        ctx.beginPath()
                        ctx.rect(0, 0, this.playerCardWidth, this.playerCardHeight)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                    }
                    if (player.chooseCharCard) {
                        ctx.beginPath()
                        ctx.rect(0, -10 - this.playerCardHeight, this.playerCardWidth, this.playerCardHeight)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                        ctx.beginPath()
                        ctx.fillStyle = 'black'
                        ctx.fillText(
                            'Chose Char',
                            this.playerCardWidth / 2,
                            this.playerCardHeight / 2 - 10 - this.playerCardHeight
                        )
                        ctx.closePath()
                    }
            }

            if (player.freeJailCard) {
                ctx.beginPath()
                ctx.fillStyle = 'black'
                ctx.fillText('Free Jail', this.playerCardWidth / 2, this.playerCardHeight / 2)
                ctx.closePath()
            }
        })
    }

    private drawPlayerName(player: Player, index: number) {
        ownContext(this.context, (ctx) => {
            // ctx.textBaseline = 'middle'
            ctx.font = '30px Futura'
            const name = `${index + 1}. ${player.name}`
            const { width } = ctx.measureText(name)
            ctx.fillStyle = player.color
            ctx.lineWidth = 3
            switch (index) {
                case 0:
                    ctx.translate(10, 10)
                    ctx.rotate(2.5 * Math.PI)
                    ctx.beginPath()
                    ctx.rect(0, -30, width + 10, 30)
                    ctx.stroke()
                    ctx.fill()
                    ctx.closePath()
                    ctx.drawImage(player.image, width + 10, -35, 50, 50)
                    break
                case 1:
                    ctx.translate(this.canvasWidth - 10 - 30, 10)
                    ctx.rotate(2.5 * Math.PI)
                    ctx.beginPath()
                    ctx.rect(0, -30, width + 10, 30)
                    ctx.stroke()
                    ctx.fill()
                    ctx.closePath()
                    ctx.drawImage(player.image, width + 10, -30, 50, 50)
                    break
                case 2:
                    ctx.translate(10 + 30, this.canvasHeight - 10)
                    ctx.rotate(1.5 * Math.PI)
                    ctx.beginPath()
                    ctx.rect(0, 0, width + 10, -30)
                    ctx.stroke()
                    ctx.fill()
                    ctx.closePath()
                    ctx.drawImage(player.image, width + 10, 10, 50, -50)
                    break
                default:
                    ctx.translate(this.canvasWidth - 10, this.canvasHeight - 10)
                    ctx.rotate(1.5 * Math.PI)
                    ctx.beginPath()
                    ctx.rect(0, 0, width + 10, -30)
                    ctx.stroke()
                    ctx.fill()
                    ctx.closePath()
                    ctx.drawImage(player.image, width + 10, 10, 50, -50)
            }
            ctx.fillStyle = color(player.color).isDark() ? 'white' : 'black'
            ctx.fillText(name, 5, -4)
        })
    }

    private drawBattleInfo(player: Player, index: number, message: string) {
        ownContext(this.context, (ctx) => {
            ctx.font = '15px Futura'
            const { width } = ctx.measureText(message)
            const iconSize = 30
            const height = 20
            ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2 + this.elevation / 2)
            switch (index) {
                case 0:
                    ctx.translate(-width - 20 - iconSize, -10)
                    break
                case 1:
                    ctx.translate(10, -10)
                    break
                case 2:
                    ctx.translate(-width - 20 - iconSize, height)
                    break
                default:
                    ctx.translate(10, height)
            }
            ctx.fillStyle = player.color
            ctx.shadowBlur = 1
            ctx.shadowColor = '#2b2b2b'
            ctx.fillText(message, 0, 0)

            ctx.drawImage(player.image, width + 10, -height, iconSize, iconSize)
        })

        return { canvas: this.canvas }
    }

    private drawDiceResult(index: number, [dice1, dice2]: IndividualDieResult[]) {
        const width = 20
        const delta = 100
        ownContext(this.context, (ctx) => {
            ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2 + this.elevation / 2)
            switch (index) {
                case 0:
                    ctx.translate(-delta / 2 - width - 10, -delta)
                    break
                case 1:
                    ctx.translate(delta / 2, -delta)
                    break
                case 2:
                    ctx.translate(-delta / 2 - width - 10, delta)
                    break
                default:
                    ctx.translate(delta / 2, delta)
            }
            ctx.beginPath()
            ctx.fillStyle = 'white'
            ctx.roundRect(-width / 2, -width / 2, width, width, 4)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
            ctx.beginPath()
            ctx.fillStyle = 'white'
            ctx.roundRect(-width / 2 + width + 10, -width / 2, width, width, 4)
            ctx.fill()
            ctx.stroke()
            ctx.closePath()
            ctx.beginPath()
            ctx.font = '10px Futura'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillStyle = 'black'
            ctx.fillText(dice1.value.toString(), 0, 0)
            ctx.fillText(dice2.value.toString(), width + 10, 0)
            ctx.closePath()
        })
    }

    private drawExtraInfo(index: number, message: string) {
        ownContext(this.context, (ctx) => {
            ctx.font = '15px Futura'
            const { width } = ctx.measureText(message)
            ctx.translate(this.canvasWidth / 2, this.canvasHeight / 2 + this.elevation / 2)
            switch (index) {
                case 0:
                    ctx.translate(-width - 10, -50)
                    break
                case 1:
                    ctx.translate(10, -50)
                    break
                case 2:
                    ctx.translate(-width - 10, 50)
                    break
                default:
                    ctx.translate(10, 50)
            }
            ctx.fillText(message, 0, 0)
        })
    }

    private drawGeneralInfo(message: string, index: number) {
        ownContext(this.context, (ctx) => {
            ctx.translate(this.canvasWidth / 2, 30 + index * 30)
            ctx.textAlign = 'center'
            ctx.font = '20px Futura'
            ctx.fillText(message, 0, 0)
        })
    }

    private drawPlayerZone(matrix: DOMMatrix) {
        const a = matrix.transformPoint(new DOMPoint(0, 0))
        const b = matrix.transformPoint(new DOMPoint(this.canvasWidth - this.elevation, 0))
        const c = matrix.transformPoint(
            new DOMPoint(this.canvasWidth - this.elevation, this.canvasHeight - this.elevation)
        )
        const d = matrix.transformPoint(new DOMPoint(0, this.canvasHeight - this.elevation))
        ownContext(this.context, (ctx) => {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(c.x, c.y)
            ctx.stroke()
            ctx.closePath()

            ctx.beginPath()
            ctx.moveTo(b.x, b.y)
            ctx.lineTo(d.x, d.y)
            ctx.stroke()
            ctx.closePath()
        })
    }
}
