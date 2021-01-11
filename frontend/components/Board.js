import React from 'react';

import styles from '../styles/Board.module.css'

export default class Board extends React.Component{
    render(){
        return (
        <div className={styles.canvasContainer}>
                <canvas className={styles.canvas} id="drawingCanvas">
                </canvas>
          </div>
        )
    }
}