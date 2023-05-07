import { Sprite } from './Sprite.ts'

export class ChanceCard extends Sprite {
    constructor(name: string) {
        const image = new Image()
        image.src = `./assets/img/cards/chance/CHANCE ${name}.jpg`
        super(`chance_${name}`, image)
    }
}
