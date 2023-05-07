import { Game } from '../object'
import { CustomError } from '../utils'

const rollDiceEvent = (game: Game) => {
    $('#top_board').html('')
    $('#roll_dice').addClass('hidden')
    game.rollDice()
}

export const rollDice = (game: Game) => {
    const rollDiceButton = document.querySelector<HTMLButtonElement>('#roll_dice')
    if (rollDiceButton) {
        rollDiceButton.removeEventListener('click', () => rollDiceEvent(game))
        rollDiceButton.addEventListener('click', () => rollDiceEvent(game))
    } else {
        throw new CustomError('button#roll_dice is undefined')
    }
}
