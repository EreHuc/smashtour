import { Game } from '../object'
import { CustomError } from '../utils'

export const toggleDLC = (game: Game) => {
    const toggleDLCButton = document.querySelector<HTMLButtonElement>('#toggleDLC')
    if (toggleDLCButton) {
        toggleDLCButton.removeEventListener('click', () => game.toggleDLC())
        toggleDLCButton.addEventListener('click', () => game.toggleDLC())
    } else {
        throw new CustomError('button#continue-game-button is undefined')
    }
}
