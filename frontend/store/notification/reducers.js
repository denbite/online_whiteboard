import {NOTIFICATION_TOGGLE, NOTIFICATION_CHANGE_MESSAGE} from './actions';

const initialState = {
    show: false,
    message: ''
}

export const notificationReducer = (state = initialState, action) => {

    switch (action.type){
        case NOTIFICATION_TOGGLE:
            return { ...state, show: !state.show }

        case NOTIFICATION_CHANGE_MESSAGE:
            return { ...state, message: action.payload }
    }

    return state;
}