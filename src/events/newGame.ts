import { CustomError } from '../utils'

const newGameEvent = () => {
    $('#resume_div').addClass('hidden')
    $('#setup_div').removeClass('hidden')
}

export const newGame = () => {
    const newGameButton = document.querySelector<HTMLButtonElement>('#new-game-button')
    if (newGameButton) {
        newGameButton.removeEventListener('click', newGameEvent)
        newGameButton.addEventListener('click', newGameEvent)
    } else {
        throw new CustomError('button#new-game-button is undefined')
    }
}
