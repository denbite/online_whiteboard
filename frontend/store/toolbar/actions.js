export const TOOLBAR_CHANGE_BRUSH_WIDTH = "TOOLBAR_CHANGE_BRUSH_WIDTH"
export const TOOLBAR_CHANGE_BRUSH_COLOR = "TOOLBAR_CHANGE_BRUSH_COLOR"
export const TOOLBAR_CHANGE_MODE = "TOOLBAR_CHANGE_MODE"
export const TOOLBAR_CHANGE_ERASER_WIDTH = "TOOLBAR_CHANGE_ERASER_WIDTH"

export const changeBrushWidth = width => ({
    type: TOOLBAR_CHANGE_BRUSH_WIDTH,
    payload: width
})


export const changeBrushColor = color => ({
    type: TOOLBAR_CHANGE_BRUSH_COLOR,
    payload: color
})

export const changeMode = mode => ({
    type: TOOLBAR_CHANGE_MODE,
    payload: mode
})

export const changeEraserWidth = width => ({
    type: TOOLBAR_CHANGE_ERASER_WIDTH,
    payload: width
})
