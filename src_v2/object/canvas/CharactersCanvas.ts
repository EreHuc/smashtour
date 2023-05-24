import { Draw } from './Draw.ts'
import { DrawSettings } from './DrawSettings.ts'
import { GameSettings } from '../GameSettings.ts'
import { Slot } from '../Slot.ts'
import { ownContext } from '../../utils'
import { SquareType } from '../../type'

export class CharactersCanvas extends DrawSettings implements Draw {
    private readonly canvas: OffscreenCanvas
    private readonly context: OffscreenCanvasRenderingContext2D
    private readonly charWidth = this.cardWidth - 20

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

    public draw(slots: Slot[]) {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        ownContext(this.context, (ctx) => {
            slots.forEach((slot, i) => {
                if (this.settings.debug) {
                    if (i === 0) {
                        ctx.save()
                        ctx.beginPath()
                        ctx.arc(0, 0, 10, -Math.PI, Math.PI)
                        ctx.closePath()
                        ctx.fillStyle = 'red'
                        ctx.fill()
                        ctx.restore()
                    }
                }

                ctx.save()
                let x: number
                let y: number
                switch (slot.type) {
                    case SquareType.jail:
                        x = slot.x + (slot.w - 30) / 2
                        y = slot.y + 30 + (slot.h - 30) / 2
                        break
                    default:
                        x = slot.x + slot.w / 2
                        y = slot.y + slot.h / 2
                }
                ctx.translate(x, y)
                ctx.rotate(Math.PI * 0.75)
                ctx.font = '20px Futura'
                ctx.textAlign = 'center'

                if (this.settings.debug) {
                    ctx.fillText(i.toString(), 0, 0)
                }
                switch (slot.type) {
                    case SquareType.start:
                        ctx.fillText('START', 0, -slot.h / 2 + 20)
                        break
                    case SquareType.parking:
                        ctx.fillText('FREE', 0, -slot.h / 2 + 30)
                        ctx.fillText('PARKING', 0, slot.h / 2 - 20)
                        break
                    case SquareType.toJail:
                        ctx.fillText('GO TO', 0, -slot.h / 2 + 30)
                        ctx.fillText('JAIL', 0, slot.h / 2 - 20)
                }
                if (slot.character?.image) {
                    ctx.drawImage(
                        slot.character?.image,
                        -this.charWidth / 2,
                        -this.charWidth / 2,
                        this.charWidth,
                        this.charWidth
                    )
                }
                ctx.restore()
            })
        })
        return { canvas: this.canvas }
    }
}
