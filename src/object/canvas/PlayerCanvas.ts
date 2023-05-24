import { Draw } from './Draw.ts'
import { DrawSettings } from './DrawSettings.ts'
import { GameSettings } from '../GameSettings.ts'
import { Slot } from '../Slot.ts'
import { GameError, ownContext } from '../../utils'
import { Player } from '../Player.ts'
import { Direction } from '../../type'

export class PlayerCanvas extends DrawSettings implements Draw {
    private readonly canvas: OffscreenCanvas
    private readonly context: OffscreenCanvasRenderingContext2D

    constructor(settings: GameSettings) {
        super(settings)

        const canvas = new OffscreenCanvas(this.canvasWidth, this.canvasHeight)
        const context = canvas.getContext('2d')
        if (!context) {
            throw new GameError(`no context for offscreen canvas Board`)
        }
        this.canvas = canvas
        this.context = context
    }

    public draw(slots: Slot[], players: Player[], matrix: DOMMatrix) {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.drawPlayers(slots, players, matrix)

        return {
            shouldDraw: players.some((player) => player.currentSlotIndex !== player.slotIndex),
            canvas: this.canvas,
        }
    }

    private drawPlayers(slots: Slot[], players: Player[], matrix: DOMMatrix) {
        ownContext(this.context, (ctx) => {
            players.forEach((player, i) => {
                if (player.currentSlotIndex >= slots.length) {
                    throw new GameError(
                        `Current slot index can't be superior to slots length. slotIndex: ${player.currentSlotIndex} | slotsLength: ${slots.length}`
                    )
                }
                const delta1 = Math.abs(player.slotIndex - player.currentSlotIndex)

                if (delta1 > 0) {
                    player.currentSlotIndex += 1
                }

                const slot = slots[player.currentSlotIndex]
                const point = matrix.transformPoint(new DOMPoint(slot.x + slot.w / 2, slot.y + slot.h / 2))
                let x: number = point.x
                let y: number = point.y
                switch (slot.direction) {
                    case Direction.top_left:
                    case Direction.bottom_right:
                        x = point.x - 20 + (i + 1) * 10
                        break
                    case Direction.top_right:
                    case Direction.bottom_left:
                        y = point.y - 20 + (i + 1) * 10
                        break
                }
                ctx.fillStyle = player.color
                if (this.settings.debug) {
                    ctx.beginPath()
                    ctx.arc(x, y, 10, -Math.PI, Math.PI)
                    ctx.closePath()
                    ctx.fill()
                }
                ctx.drawImage(player.image, x - 25, y - 25, 50, 50)
                this.drawOutline(slot, player, matrix)
            })
        })
    }

    private drawOutline(slot: Slot, player: Player, matrix: DOMMatrix) {
        ownContext(this.context, (ctx) => {
            const pointA = matrix.transformPoint(new DOMPoint(slot.x, slot.y))
            const pointB = matrix.transformPoint(new DOMPoint(slot.x + slot.w, slot.y))
            const pointC = matrix.transformPoint(new DOMPoint(slot.x, slot.y + slot.h))
            const pointD = matrix.transformPoint(new DOMPoint(slot.x + slot.w, slot.y + slot.h))
            ctx.beginPath()
            ctx.moveTo(pointA.x, pointA.y)
            ctx.lineTo(pointB.x, pointB.y)
            ctx.lineTo(pointD.x, pointD.y)
            ctx.lineTo(pointC.x, pointC.y)
            ctx.closePath()
            ctx.strokeStyle = player.color
            ctx.lineWidth = 3
            ctx.stroke()
        })
    }
}
