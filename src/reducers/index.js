import { START_CHALLENGE, MAKE_GUESS, UPDATE_STATS } from "../actions";

const initialState = {
    baseNote: null,
    targetNote: null,
    guessedNote: null
}

export function notes(notes = initialState, action) {
    switch (action.type) {
        case START_CHALLENGE:
            return Object.assign(
                {}, notes,
                action.notes
            )
        case MAKE_GUESS:
            return Object.assign(
                {}, notes,
                action.notes
            )
        default:
            return notes
    }
}

export function statistics(statistics = {}, action) {
    switch (action.type) {
        case UPDATE_STATS:
            return Object.assign(
                {}, statistics,
                action.statistics
            )
        default:
            return statistics
    }
}