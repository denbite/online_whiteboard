import {TOOLBAR_CHANGE_BRUSH_COLOR, TOOLBAR_CHANGE_BRUSH_WIDTH, TOOLBAR_BRUSH_WIDTH_MIDDLE, TOOLBAR_BRUSH_COLOR_RED, TOOLBAR_COUNT } from './actions';

const initialState = {
    brushWidth: TOOLBAR_BRUSH_WIDTH_MIDDLE,
    brushColor: TOOLBAR_BRUSH_COLOR_RED,
    count: 0
}

export const toolbarReducer = (state = initialState, action) => {

    switch (action.type){
        case TOOLBAR_CHANGE_BRUSH_WIDTH:
            return { ...state, brushWidth: action.payload }

        case TOOLBAR_CHANGE_BRUSH_COLOR: 
            return { ...state, brushColor: action.payload}
        
        case TOOLBAR_COUNT:
            return { ...state, count: action.payload }
    }

    return state;
}