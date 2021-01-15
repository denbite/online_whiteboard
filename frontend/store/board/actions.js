export const BOARD_CREATE_NEW_PIC = "BOARD_CREATE_NEW_PIC"
export const BOARD_ADD_POINT_TO_LAST_PIC = "BOARD_ADD_POINT_TO_LAST_PIC"
export const BOARD_CLEAR = "BOARD_CLEAR"
export const BOARD_INIT_POINTS = "BOARD_INIT_POINTS"
export const BOARD_ADD_PIC = "BOARD_ADD_PIC" 

export const createNewPic = (brush) => ({
    type: BOARD_CREATE_NEW_PIC,
    payload: __transformBrushToKey(brush)
})

export const addPointToLastPic = (point, brush) => ({
    type: BOARD_ADD_POINT_TO_LAST_PIC,
    payload: {
        point, 
        key: __transformBrushToKey(brush)
    }
})

export const clearBoard = () => ({
    type: BOARD_CLEAR
})

export const initPoints = (points) => ({
    type: BOARD_INIT_POINTS,
    payload: points
})

export const addPic = (pic, brush) => ({
    type: BOARD_ADD_PIC,
    payload: {
        pic,
        key: __transformBrushToKey(brush)
    }
})

const __transformBrushToKey = (brush) => (
    [brush.width, brush.color].join('.')
)