import { GameSettings } from '../GameSettings.ts'

export class DrawSettings {
    readonly squarePerRow = 7
    readonly canvasHeight = 1000
    readonly canvasWidth = 1000
    readonly cardHeight = 160
    readonly cardWidth = (this.canvasWidth - 2 * this.cardHeight) / this.squarePerRow
    readonly elevation = 30
    readonly propertyHeight = 30

    settings

    constructor(settings: GameSettings) {
        this.settings = settings
    }
}
