export const MAKE_GUESS = 'MAKE_GUESS'
export const START_CHALLENGE = 'START_CHALLENGE'


export const startChallenge = (notes) => (dispatch, getState) => {
    return new Promise((resolve) => {
        dispatch({
            type: START_CHALLENGE,
            notes
        })
        resolve()
    })
}


export const makeGuess = notes => ({
    type: MAKE_GUESS,
    notes
})
