export const MAKE_GUESS = 'MAKE_GUESS'
export const START_CHALLENGE = 'START_CHALLENGE'


export const startChallenge = challenge => ({
    type: START_CHALLENGE,
    challenge
})

export const makeGuess = guess => ({
    type: MAKE_GUESS,
    guess
})


const a = {
    gamestate: ['CHALLENGE', 'GUESS'],
    challenge: {
        id: 0,
        baseNote: 0,
        targetNote: 3,
        timestamp: 123,
    },
    guess: {
        id: 0,
        guessedNote: 1,
        timestamp: 115,
    }
}