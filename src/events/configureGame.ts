import { Game, Player } from '../object'
import { CustomError } from '../utils'

const configureGameEvent = (game: Game) => {
    const players: Player[] = []
    players.push(new Player(0, $('#player_0').val() as string, $('#player_0_icon').val() as string))
    players.push(new Player(1, $('#player_1').val() as string, $('#player_1_icon').val() as string))
    let player2 = $('#player_2')
    if (player2.val()) {
        players.push(new Player(2, player2.val() as string, $('#player_2_icon').val() as string))
        let player3 = $('#player_3')
        if (player3.val()) {
            players.push(new Player(3, player3.val() as string, $('#player_3_icon').val() as string))
        }
    }
    game.configureGame(players)
    $('#setup_div').addClass('hidden')
    $('#game_div').removeClass('hidden')
}

export const configureGame = (game: Game) => {
    console.log('configureGame')
    const configureGameButton = document.querySelector<HTMLButtonElement>('#startButton')
    if (configureGameButton) {
        configureGameButton.addEventListener('click', () => configureGameEvent(game))
    } else {
        throw new CustomError('button#startButton is undefined')
    }
}
