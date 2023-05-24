export class Player {
    get currentSlotIndex(): number {
        return this._currentSlotIndex
    }
    set currentSlotIndex(value: number) {
        this._currentSlotIndex = value % this.maxSquareIndex
    }
    get slotIndex(): number {
        return this._slotIndex
    }
    set slotIndex(value: number) {
        this.currentSlotIndex = this._slotIndex
        this._slotIndex = value % this.maxSquareIndex
    }
    private readonly maxSquareIndex: number = 1
    private _slotIndex = 0
    private _currentSlotIndex = 0
    readonly color: string
    readonly name: string
    id = Math.random().toString(16).slice(2, 6)
    inJail?: number | undefined
    image: HTMLImageElement
    imgSrc: string
    freeJailCard = false
    chooseCharCard = false

    constructor(name: string, color: string, maxSquareIndex: number, imgSrc: string) {
        this.maxSquareIndex = maxSquareIndex
        this.name = name
        this.color = color
        this.imgSrc = imgSrc
        this.image = new Image()
        this.image.src = `/img/tokens/${this.imgSrc}.png`
    }

    load(player: Player) {
        this._currentSlotIndex = player._currentSlotIndex
        this._slotIndex = player._slotIndex
        this.inJail = player.inJail
        this.id = player.id
        this.freeJailCard = player.freeJailCard
        this.chooseCharCard = player.chooseCharCard
    }
}
