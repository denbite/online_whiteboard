export const NOTIFICATION_TOGGLE = "NOTIFICATION_TOGGLE"
export const NOTIFICATION_CHANGE_MESSAGE = "NOTIFICATION_CHANGE_MESSAGE"

export const toggleShow = () => ({
    type: NOTIFICATION_TOGGLE
})

export const changeMessage = (message) => ({
    type: NOTIFICATION_CHANGE_MESSAGE,
    payload: message
})
