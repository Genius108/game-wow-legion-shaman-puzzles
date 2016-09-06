'use strict';

import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from './reducers';

const loggerMiddleware = createLogger({
    stateTransformer(state) {
        return state;
    },
    actionTransformer(action) {
        if (action.type && action.status) {
            return {...action, type: `${action.type}_${action.status}`};
        }
        return action;
    },
    collapsed: true
});

export default function (initialState) {
    return createStore(reducers,
        initialState,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        ));
}