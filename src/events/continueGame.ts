import { Game } from '../object'
import { CustomError } from '../utils'

const continueGameEvent = (game: Game) => {
    game.continueGame()
    $('#setup_div, #resume_div').addClass('hidden')
    $('#game_div').removeClass('hidden')
}

export const continueGame = (game: Game) => {
    const continueGameButton = document.querySelector<HTMLButtonElement>('#continue-game-button')
    if (continueGameButton) {
        continueGameButton.removeEventListener('click', () => continueGameEvent(game))
        continueGameButton.addEventListener('click', () => continueGameEvent(game))
    } else {
        throw new CustomError('button#continue-game-button is undefined')
    }
}
