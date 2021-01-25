export const MODAL_TOGGLE = "MODAL_TOGGLE"
export const MODAL_CHANGE_URL = "MODAL_CHANGE_URL"

export const toggleShow = () => ({
    type: MODAL_TOGGLE
})

export const changeUrl = (url) => ({
    type: MODAL_CHANGE_URL,
    payload: url
})
