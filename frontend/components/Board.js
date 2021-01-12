import React from 'react';

import styles from '../styles/Board.module.css'

export default class Board extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
          ctx: null,
          pos: {
              x: 0,
              y: 0
          }
        };
      }

    componentDidMount = () => {
        this.setState({
            ctx: this.canvas.getContext('2d')
        }, () => {
            this.state.ctx.canvas.width = window.innerWidth;
            this.state.ctx.canvas.height = window.innerHeight;

            // init brush settings with default values
            this.setLineWidth();
            this.setBrushColor();
            this.state.ctx.lineCap = 'round';

            this.canvas.addEventListener('mousemove', this.draw);
            this.canvas.addEventListener('mousedown', this.setPosition);
            this.canvas.addEventListener('mouseenter', this.setPosition);
        })
    }

    componentWillUnmount = () => {
        this.setState({
            ctx: null,
            pos: {
                x: 0,
                y: 0
            }
          });

        delete this.canvas;
    }

    setPosition = (e) => {
        this.setState({
            pos: {
                x: e.clientX - e.target.offsetLeft,
                y: e.clientY - e.target.offsetTop
            }
        })
    }

    setLineWidth = (width = 3) => {

        if (!Number.isInteger(width)) {
            width = 3; // set to default value
        }

        this.state.ctx.lineWidth = width;
    }

    setBrushColor = (color = "#c0392b") => {
        if (!color instanceof String || color.length != 7){
            color = "#c0392b"; // default color
        }

        this.state.ctx.strokeStyle = color;
    }

    draw = (e) => {
        // mouse left button must be pressed
        if (e.buttons !== 1) return;

        this.state.ctx.beginPath(); // begin

        this.state.ctx.moveTo(this.state.pos.x, this.state.pos.y); // from
        this.setPosition(e);
        this.state.ctx.lineTo(this.state.pos.x, this.state.pos.y); // to

        this.state.ctx.stroke(); // draw it!
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