import {TOOLBAR_CHANGE_BRUSH_COLOR, TOOLBAR_CHANGE_BRUSH_WIDTH } from './actions';
import {TOOLBAR_BRUSH_WIDTH_MIDDLE, TOOLBAR_BRUSH_COLOR_RED} from './constants';

const initialState = {
    brushWidth: TOOLBAR_BRUSH_WIDTH_MIDDLE,
    brushColor: TOOLBAR_BRUSH_COLOR_RED
}

export const toolbarReducer = (state = initialState, action) => {

    switch (action.type){
        case TOOLBAR_CHANGE_BRUSH_WIDTH:
            return { ...state, brushWidth: action.payload }

        case TOOLBAR_CHANGE_BRUSH_COLOR: 
            return { ...state, brushColor: action.payload}
    }

    return state;
}