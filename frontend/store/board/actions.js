export const BOARD_CREATE_NEW_PIC = "BOARD_CREATE_NEW_PIC"
export const BOARD_ADD_POINT_TO_LAST_PIC = "BOARD_ADD_POINT_TO_LAST_PIC"

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

const __transformBrushToKey = (brush) => (
    [brush.width, brush.color].join('.')
)