import React, {useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import styles from '../styles/Board.module.css';
import {createNewPic, addPointToLastPic, __transformBrushToKey} from '../store/board/actions'
import { TOOLBAR_MODE_ERASE, TOOLBAR_MODE_DRAW } from '../store/toolbar/constants'
import { fetchApi } from '../helpers/api';

export const Board = props => {
    const store_points = props.points;
    const currentBrushWidth = props.brushWidth;
    const currentBrushColor = props.brushColor;
    const currentEraserWidth = props.eraserWidth;
    const currentMode = props.mode;

    const canvas_ref = useRef(null);

    function createNewPicEvent(e) {

        // put to store empty array as "width.color": [..., []] for adding new points in future
        props.createNewPic( currentMode === TOOLBAR_MODE_DRAW ? __transformBrushToKey({
            width: currentBrushWidth,
            color: currentBrushColor
        }) : currentEraserWidth , currentMode)
    }

    function addPointToLastPicEvent(e) {
        if (e.buttons !== 1 && e.touches === undefined) return;

        // put to store one point as "width.color": [[...], [..., {x, y}]]
        props.addPointToLastPic({
            x: (e.type == 'mousemove') ? (e.clientX - e.target.offsetLeft) : (e.touches[0].clientX - e.target.offsetLeft),
            y: (e.type == 'mousemove') ? (e.clientY - e.target.offsetTop) : (e.touches[0].clientY - e.target.offsetTop),
        }, currentMode === TOOLBAR_MODE_DRAW ? __transformBrushToKey({
            width: currentBrushWidth,
            color: currentBrushColor
        }) : currentEraserWidth, currentMode);
    }

    function saveLastPic(e) {
        if (!props.websocket || !props.url) return;

        let key = currentMode === TOOLBAR_MODE_DRAW ? __transformBrushToKey({
            width: currentBrushWidth,
            color: currentBrushColor
        }) : currentEraserWidth

        let lastPic = store_points[ store_points.length - 1 ].data[key][ store_points[ store_points.length - 1 ].data[key].length - 1 ]

        fetchApi('/board', 'PUT', {
                        board_url: props.url,
                        data_delta: JSON.stringify(lastPic),
                        key: key,
                        action: "BOARD_ADD_PIC",
                        mode: currentMode
                    }, response => {

                        if (response.success){
                            props.websocket.send(JSON.stringify({
                                    action: 'saveLastPic',
                                    pic: lastPic,
                                    key: key,
                                    mode: currentMode
                                }));
                            } else {
                                console.log(' error on fetch PUT /board: ', response.error.message)
                            }
                        }
                        )

    }

    useEffect(() => {
        function initContext(canvas) {
            let ctx = canvas.getContext('2d');

            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;

            ctx.lineCap = 'round'

            return ctx
        }

        let ctx = initContext(canvas_ref.current)

        // if empty object with points ->  clear context
        if (Object.keys(store_points).length === 0){
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            return;
        }

        // draw picture with points from store that saved as "width.color": [[{x, y}, {x, y}, ...], [{x, y}, {x, y}, ...], ...]

        store_points.forEach(element => {

            if (element.mode === TOOLBAR_MODE_DRAW){
                ctx.globalCompositeOperation = 'source-over'
            } else if (element.mode === TOOLBAR_MODE_ERASE){
                ctx.globalCompositeOperation = 'destination-out'
            } else return;

            for (const [key, points] of Object.entries(element.data)) {
                if (points.length === 0) continue;

                if (element.mode === TOOLBAR_MODE_DRAW){
                    ctx.lineWidth = key.split('.')[0];
                    ctx.strokeStyle = key.split('.')[1];
                } else if (element.mode === TOOLBAR_MODE_ERASE){
                    ctx.lineWidth = key;
                } else return;

                points.map( one_picture => {
                    for (let i=0; i < one_picture.length - 1; i++){
                        ctx.beginPath(); // begin

                        ctx.moveTo(one_picture[i].x, one_picture[i].y); // from

                        ctx.lineTo(one_picture[i + 1].x, one_picture[i + 1].y); // to

                        ctx.stroke(); // draw it!
                    }
                } )
            }
        });


    }, [store_points]);

    return (
        <div className={styles.canvasContainer}>
                <canvas onTouchStart={createNewPicEvent} onTouchMove={addPointToLastPicEvent} onTouchEnd={saveLastPic} onMouseUp={saveLastPic} onMouseDown={createNewPicEvent} onMouseMove={addPointToLastPicEvent} className={styles.canvas} id="drawingCanvas" ref={canvas_ref}>
                </canvas>
            </div>
        )
}

const mapStateToProps = (state) => ({
    points: state.board.points,
    brushWidth: state.toolbar.brushWidth,
    brushColor: state.toolbar.brushColor,
    eraserWidth: state.toolbar.eraserWidth,
    mode: state.toolbar.mode
})

const mapDispatchToProps = {
    createNewPic, addPointToLastPic,
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);
