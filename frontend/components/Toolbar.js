import React from 'react';

import styles from '../styles/Toolbar.module.css'

export default class Toolbar extends React.Component{
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
                <img className={styles.toolbarImgButton} id="redPen" src="http://professorweb.ru/downloads/pen_red.gif" alt="Красная кисть" onclick="changeColor('rgb(212,21,29)', this)"/>
                <img className={styles.toolbarImgButton} id="greenPen" src="http://professorweb.ru/downloads/pen_green.gif" alt="Зеленая кисть" onclick="changeColor('rgb(131,190,61)', this)"/> 
                <img className={styles.toolbarImgButton} id="bluePen" src="http://professorweb.ru/downloads/pen_blue.gif" alt="Синяя кисть" onclick="changeColor('rgb(0,86,166)', this)"/>
            </div>
            <div className={styles.toolbarBlock}>
            - Толщина -<br/>
                <img className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_thin.gif" alt="Тонкая кисть" onclick="changeThickness(1, this)"/>
                <img className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_medium.gif" alt="Нормальная кисть" onclick="changeThickness(5, this)"/> 
                <img className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_thick.gif" alt="Толстая кисть" onclick="changeThickness(10, this)"/>
            </div>
        </div>
        )
    }
}