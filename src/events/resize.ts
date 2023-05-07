import { CustomError } from '../utils'

const resizeEvent = (gameDiv: Element, gameDivRect: DOMRect) => {
    const height = window.innerHeight
    const width = window.innerWidth
    const gameRect = gameDivRect
    const smallestWidth = Math.min(gameRect.width, width)
    const smallestHeight = Math.min(gameRect.height, height)

    gameDiv.setAttribute(
        'style',
        `transform: scale(${smallestHeight <= smallestWidth ? height / gameRect.height : width / gameRect.width})`
    )
}

export const resize = () => {
    const gameDiv = document.querySelector('#game_div')
    if (gameDiv) {
        let gameDivRect: DOMRect
        window.addEventListener('resize', () => {
            resizeEvent(gameDiv, gameDivRect)
        })
        const resizeObserver = new ResizeObserver((entries) => {
            if (entries.length) {
                gameDivRect = entries[0].contentRect
                resizeEvent(gameDiv, gameDivRect)
            }
        })
        resizeObserver.observe(gameDiv)
    } else {
        throw new CustomError('div#game_div is undefined')
    }
}
