import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'

import * as reducers from '../reducers/index'

const rootReducer = combineReducers({ ...reducers })
const middlewares = applyMiddleware(thunk)

export default function configureStore() {
    return createStore(
        rootReducer,
        middlewares
    )
}