import { boardReducer } from './board/reducers';
import { toolbarReducer } from './toolbar/reducers';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
        board: boardReducer,
        toolbar: toolbarReducer
    })