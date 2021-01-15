import {BOARD_ADD_POINT_TO_LAST_PIC, BOARD_CREATE_NEW_PIC, BOARD_CLEAR, BOARD_INIT_POINTS , BOARD_ADD_PIC} from './actions';
import produce from 'immer';

const initialState = {
    points: {}
}

export const boardReducer = (state = initialState, action) => {

    switch (action.type){
        case BOARD_CREATE_NEW_PIC:
            return produce(state, draft => {
                if (!draft.points.hasOwnProperty(action.payload)){
                    draft.points[action.payload] = [];
                }

                draft.points[action.payload].push([]);
            })

        case BOARD_ADD_POINT_TO_LAST_PIC:
            return produce(state, draft => {
                draft.points[action.payload.key][ draft.points[action.payload.key].length - 1 ].push(action.payload.point)
            })
   
        case BOARD_CLEAR:
            return {...state, points: {}}
        
        case BOARD_INIT_POINTS:
            return {...state, points: action.payload}

        case BOARD_ADD_PIC:
            return produce(state, draft => {
                if (!draft.points.hasOwnProperty(action.payload.key)){
                    draft.points[action.payload.key] = [];
                }

                draft.points[action.payload.key].push(action.payload.pic)
            })
    }

    return state;
}