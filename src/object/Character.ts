import { Characters } from '../type'

export class Character {
    friendlyName: string
    name: Characters
    image: HTMLImageElement

    constructor(name: Characters) {
        this.image = new Image()
        this.image.src = `/img/stock/${name}.png`
        this.name = name
        this.friendlyName = name.toUpperCase().split('_').join(' ')
        this.appendImg()
    }

    appendImg() {
        const img = document.querySelector(`img[data-character-name=${this.name}`)
        if (!img) {
            this.image.classList.add('hidden')
            document.body.append(this.image)
        }
    }
}
