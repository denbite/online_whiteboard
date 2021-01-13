import React, {useEffect, useCallback} from 'react';
import { useSelector, useDispatch, connect } from 'react-redux';
import styles from '../styles/Board.module.css';
import {createNewPic, addPointToLastPic} from '../store/board/actions'

export const Board = props => {
    const store_points = props.points;
    const currentBrushWidth = props.brushWidth;
    const currentBrushColor = props.brushColor;

    // const dispatch = useDispatch();

    var [canvas, ctx] = [null, null];

    const getCanvas = useCallback(
        (node) => {
            console.log(node);
            ctx = initContext(node);
            canvas = node;
        },
        [],
    )

    function initContext(canvas) {
        let ctx = canvas.getContext('2d');
    
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight;
    
        ctx.lineCap = 'round'
    
        ctx.canvas.addEventListener('mousemove', addPointToLastPicEvent);
        ctx.canvas.addEventListener('mousedown', createNewPicEvent);
    
        return ctx
    }

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
        console.log('on draw: ', store_points);

        // if empty object with points -> clear context
        if (Object.keys(store_points).length === 0){
            ctx.clearRect(0, 0, canvas.width, canvas.height);
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

    console.log('init points: ', store_points)
    console.log('props: ', props)

    return (
        <div className={styles.canvasContainer}>
                <canvas className={styles.canvas} id="drawingCanvas" ref={getCanvas}>
                </canvas>
            </div>
        )
}

const mapStateToProps = (state) => ({
    points: state.board.points,
    brushWidth: state.toolbar.brushWidth,
    brushColor: state.toolbar.brushColor,
})

const mapDispatchToProps = {
    createNewPic, addPointToLastPic, 
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);


// OLD VERSION

// class Board extends React.Component{
//     componentDidMount = () => {
//         // setting context from canvas node
//         this.ctx = this.canvas.getContext('2d');

//         // add listeners for main actions
//         this.canvas.addEventListener('mousemove', this.addPointToLastPic);
//         this.canvas.addEventListener('mousedown', this.createNewPic);
    
//         this.ctx.canvas.width = window.innerWidth;
//         this.ctx.canvas.height = window.innerHeight;
    
//         // init brush parameters
//         this.ctx.lineCap = 'round';

//         // without timeout it's require to double click on button 'clear rect' 
//         // console.log(useStore());
//         // useStore().subscribe(this.draw);
//     }

//     createNewPic = e => {
//         // put to store empty array as "width.color": [..., []] for adding new points in future
//         this.props.createNewPic({
//             width: this.props.brushWidth,
//             color: this.props.brushColor,
//         })
//     }

//     addPointToLastPic = e => {
//         if (e.buttons !== 1) return;

//         // put to store one point as "width.color": [[...], [..., {x, y}]]
//         this.props.addPointToLastPic({
//             x: e.clientX - e.target.offsetLeft,
//             y: e.clientY - e.target.offsetTop
//         }, {
//             width: this.props.brushWidth,
//             color: this.props.brushColor,
//         });
//     }

//     draw = () => {
//         let store_points = useStore().state.board.points;

//         console.log('in draw:', store_points);

//         // if empty object with points -> clear context
//         if (Object.keys(store_points).length === 0){
//             this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//             return;
//         }

//         // draw picture with points from store that saved as "width.color": [[{x, y}, {x, y}, ...], [{x, y}, {x, y}, ...], ...]
//         for (const [key, points] of Object.entries(store_points)) {
//             if (points.length === 0) continue;

//             let brushWidth = key.split('.')[0];
//             let brushColor = key.split('.')[1];

//             points.map( one_picture => {
//                 for (let i=0; i < one_picture.length - 1; i++){
//                     this.ctx.beginPath(); // begin
    
//                     this.ctx.lineWidth = brushWidth;
//                     this.ctx.strokeStyle = brushColor;
    
//                     this.ctx.moveTo(one_picture[i].x, one_picture[i].y); // from
    
//                     this.ctx.lineTo(one_picture[i + 1].x, one_picture[i + 1].y); // to
    
//                     this.ctx.stroke(); // draw it!
//                 }
//             } )
//         }
//     }

//     render(){
//         return (
//         <div className={styles.canvasContainer}>
//                 <canvas className={styles.canvas} id="drawingCanvas" ref={(element) => {this.canvas = element}}>
//                 </canvas>
//           </div>
//         )
//     }
// }

// const mapStateToProps = (state) => ({
//     // points: state.board.points,
//     brushWidth: state.toolbar.brushWidth,
//     brushColor: state.toolbar.brushColor,
// })

// const mapDispatchToProps = {
//     createNewPic, addPointToLastPic, 
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Board);