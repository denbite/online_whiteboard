import { MODAL_CHANGE_URL, MODAL_TOGGLE } from './actions';

const initialState = {
    show: false,
    url: ""
}

export const modalReducer = (state = initialState, action) => {

    switch (action.type){
        case MODAL_TOGGLE:
            return { ...state, show: !state.show }

        case MODAL_CHANGE_URL:
            return { ...state, url: action.payload }
    }

    return state;
}
