import { BoardCanvas } from './BoardCanvas.ts'
import { CharactersCanvas } from './CharactersCanvas.ts'
import { PlayerCanvas } from './PlayerCanvas.ts'
import { DrawSettings } from './DrawSettings.ts'
import { Slot } from '../Slot.ts'
import { ownContext, lightenDarkenColor, GameError } from '../../utils'
import { GameSettings } from '../GameSettings.ts'
import { Player } from '../Player.ts'
import { PropertyCanvas } from './PropertyCanvas.ts'
import { UiCanvas } from './UiCanvas.ts'

export class GameCanvas extends DrawSettings {
    readonly canvas: HTMLCanvasElement
    private readonly context: CanvasRenderingContext2D
    private readonly boardCanvas: BoardCanvas
    private readonly charCanvas: CharactersCanvas
    private readonly playerCanvas: PlayerCanvas
    private readonly propertyCanvas: PropertyCanvas
    private readonly width = 1000
    private readonly height = 1000
    readonly uiCanvas: UiCanvas
    readonly diceCanvas: HTMLCanvasElement
    private _perspective = 0.7
    private yOffset = (this.height - this.height * this._perspective) / 2
    private frame = 0
    set perspective(per: number) {
        this._perspective = per
        this.yOffset = (this.height - this.height * per) / 2
        this.diceCanvas.setAttribute('style', `transform: scale(.5,${this.perspective / 2}) skew(-45deg, 45deg)`)
    }
    get perspective() {
        return this._perspective
    }

    constructor(settings: GameSettings) {
        super(settings)

        const canvas = document.querySelector<HTMLCanvasElement>('#game')
        if (!canvas) {
            throw new GameError(`no canvas`)
        }
        const context = canvas.getContext('2d')
        if (!context) {
            throw new GameError(`no context for canvas`)
        }
        const diceCanvas = document.querySelector<HTMLCanvasElement>('#dice')
        if (!diceCanvas) {
            throw new GameError(`no dice canvas`)
        }
        this.context = context
        this.canvas = canvas
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.boardCanvas = new BoardCanvas(this.settings)
        this.charCanvas = new CharactersCanvas(this.settings)
        this.propertyCanvas = new PropertyCanvas(this.settings)
        this.playerCanvas = new PlayerCanvas(this.settings)
        this.uiCanvas = new UiCanvas(this.settings)
        this.diceCanvas = diceCanvas
        this.diceCanvas.width = this.width - 2 * this.cardWidth - this.cardHeight * this.perspective - 10
        this.diceCanvas.height = this.height - 2 * this.cardHeight - 2
        this.diceCanvas.setAttribute('style', `transform: scale(.5,${this.perspective / 2}) skew(-45deg, 45deg)`)
    }

    public drawBoard(slots: Slot[], players: Player[]) {
        const matrix = this.getMatrix()
        const board = this.boardCanvas.draw(slots /*players*/)
        const characters = this.charCanvas.draw(slots)
        const player = this.playerCanvas.draw(slots, players, matrix)
        const property = this.propertyCanvas.draw(slots, players, matrix)
        const ui = this.uiCanvas.draw(slots, players, matrix)

        ownContext(this.context, (ctx) => {
            ctx.clearRect(0, 0, this.width, this.height)
            this.drawMiddleBoard()
            ctx.drawImage(ui.canvas, 0, 0, this.width, this.height)
            this.drawPerspective()
            this.drawOffscreenCanvas(board.canvas)
            this.drawOffscreenCanvas(characters.canvas)

            ctx.save()
            ctx.drawImage(player.canvas, 0, 0, this.width, this.height)
            ctx.drawImage(property.canvas, 0, 0, this.width, this.height)
            if (this.settings.debug) {
                this.frame += 1
                ctx.font = '15px Futura'
                ctx.fillText(`${this.frame}`, 30, 30)
            }
            ctx.restore()
        })

        return player.shouldDraw || board.shouldDraw
    }

    public isInSlot(slot: Slot, x: number, y: number) {
        const matrix = this.getMatrix()
        const pointA = matrix.transformPoint(new DOMPoint(slot.x, slot.y))
        const pointB = matrix.transformPoint(new DOMPoint(slot.x + slot.w, slot.y))
        const pointC = matrix.transformPoint(new DOMPoint(slot.x, slot.y + slot.h))
        const pointD = matrix.transformPoint(new DOMPoint(slot.x + slot.w, slot.y + slot.h))
        const rect = new Path2D()
        rect.moveTo(pointA.x, pointA.y)
        rect.lineTo(pointB.x, pointB.y)
        rect.lineTo(pointD.x, pointD.y)
        rect.lineTo(pointC.x, pointC.y)
        rect.closePath()

        return this.context.isPointInPath(rect, x, y)
    }

    private setCanvasPerspective(ctx: GameCanvas['context']) {
        ctx.translate(this.width / 2, this.yOffset)
        ctx.transform(1, this.perspective, -1, this.perspective, 0, 0)
        ctx.scale(0.5, 0.5)
        ctx.translate(this.width, this.height)
        ctx.rotate(Math.PI)
    }

    private drawOffscreenCanvas(canvas: OffscreenCanvas) {
        if (this.settings.debug) {
            ownContext(this.context, (ctx) => {
                ctx.beginPath()
                ctx.fillStyle = 'blue'
                ctx.arc(0, 0, 10, -Math.PI, Math.PI)
                ctx.fill()
                ctx.closePath()
            })
        }

        ownContext(this.context, (ctx) => {
            this.setCanvasPerspective(ctx)
            ctx.drawImage(canvas, 0, 0, this.width, this.height)
            if (this.settings.debug) {
                ctx.beginPath()
                ctx.fillStyle = 'violet'
                ctx.arc(0, 0, 10, -Math.PI, Math.PI)
                ctx.fill()
                ctx.closePath()
            }
        })
    }

    private drawPerspective() {
        const topLeft = {
            x: this.width / 2,
            y: this.yOffset + this.cardHeight * this.perspective + this.elevation,
            w: this.height - 2 * this.cardHeight,
            square: this.squarePerRow,
            corner: 0,
        }
        const bottomRight = {
            x: this.width,
            y: this.height / 2 + this.elevation,
            w: this.height,
            square: this.squarePerRow,
            corner: 1,
        }
        const topRight = {
            x: this.width / 2,
            y: this.yOffset + this.cardHeight * this.perspective + this.elevation,
            w: this.height - 2 * this.cardHeight,
            corner: 0,
            square: this.squarePerRow,
        }
        const bottomLeft = {
            x: 0,
            y: this.height / 2 + this.elevation,
            w: this.width,
            corner: 1,
            square: this.squarePerRow,
        }

        this.drawLeftPerspective(topRight)
        this.drawRightPerspective(topLeft)
        this.drawLeftPerspective(bottomLeft)
        this.drawRightPerspective(bottomRight)
    }

    private drawLeftPerspective(rect: { x: number; y: number; w: number; corner: number; square: number }) {
        ownContext(this.context, (ctx) => {
            ctx.lineWidth = 3
            ctx.transform(-1, -this.perspective, 0, 1, rect.x, rect.y)
            ctx.scale(0.5, 0.5)
            ctx.rotate(Math.PI)

            ctx.beginPath()
            ctx.rect(0, this.elevation, rect.w, this.elevation)
            ctx.fillStyle = lightenDarkenColor(this.settings.bgColor, -10)
            if (!rect.corner) {
                ctx.shadowBlur = 10
                ctx.shadowColor = 'rgba(0,0,0,.7)'
            }
            ctx.fill()
            ctx.closePath()

            if (rect.corner) {
                ctx.beginPath()
                ctx.rect(0, 0, rect.w, this.elevation)
                ctx.fillStyle = lightenDarkenColor('#8080', -10)
                ctx.fill()
                ctx.stroke()
                ctx.closePath()
            } else {
                ctx.strokeRect(0, this.elevation, rect.w, 1)
            }

            for (let i = 0; i < rect.square + rect.corner; i++) {
                let offX = i * this.cardWidth
                ctx.beginPath()
                if (rect.corner) {
                    offX += this.cardHeight
                }
                ctx.moveTo(offX, this.elevation)
                ctx.lineTo(offX, this.elevation * 2)
                ctx.closePath()
                ctx.stroke()
            }

            if (this.settings.debug) {
                ctx.beginPath()
                ctx.rect(0, 0, 10, 10)
                ctx.closePath()
                ctx.fillStyle = 'pink'
                ctx.fill()
            }
        })
    }

    private drawRightPerspective(rect: { x: number; y: number; w: number; corner: number; square: number }) {
        ownContext(this.context, (ctx) => {
            ctx.lineWidth = 3
            ctx.transform(1, -this.perspective, 0, 1, rect.x, rect.y)
            ctx.scale(0.5, 0.5)
            ctx.rotate(Math.PI)

            ctx.beginPath()
            ctx.rect(0, this.elevation, rect.w, this.elevation)
            ctx.fillStyle = lightenDarkenColor(this.settings.bgColor, -30)
            if (!rect.corner) {
                ctx.shadowBlur = 10
                ctx.shadowColor = 'rgba(0,0,0,.7)'
            }
            ctx.fill()
            ctx.closePath()

            if (rect.corner) {
                ctx.beginPath()
                ctx.rect(0, 0, rect.w, this.elevation)
                ctx.fillStyle = lightenDarkenColor('#8080', -30)
                ctx.fill()
                ctx.stroke()
                ctx.closePath()
            } else {
                ctx.strokeRect(0, this.elevation, rect.w, 1)
            }

            for (let i = 0; i < rect.square + rect.corner; i++) {
                let offX = i * this.cardWidth
                ctx.beginPath()
                if (rect.corner) {
                    offX += this.cardHeight
                }
                ctx.moveTo(offX, this.elevation)
                ctx.lineTo(offX, this.elevation * 2)
                ctx.closePath()
                ctx.stroke()
            }

            if (this.settings.debug) {
                ctx.beginPath()
                ctx.rect(0, 0, 10, 10)
                ctx.closePath()
                ctx.fillStyle = 'pink'
                ctx.fill()
            }
        })
    }

    private drawMiddleBoard() {
        ownContext(this.context, (ctx) => {
            this.setCanvasPerspective(ctx)
            ctx.fillStyle = lightenDarkenColor('#8080', 0)
            ctx.beginPath()
            ctx.rect(
                this.cardHeight,
                this.cardHeight,
                this.canvasWidth - 2 * this.cardHeight,
                this.canvasHeight - 2 * this.cardHeight
            )
            ctx.shadowBlur = 20
            ctx.shadowColor = 'black'
            ctx.shadowOffsetX = 5
            ctx.shadowOffsetY = 5
            ctx.fill()
            ctx.closePath()
        })
    }

    private getMatrix() {
        this.context.save()
        this.setCanvasPerspective(this.context)
        const matrix = this.context.getTransform()
        this.context.restore()
        return matrix
    }
}
