import React, {useEffect, useRef} from 'react';
import { connect } from 'react-redux';
import styles from '../styles/Board.module.css';
import {createNewPic, addPointToLastPic} from '../store/board/actions'

export const Board = props => {
    const store_points = props.points;
    const currentBrushWidth = props.brushWidth;
    const currentBrushColor = props.brushColor;

    const canvas_ref = useRef(null);

    function createNewPicEvent(e) {
        // put to store empty array as "width.color": [..., []] for adding new points in future
        props.createNewPic({
            width: currentBrushWidth,
            color: currentBrushColor,
        })
    }
    
    function addPointToLastPicEvent(e) {
        if (e.buttons !== 1) return;

        // put to store one point as "width.color": [[...], [..., {x, y}]]
        props.addPointToLastPic({
            x: e.clientX - e.target.offsetLeft,
            y: e.clientY - e.target.offsetTop
        }, {
            width: currentBrushWidth,
            color: currentBrushColor,
        });
    }

    useEffect(() => {
        function initContext(canvas) {
            console.log('initContext')
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
        for (const [key, points] of Object.entries(store_points)) {
            if (points.length === 0) continue;

            let brushWidth = key.split('.')[0];
            let brushColor = key.split('.')[1];

            points.map( one_picture => {
                for (let i=0; i < one_picture.length - 1; i++){
                    ctx.beginPath(); // begin

                    ctx.lineWidth = brushWidth;
                    ctx.strokeStyle = brushColor;

                    ctx.moveTo(one_picture[i].x, one_picture[i].y); // from

                    ctx.lineTo(one_picture[i + 1].x, one_picture[i + 1].y); // to

                    ctx.stroke(); // draw it!
                }
            } )
        }
    
    }, [store_points]);

    return (
        <div className={styles.canvasContainer}>
                <canvas onMouseDown={createNewPicEvent} onMouseMove={addPointToLastPicEvent} className={styles.canvas} id="drawingCanvas" ref={canvas_ref}>
                </canvas>
            </div>
        )
}

const mapStateToProps = (state) => ({
    points: state.board.points,
    brushWidth: state.toolbar.brushWidth,
    brushColor: state.toolbar.brushColor
})

const mapDispatchToProps = {
    createNewPic, addPointToLastPic
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);