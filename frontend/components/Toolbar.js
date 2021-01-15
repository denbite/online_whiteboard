import React from 'react';
import styles from '../styles/Toolbar.module.css';
import { connect } from 'react-redux';
import {changeBrushColor, changeBrushWidth} from '../store/toolbar/actions';
import { clearBoard } from '../store/board/actions';
import * as actions from '../store/toolbar/constants';

class Toolbar extends React.Component{
    saveCanvas = (event) => {
        console.log('clicked!');
    }

    clearBoard = (event) => {
        this.props.clearBoard();

        if (!this.props.websocket || !this.props.url) return;

        fetch('http://192.168.0.100:8000/api/board', {
                method:'PUT',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                },
                body: new URLSearchParams({
                    board_url: this.props.url,
                    action: "BOARD_CLEAR"
                })
            })
            .then(r => r.json())
            .then(response => {
                if (response.success){
                    this.props.websocket.send(JSON.stringify({
                        action: 'clearBoard'
                    }))
                } else {
                    console.log('error on fetch PUT /board: ', response.error.message)
                }
            })
    }

    render(){
        return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarBlock}>
            - Операции -<br/>
                <button className={styles.saveButton} id="saveButton" onClick={this.saveCanvas}>
                Поделиться
                </button>
                <button className={styles.clearButton} id="clearButton" onClick={this.clearBoard}>
                Очистить
                </button>
            </div>
            <div className={styles.toolbarBlock}>
            - Цвет -<br/>
                <img onClick={e => this.props.changeBrushColor(actions.TOOLBAR_BRUSH_COLOR_RED)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_red.gif" />
                <img onClick={e => this.props.changeBrushColor(actions.TOOLBAR_BRUSH_COLOR_GREEN)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_green.gif" /> 
                <img onClick={e => this.props.changeBrushColor(actions.TOOLBAR_BRUSH_COLOR_BLUE)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_blue.gif" /> 
            </div>
            <div className={styles.toolbarBlock}>
            - Толщина -<br/>
                <img onClick={e => this.props.changeBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_LOW)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_thin.gif" />
                <img onClick={e => this.props.changeBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_MIDDLE)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_medium.gif" /> 
                <img onClick={e => this.props.changeBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_BIG)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_thick.gif" />
            </div>
        </div>
        )
    }
}

const mapDispatchToProps = {
    changeBrushColor,
    changeBrushWidth,
    clearBoard
}

export default connect(Object, mapDispatchToProps)(Toolbar);
