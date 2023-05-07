export class Sprite {
    displayName: string
    image: HTMLImageElement

    constructor(name: string, image: HTMLImageElement) {
        this.displayName = name.replace(/_/g, ' ')
        this.image = image
    }
}
