export const TOOLBAR_CHANGE_BRUSH_WIDTH = "TOOLBAR_CHANGE_BRUSH_WIDTH"
export const TOOLBAR_CHANGE_BRUSH_COLOR = "TOOLBAR_CHANGE_BRUSH_COLOR"

export const changeBrushWidth = width => ({
    type: TOOLBAR_CHANGE_BRUSH_WIDTH,
    payload: width
})

export const changeBrushColor = color => ({
    type: TOOLBAR_CHANGE_BRUSH_COLOR,
    payload: color
})
