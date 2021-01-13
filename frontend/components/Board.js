import React from 'react';
import { connect } from 'react-redux';
import styles from '../styles/Board.module.css';
import {createNewPic, addPointToLastPic} from '../store/board/actions'

class Board extends React.Component{
    componentDidMount = () => {
        // setting context from canvas node
        this.ctx = this.canvas.getContext('2d');

        this.canvas.addEventListener('mousemove', this.draw);
        this.canvas.addEventListener('mousedown', e => (
            this.props.createNewPic({
                width: this.props.brushWidth,
                color: this.props.brushColor,
            })
        ));

        // this.ctx.canvas.addEventListener('mouseenter', posFunc);
    
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    
        // init brush parameters
        this.ctx.lineCap = 'round';
    }



    draw = (e) => {
        if (e.buttons !== 1) return;

        this.props.addPointToLastPic({
            x: e.clientX - e.target.offsetLeft,
            y: e.clientY - e.target.offsetTop
        }, {
            width: this.props.brushWidth,
            color: this.props.brushColor,
        });
        
        this.renderBoard();
    }

    renderBoard = () => {
        for (const [key, points] of Object.entries(this.props.points)) {
            if (points.length === 0) continue;

            let brushWidth = key.split('.')[0];
            let brushColor = key.split('.')[1];

            points.map( one_picture => {
                for (let i=0; i < one_picture.length - 1; i++){
                    this.ctx.beginPath(); // begin
    
                    this.ctx.lineWidth = brushWidth;
                    this.ctx.strokeStyle = brushColor;
    
                    this.ctx.moveTo(one_picture[i].x, one_picture[i].y); // from
    
                    this.ctx.lineTo(one_picture[i + 1].x, one_picture[i + 1].y); // to
    
                    this.ctx.stroke(); // draw it!
                }
            } )
        }
    }

    render(){
        return (
        <div className={styles.canvasContainer}>
                <canvas className={styles.canvas} id="drawingCanvas" ref={(element) => {this.canvas = element}}>
                </canvas>
          </div>
        )
    }
}

const mapStateToProps = (state) => ({
    points: state.board.points,
    brushWidth: state.toolbar.brushWidth,
    brushColor: state.toolbar.brushColor,
})

const mapDispatchToProps = {
    createNewPic, addPointToLastPic
}

export default connect(mapStateToProps, mapDispatchToProps)(Board);