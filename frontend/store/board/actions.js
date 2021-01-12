export const BOARD_CHANGE_BRUSH_WIDTH = "BOARD_CHANGE_BRUSH_WIDTH"
export const BOARD_CHANGE_BRUSH_COLOR = "BOARD_CHANGE_BRUSH_COLOR"

export const setBrushWidth = width => ({
    'type': BOARD_CHANGE_BRUSH_WIDTH,
    'payload': width
})

export const setBrushColor = color => ({
    'type': BOARD_CHANGE_BRUSH_COLOR,
    'payload': color
})