import React from 'react';
import styles from '../styles/Toolbar.module.css';
import { connect } from 'react-redux';
import {setBrushColor, setBrushWidth} from '../store/board/actions';

class Toolbar extends React.Component{
    saveCanvas = (event) => {
        console.log('clicked!');
    }

    clearCanvas = (event) => {
        console.log('cleared!');
    }

    render(){
        return (
        <div className={styles.toolbar}>
            <div className={styles.toolbarBlock}>
            - Операции -<br/>
                <button className={styles.saveButton} id="saveButton" onClick={this.saveCanvas}>
                Поделиться
                </button>
                <button className={styles.clearButton} id="clearButton" onClick={this.clearCanvas}>
                Очистить
                </button>
            </div>
            <div className={styles.toolbarBlock}>
            - Цвет -<br/>
                <img onClick={e => this.props.setBrushColor("#C0392B")} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_red.gif" />
                <img onClick={e => this.props.setBrushColor("#83BE42")} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_green.gif" /> 
                <img onClick={e => this.props.setBrushColor("#0056C5")} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_blue.gif" onclick="changeColor('rgb(0,86,166)', this)"/>
            </div>
            <div className={styles.toolbarBlock}>
            - Толщина -<br/>
                <img onClick={e => this.props.setBrushWidth(1)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_thin.gif" />
                <img onClick={e => this.props.setBrushWidth(3)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_medium.gif" /> 
                <img onClick={e => this.props.setBrushWidth(5)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_thick.gif" />
            </div>
        </div>
        )
    }
}

const mapDispatchToProps = {
    setBrushWidth,
    setBrushColor
}

export default connect(() => {}, mapDispatchToProps)(Toolbar);
