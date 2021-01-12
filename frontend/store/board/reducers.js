import {BOARD_CHANGE_BRUSH_COLOR, BOARD_CHANGE_BRUSH_WIDTH} from './actions';

const initialState = {
    'width': 3,
    'color': '#c0392b'
}

export const boardReducer = (state = initialState, action) => {

    switch (action.type){
        case BOARD_CHANGE_BRUSH_WIDTH: 
            return { ...state,  width: action.payload }

        case BOARD_CHANGE_BRUSH_COLOR: 
            return { ...state,  color: action.payload }
    }

    return state;
}