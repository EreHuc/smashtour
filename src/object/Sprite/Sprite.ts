export class Sprite extends Image {
    displayName: string

    constructor(name: string, src: string) {
        super()
        this.displayName = name.replace(/_/g, ' ')
        this.src = src
    }
}
