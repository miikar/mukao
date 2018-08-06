export const MAKE_GUESS = 'MAKE_GUESS'
export const START_CHALLENGE = 'START_CHALLENGE'


export const startChallenge = (notes) => (dispatch) => {
    return new Promise((resolve) => {
        dispatch({
            type: START_CHALLENGE,
            notes
        })
        resolve()
    })
}


export const makeGuess = (notes) => (dispatch) => {
    return new Promise((resolve) => {
        dispatch({
            type: MAKE_GUESS,
            notes
        })
        resolve()
    })
}
