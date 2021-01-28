import {BOARD_ADD_POINT_TO_LAST_PIC, BOARD_CREATE_NEW_PIC, BOARD_CLEAR, BOARD_INIT_POINTS , BOARD_ADD_PIC} from './actions';
import {TOOLBAR_MODE_DRAW, TOOLBAR_MODE_ERASE} from '../toolbar/constants';
import produce from 'immer';

const initialState = {
    points: [
        {
            mode: TOOLBAR_MODE_DRAW,
            data: {}
        }
    ]
}

export const boardReducer = (state = initialState, action) => {

    switch (action.type){
        case BOARD_CREATE_NEW_PIC:
            return produce(state, draft => {

                // check if last mode is not equal to the current or if points not empty
                if (!draft.points.length > 0 || draft.points[ draft.points.length - 1 ].mode != action.payload.mode){

                    draft.points.push({
                        mode: action.payload.mode,
                        data: {}
                    })

                }

                // check if key exist
                if (!draft.points[ draft.points.length - 1 ].data.hasOwnProperty(action.payload.key)){
                    // create if no exist
                    draft.points[ draft.points.length - 1 ].data[action.payload.key] = [];
                }

                // add new empty array for new picture
                draft.points[ draft.points.length - 1 ].data[action.payload.key].push([]);
            })

        case BOARD_ADD_POINT_TO_LAST_PIC:
            return produce(state, draft => {
                // if mode is correct
                if (draft.points[ draft.points.length - 1 ].mode === action.payload.mode){

                    // check if data key exist
                    if (draft.points[ draft.points.length - 1 ].data.hasOwnProperty(action.payload.key)){
                        draft.points[ draft.points.length - 1 ].data[action.payload.key][ draft.points[ draft.points.length - 1 ].data[action.payload.key].length - 1 ].push(action.payload.point)
                    }
                }
            })

        case BOARD_CLEAR:
            return {...state, points: []}

        case BOARD_INIT_POINTS:
            return { ...state, points: action.payload }

        case BOARD_ADD_PIC:
            return produce(state, draft => {

                // check if last mode is not equal to the current or if points not empty
                if (!draft.points.length > 0 || draft.points[ draft.points.length - 1 ].mode != action.payload.mode){

                    draft.points.push({
                        mode: action.payload.mode,
                        data: {}
                    })

                }

                if (!draft.points[ draft.points.length - 1 ].data.hasOwnProperty(action.payload.key)){
                    draft.points[ draft.points.length - 1 ].data[action.payload.key] = [];
                }

                draft.points[ draft.points.length - 1 ].data[action.payload.key].push(action.payload.pic);
            })
    }

    return state;
}
