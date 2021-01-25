import { boardReducer } from './board/reducers';
import { toolbarReducer } from './toolbar/reducers';
import { notificationReducer } from './notification/reducers';
import { modalReducer } from './modal/reducers';
import { combineReducers } from 'redux';

export const rootReducer = combineReducers({
        board: boardReducer,
        toolbar: toolbarReducer,
        notification: notificationReducer,
        modal: modalReducer,
    })
