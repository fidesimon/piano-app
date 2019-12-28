import { createStore, applyMiddleware, compose } from 'redux';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant';

declare global {
    interface Window {
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
    }
}

export default function configureStore(initialState: any) {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    let logger = createLogger({
        collapsed: true
    });

    return createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(reduxImmutableStateInvariant(), logger)));
}