import { DrawSettings } from './DrawSettings.ts'
import { Draw } from './Draw.ts'
import { GameSettings } from '../GameSettings.ts'
import { Slot } from '../Slot.ts'
import { Player } from '../Player.ts'
import { ownContext } from '../../utils'
import { Direction } from '../../type'

export class PropertyCanvas extends DrawSettings implements Draw {
    private readonly canvas: OffscreenCanvas
    private readonly context: OffscreenCanvasRenderingContext2D
    private readonly houseImg: HTMLImageElement
    private readonly hotelImg: HTMLImageElement

    constructor(settings: GameSettings) {
        super(settings)

        const canvas = new OffscreenCanvas(this.canvasWidth, this.canvasHeight)
        const context = canvas.getContext('2d')
        if (!context) {
            throw new Error(`no context for offscreen canvas Board`)
        }
        this.canvas = canvas
        this.context = context
        const houseImg = document.querySelector<HTMLImageElement>('#house')
        const hotelImg = document.querySelector<HTMLImageElement>('#hotel')

        if (houseImg === null || hotelImg === null) {
            throw new Error('Missing house or hotel img')
        }

        this.houseImg = houseImg
        this.hotelImg = hotelImg
    }

    public draw(slots: Slot[], players: Player[], matrix: DOMMatrix) {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        slots.forEach((slot) => {
            this.drawPlayerProperty(slot, players, matrix)
        })

        return { canvas: this.canvas }
    }

    private drawPlayerProperty(slot: Slot, players: Player[], matrix: DOMMatrix) {
        if (slot.owner) {
            const owner = players.find((player) => player.id === slot.owner)
            if (!owner) {
                return
            }
            ownContext(this.context, (ctx) => {
                ctx.fillStyle = owner.color
                ctx.strokeStyle = 'rgba(255,255,255,0.7)'
                if (slot.upgrade < 2) {
                    for (let i = slot.upgrade; i >= 0; i--) {
                        let x: number
                        let y: number
                        switch (slot.direction) {
                            case Direction.bottom_right:
                            case Direction.top_left:
                                x = slot.x + slot.w - this.propertyHeight / 2 + 10
                                y = slot.y + slot.h / 2 + (-15 + i * 30)
                                break
                            case Direction.bottom_left:
                            case Direction.top_right:
                                x = slot.x + slot.w / 2 + (-15 + i * 30)
                                y = slot.y + slot.h - this.propertyHeight / 2 + 10
                                break
                        }

                        const point = matrix.transformPoint(new DOMPoint(x, y))

                        ctx.drawImage(this.houseImg, point.x - 20, point.y - 20, 40, 40)

                        // if (this.settings.debug) {
                        ctx.beginPath()
                        ctx.arc(point.x, point.y, 5, -Math.PI, Math.PI)
                        ctx.fill()
                        ctx.stroke()
                        ctx.closePath()
                        // }
                    }
                } else {
                    let x: number
                    let y: number
                    switch (slot.direction) {
                        case Direction.bottom_right:
                        case Direction.top_left:
                            x = slot.x + slot.w - this.propertyHeight / 2 + 10
                            y = slot.y + slot.h / 2
                            break
                        case Direction.bottom_left:
                        case Direction.top_right:
                            x = slot.x + slot.w / 2
                            y = slot.y + slot.h - this.propertyHeight / 2 + 10
                            break
                    }

                    const point = matrix.transformPoint(new DOMPoint(x, y))
                    ctx.drawImage(this.hotelImg, point.x - 25, point.y - 25, 50, 50)

                    // if (this.settings.debug) {
                    ctx.beginPath()
                    ctx.arc(point.x, point.y, 7, -Math.PI, Math.PI)
                    ctx.fill()
                    ctx.stroke()
                    ctx.closePath()
                    // }
                }
            })
        }
    }
}
