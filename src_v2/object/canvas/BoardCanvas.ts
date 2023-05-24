import { Draw } from './Draw.ts'
import { DrawSettings } from './DrawSettings.ts'
import { GameSettings } from '../GameSettings.ts'
import { Slot } from '../Slot.ts'
import { Direction, SquareType } from '../../type'
import { ownContext } from '../../utils'
import Color from 'color'

export class BoardCanvas extends DrawSettings implements Draw {
    private readonly canvas: OffscreenCanvas
    private readonly context: OffscreenCanvasRenderingContext2D
    private opacity = 0

    constructor(settings: GameSettings) {
        super(settings)
        const canvas = new OffscreenCanvas(this.canvasWidth, this.canvasHeight)
        const context = canvas.getContext('2d')
        if (!context) {
            throw new Error(`no context for offscreen canvas Board`)
        }
        this.canvas = canvas
        this.context = context
    }

    public draw(slots: Slot[] /*players: Player[]*/) {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.opacity = this.opacity === 0 ? 1 : 0
        this.drawTopSurface()
        this.drawSquare(slots)
        this.drawPolish()
        return {
            canvas: this.canvas,
            shouldDraw: slots.some((slot) => slot.blink),
        }
    }

    private drawTopSurface() {
        ownContext(this.context, (ctx) => {
            let region = new Path2D()
            region.moveTo(0, 0)
            region.lineTo(this.canvasWidth, 0)
            region.lineTo(this.canvasWidth, this.canvasHeight)
            region.lineTo(0, this.canvasHeight)
            region.lineTo(0, 0)
            region.moveTo(this.cardHeight, this.cardHeight)
            region.lineTo(this.canvasWidth - this.cardHeight, this.cardHeight)
            region.lineTo(this.canvasWidth - this.cardHeight, this.canvasHeight - this.cardHeight)
            region.lineTo(this.cardHeight, this.canvasHeight - this.cardHeight)
            region.closePath()

            ctx.fillStyle = this.settings.bgColor
            ctx.fill(region, 'evenodd')
        })
    }

    private drawSquare(slots: Slot[] /*, players: Player[]*/) {
        ownContext(this.context, (ctx) => {
            ctx.lineWidth = 3
            ctx.strokeStyle = 'black'

            slots.forEach((slot) => {
                if (slot.blink) {
                    this.drawBlink(slot)
                }

                ctx.beginPath()
                switch (slot.direction) {
                    case Direction.top_left:
                        ctx.moveTo(slot.x, slot.y)
                        ctx.lineTo(slot.x + slot.w, slot.y)
                        break
                    case Direction.bottom_right:
                        ctx.moveTo(slot.x, slot.y + slot.h)
                        ctx.lineTo(slot.x + slot.w, slot.y + slot.h)
                        break
                    case Direction.top_right:
                        ctx.moveTo(slot.x + slot.w, slot.y)
                        ctx.lineTo(slot.x + slot.w, slot.y + slot.h)
                        break
                    case Direction.bottom_left:
                        ctx.moveTo(slot.x, slot.y)
                        ctx.lineTo(slot.x, slot.y + slot.h)
                        break
                }
                ctx.closePath()
                ctx.stroke()

                switch (slot.type) {
                    case SquareType.property:
                        this.drawPropertyColor(slot)
                        break
                    case SquareType.jail:
                        this.drawJail(slot)
                        break
                }
                this.drawSlotName(slot)
            })
        })
    }

    private drawPropertyColor(slot: Slot) {
        ownContext(this.context, (ctx) => {
            switch (slot.direction) {
                case Direction.top_left:
                case Direction.bottom_right:
                    ctx.beginPath()
                    ctx.rect(slot.x + slot.w, slot.y, -this.propertyHeight, slot.h)
                    ctx.closePath()
                    break
                case Direction.bottom_left:
                case Direction.top_right:
                    ctx.beginPath()
                    ctx.rect(slot.x, slot.y + slot.h, slot.w, -this.propertyHeight)
                    ctx.closePath()
                    break
            }

            ctx.fillStyle = slot.propertyColor ?? ''
            ctx.fill()

            switch (slot.direction) {
                case Direction.top_left:
                case Direction.bottom_right:
                    ctx.beginPath()
                    ctx.moveTo(slot.x + slot.w, slot.y)
                    ctx.lineTo(slot.x + slot.w - this.propertyHeight, slot.y)
                    ctx.lineTo(slot.x + slot.w - this.propertyHeight, slot.y + slot.h)
                    ctx.lineTo(slot.x + slot.w, slot.y + slot.h)
                    ctx.stroke()
                    ctx.closePath()
                    break
                case Direction.top_right:
                case Direction.bottom_left:
                    ctx.beginPath()
                    ctx.moveTo(slot.x, slot.y + slot.h)
                    ctx.lineTo(slot.x, slot.y + slot.h - this.propertyHeight)
                    ctx.lineTo(slot.x + slot.w, slot.y + slot.h - this.propertyHeight)
                    ctx.lineTo(slot.x + slot.w, slot.y + slot.h)
                    ctx.stroke()
                    ctx.closePath()
                    break
            }
        })
    }

    private drawJail(slot: Slot) {
        ownContext(this.context, (ctx) => {
            ctx.strokeStyle = 'black'
            ctx.lineWidth = 3

            ctx.beginPath()
            ctx.moveTo(slot.x, slot.y + 30)
            ctx.lineTo(slot.x, slot.y + slot.h)
            ctx.lineTo(slot.x + (slot.w - 30), slot.y + slot.h)
            ctx.lineTo(slot.x + (slot.w - 30), slot.y + 30)
            ctx.closePath()

            ctx.fillStyle = 'orange'
            ctx.fill()
            ctx.stroke()

            ctx.beginPath()
            ctx.moveTo(slot.x, slot.y + 30 + (slot.h - 30) / 2)
            ctx.lineTo(slot.x + (slot.w - 30) / 2, slot.y + slot.h)
            ctx.lineTo(slot.x + slot.w - 30, slot.y + 30 + (slot.h - 30) / 2)
            ctx.lineTo(slot.x + (slot.w - 30) / 2, slot.y + 30)
            ctx.closePath()

            ctx.fillStyle = 'white'
            ctx.fill()
            ctx.stroke()
        })
    }

    private drawSlotName(slot: Slot) {
        if ([SquareType.station, SquareType.chance, SquareType.tax].includes(slot.type)) {
            ownContext(this.context, (ctx) => {
                let x: number
                let y: number
                let rotate: number
                switch (slot.direction) {
                    case Direction.top_left:
                    case Direction.bottom_right:
                        x = slot.x + 10
                        y = slot.y + slot.h / 2
                        rotate = 0.5
                        break
                    case Direction.bottom_left:
                    case Direction.top_right:
                        x = slot.x + slot.w / 2
                        y = slot.y + 10
                        rotate = 1
                        break
                }
                ctx.font = '20px Futura'
                ctx.textAlign = 'center'
                ctx.translate(x, y)
                ctx.rotate(rotate * Math.PI)
                ctx.fillText(slot?.friendlyName ?? '', 0, 0)
            })
        }
    }

    private drawBlink(slot: Slot) {
        ownContext(this.context, (ctx) => {
            if (this.opacity) {
                ctx.fillStyle = Color(slot.propertyColor ?? 'black')
                    .fade(0.4)
                    .toString()
            } else {
                ctx.fillStyle = `transparent`
            }
            ctx.fillRect(slot.x, slot.y, slot.w - 1, slot.h - 1)
        })
    }

    private drawPolish() {
        ownContext(this.context, (ctx) => {
            ctx.strokeStyle = 'rgba(255,255,255,.3)'
            ctx.lineWidth = 4

            ctx.beginPath()
            ctx.moveTo(1, this.canvasHeight)
            ctx.lineTo(1, 1)
            ctx.lineTo(this.canvasWidth, 1)
            ctx.stroke()
            ctx.closePath()

            ctx.beginPath()
            ctx.moveTo(this.canvasWidth - this.cardHeight + 1, this.cardHeight)
            ctx.lineTo(this.canvasWidth - this.cardHeight + 1, this.canvasHeight - this.cardHeight + 1)
            ctx.lineTo(this.cardHeight, this.canvasHeight - this.cardHeight + 1)
            ctx.stroke()

            ctx.closePath()
        })
    }
}
