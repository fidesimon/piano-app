import { applyMiddleware, createStore, Reducer, Action } from 'redux';
import { createLogger } from 'redux-logger';
import { Z_DEFAULT_STRATEGY } from 'zlib';

let defaultState = {
    keysPressed: [0]
}

function keys(state = defaultState, action){
    switch (action.types) {
        case ('NEW_KEY_PRESSED'):
            return {
                ...state,
                keysPressed: state.keysPressed.push(action.data.keyPressed)
            }
        case ('KEY_RELEASED'):
            let keys = state.keysPressed;
            let index = keys.indexOf(action.data.keyOff);
            keys.splice(index, 1);
            return {
                ...state,
                keysPressed: keys
            }
        default:
            return state;
    }
}

let logger = createLogger({
    collapsed: true
});

let store = createStore(
    keys,
    applyMiddleware(logger)
);

export default store;