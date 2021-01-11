import React from 'react';

import styles from '../styles/Toolbar.module.css'

export default class Toolbar extends React.Component{
    render(){
        return (
        <div className={styles.toolbar}>
        - Операции -<br></br>
            <button className={styles.saveButton} id="saveButton">
            Сохранить
            </button>
            <button className={styles.clearButton} id="clearButton">
            Очистить
            </button>
        </div>
        )
    }
}