import { boardReducer } from './board/reducers';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
        board: boardReducer
    })