import { START_CHALLENGE, MAKE_GUESS, UPDATE_STATS } from "../actions";

const initiaNotes = {
    baseNote: null,
    targetNote: null,
    guessedNote: null
}

const savedStatistics = JSON.parse(window.localStorage.getItem('statistics')) || {};

export function notes(notes = initiaNotes, action) {
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

export function statistics(statistics = savedStatistics, action) {
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