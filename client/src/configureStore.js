import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { appReducer } from './reducers'

const logger = createLogger()

function configureStore(initialState) {
    // const reduxWebSocket = socketMiddleware()
    const store = createStore(
        appReducer,
        initialState,
        applyMiddleware(thunkMiddleware, logger)
    )
    return store
}

const store = configureStore()

export default store



