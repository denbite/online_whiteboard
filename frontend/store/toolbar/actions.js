export const TOOLBAR_CHANGE_BRUSH_WIDTH = "TOOLBAR_CHANGE_BRUSH_WIDTH"
export const TOOLBAR_CHANGE_BRUSH_COLOR = "TOOLBAR_CHANGE_BRUSH_COLOR"
export const TOOLBAR_COUNT = "TOOLBAR_COUNT"

export const TOOLBAR_BRUSH_WIDTH_LOW = 2
export const TOOLBAR_BRUSH_WIDTH_MIDDLE = 4
export const TOOLBAR_BRUSH_WIDTH_BIG = 6

export const TOOLBAR_BRUSH_COLOR_RED = "#C0392B"
export const TOOLBAR_BRUSH_COLOR_BLUE = "#0056C5"
export const TOOLBAR_BRUSH_COLOR_GREEN = "#83BE42"

export const changeBrushWidth = width => ({
    type: TOOLBAR_CHANGE_BRUSH_WIDTH,
    payload: width
})

export const changeBrushColor = color => ({
    type: TOOLBAR_CHANGE_BRUSH_COLOR,
    payload: color
})

export const changeCount = count => ({
    type: TOOLBAR_COUNT,
    payload: count
})



