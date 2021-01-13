import {BOARD_ADD_POINT_TO_LAST_PIC, BOARD_CREATE_NEW_PIC, BOARD_CLEAR } from './actions';

const initialState = {
    points: {}
}

export const boardReducer = (state = initialState, action) => {

    switch (action.type){
        case BOARD_CREATE_NEW_PIC:
            if (!state.points.hasOwnProperty(action.payload)){
                state.points[action.payload] = [];
            }

            state.points[action.payload].push([]);
            return state

        case BOARD_ADD_POINT_TO_LAST_PIC:
            state.points[action.payload.key][ state.points[action.payload.key].length - 1 ].push(action.payload.point);
            return state
   
        case BOARD_CLEAR:
            return {...state, points: {}}
    }

    return state;
}