import { Game } from '../object'
import { CustomError } from '../utils'

const processCardEvent = (game: Game) => {
    $('#continue_game').addClass('hidden')
    game.processCard()
}

export const processCard = (game: Game) => {
    const processCardButton = document.querySelector<HTMLButtonElement>('#continue_game')
    if (processCardButton) {
        processCardButton.removeEventListener('click', () => processCardEvent(game))
        processCardButton.addEventListener('click', () => processCardEvent(game))
    } else {
        throw new CustomError('button#continue-game is undefined')
    }
}
