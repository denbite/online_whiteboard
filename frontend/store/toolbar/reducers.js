import {TOOLBAR_CHANGE_BRUSH_COLOR, TOOLBAR_CHANGE_BRUSH_WIDTH, TOOLBAR_CHANGE_MODE, TOOLBAR_CHANGE_ERASER_WIDTH } from './actions';
import {TOOLBAR_BRUSH_WIDTH_MIDDLE, TOOLBAR_BRUSH_COLOR_RED, TOOLBAR_MODE_DRAW, TOOLBAR_ERASER_WIDTH_LOW} from './constants';

const initialState = {
    brushWidth: TOOLBAR_BRUSH_WIDTH_MIDDLE,
    brushColor: TOOLBAR_BRUSH_COLOR_RED,
    mode: TOOLBAR_MODE_DRAW,
    eraserWidth: TOOLBAR_ERASER_WIDTH_LOW
}

export const toolbarReducer = (state = initialState, action) => {

    switch (action.type){
        case TOOLBAR_CHANGE_BRUSH_WIDTH:
            return { ...state, brushWidth: action.payload }

        case TOOLBAR_CHANGE_BRUSH_COLOR:
            return { ...state, brushColor: action.payload}

        case TOOLBAR_CHANGE_MODE:
            return { ...state, mode: action.payload }

        case TOOLBAR_CHANGE_ERASER_WIDTH:
            return { ...state, eraserWidth: action.payload }
    }

    return state;
}
