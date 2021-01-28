export const BOARD_CREATE_NEW_PIC = "BOARD_CREATE_NEW_PIC"
export const BOARD_ADD_POINT_TO_LAST_PIC = "BOARD_ADD_POINT_TO_LAST_PIC"
export const BOARD_CLEAR = "BOARD_CLEAR"
export const BOARD_INIT_POINTS = "BOARD_INIT_POINTS"
export const BOARD_ADD_PIC = "BOARD_ADD_PIC"

export const createNewPic = (key, mode) => ({
    type: BOARD_CREATE_NEW_PIC,
    payload: {
        key, mode
    }
})

export const addPointToLastPic = (point, key, mode) => ({
    type: BOARD_ADD_POINT_TO_LAST_PIC,
    payload: {
        point,
        key,
        mode
    }
})

export const clearBoard = () => ({
    type: BOARD_CLEAR
})

export const initPoints = (points) => ({
    type: BOARD_INIT_POINTS,
    payload: points
})

export const addPic = (pic, key, mode) => ({
    type: BOARD_ADD_PIC,
    payload: {
        pic,
        key,
        mode
    }
})

export const __transformBrushToKey = (brush) => (
    [brush.width, brush.color].join('.')
)
