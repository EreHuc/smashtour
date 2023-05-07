import { CustomError } from '../utils'
import { Game } from '../object'

export const randomiseBoard = (game: Game) => {
    const processCardButton = document.querySelector<HTMLButtonElement>('#randomize-button')
    if (processCardButton) {
        processCardButton.removeEventListener('click', () => game.randomiseBoard())
        processCardButton.addEventListener('click', () => game.randomiseBoard())
    } else {
        throw new CustomError('button#randomize-button is undefined')
    }
}
