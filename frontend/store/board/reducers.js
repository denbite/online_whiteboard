import {BOARD_ADD_POINT_TO_LAST_PIC, BOARD_CREATE_NEW_PIC } from './actions';

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
            console.log('new: ', state.points)
            return state

        case BOARD_ADD_POINT_TO_LAST_PIC:
            
            state.points[action.payload.key][ state.points[action.payload.key].length - 1 ].push(action.payload.point);
            console.log('moved: ', state.points)

            return state

    }

    return state;
}