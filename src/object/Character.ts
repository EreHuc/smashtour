import { Characters } from '../type'

export class Character {
    friendlyName: string[]
    name: Characters
    image: HTMLImageElement

    constructor(name: Characters) {
        this.image = new Image()
        this.image.src = `/img/stock/${name}.png`
        this.name = name
        this.friendlyName = name
            .toUpperCase()
            .split('_')
            .reduce((acc, value) => {
                if (acc.length && acc[acc.length - 1] !== undefined) {
                    const fullName = [acc[acc.length - 1], value].join(' ')
                    if (fullName.length <= 11) {
                        acc[acc.length - 1] = fullName
                    } else {
                        acc.push(value)
                    }
                } else {
                    acc.push(value)
                }
                return acc
            }, [] as string[])
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
