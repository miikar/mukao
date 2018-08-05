import { START_CHALLENGE, MAKE_GUESS } from "../actions";

const initialState = {
    baseNote: null,
    targetNote: null,
    guessedNote: null
}

export function notes(state = initialState, action) {
    switch (action.type) {
        case START_CHALLENGE:
            return Object.assign(
                {}, state,
                action.notes
                //{ gamestate: 'PLAY_SOUND' },
            )
        case MAKE_GUESS:
            return Object.assign(
                {}, state,
                action.notes
            )
        default:
            return state
    }
}