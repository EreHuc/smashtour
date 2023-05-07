import { CustomError } from '../utils'

const checkCanStartEvent = () => {
    let canStart = true
    if (!$('#player_0').val()) {
        canStart = false
    }
    if (!$('#player_0_icon').val()) {
        canStart = false
    }
    if (!$('#player_1').val()) {
        canStart = false
    }
    if (!$('#player_1_icon').val()) {
        canStart = false
    }
    if ($('#player_2').val() && !$('#player_2_icon').val()) {
        canStart = false
    }
    if ($('#player_3').val() && !$('#player_3_icon').val()) {
        canStart = false
    }
    if (canStart) {
        $('#startButton').removeAttr('disabled')
    } else {
        $('#startButton').attr('disabled', 'disabled')
    }
}

export const checkCanStart = () => {
    const playerNameInputs = document.querySelectorAll<HTMLButtonElement>('.player_name_input')
    const playerTokenInputs = document.querySelectorAll<HTMLButtonElement>('.player_token_select')
    if (playerNameInputs.length) {
        playerNameInputs.forEach((element) => element.removeEventListener('change', checkCanStartEvent))
        playerNameInputs.forEach((element) => element.addEventListener('change', checkCanStartEvent))
    } else {
        throw new CustomError('no input.player_name_input')
    }
    if (playerTokenInputs.length) {
        playerTokenInputs.forEach((element) => element.removeEventListener('change', checkCanStartEvent))
        playerTokenInputs.forEach((element) => element.addEventListener('change', checkCanStartEvent))
    } else {
        throw new CustomError('no select.player_token_select')
    }
}
