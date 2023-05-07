import { Game } from '../object'
import { newGame } from './newGame.ts'
import { continueGame } from './continueGame.ts'
import { configureGame } from './configureGame.ts'
import { win } from './win.ts'
import { processCard } from './processCard.ts'
import { randomiseBoard } from './randomiseBoard.ts'
import { rollDice } from './rollDice.ts'
import { checkCanStart } from './checkCanStart.ts'
import { toggleDLC } from './toggleDLC.ts'

const setEvents = (game: Game) => {
    console.log('set events')
    newGame()
    checkCanStart()
    continueGame(game)
    configureGame(game)
    win(game)
    processCard(game)
    randomiseBoard(game)
    rollDice(game)
    toggleDLC(game)
}

export default setEvents
