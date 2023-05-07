import { Game } from '../object'
import { CustomError } from '../utils'

const winEvent = (playerIndex: number, game: Game) => {
    $('.win').addClass('hidden')
    $('.settings_div').html('')
    $('#match_settings .text').html('')
    game.win(playerIndex)
}

export const win = (game: Game) => {
    ;['#p0button', '#p1button', '#p2button', '#p3button'].forEach((selector, index) => {
        const winButton = document.querySelector<HTMLButtonElement>(selector)
        if (winButton) {
            winButton.removeEventListener('click', () => winEvent(index, game))
            winButton.addEventListener('click', () => winEvent(index, game))
        } else {
            throw new CustomError(`button${selector} is undefined`)
        }
    })
}
