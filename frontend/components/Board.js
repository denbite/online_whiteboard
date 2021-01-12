import React from 'react';
import { connect } from 'react-redux';
import styles from '../styles/Board.module.css';

class Board extends React.Component{
    constructor(props) {
        super(props);

        console.log(this.props);

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

    draw = (e) => {
        // mouse left button must be pressed
        if (e.buttons !== 1) return;

        this.state.ctx.beginPath(); // begin

        this.state.ctx.lineWidth = this.props.brushWidth;
        this.state.ctx.lineCap = 'round';
        this.state.ctx.strokeStyle = this.props.brushColor;

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

const mapStateToProps = (state) => ({
    brushWidth: state.board.width,
    brushColor: state.board.color,
})

export default connect(mapStateToProps, {})(Board);