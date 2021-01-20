import React from 'react';
import styles from '../styles/Toolbar.module.css';
import { connect } from 'react-redux';
import {changeBrushColor, changeBrushWidth} from '../store/toolbar/actions';
import { clearBoard } from '../store/board/actions';
import { toggleShow , changeUrl} from '../store/modal/actions';
import * as actions from '../store/toolbar/constants';
import { fetchApi } from '../helpers/api';
import { useRouter } from 'next/router';

export const Toolbar = props => {
    const router = useRouter()

    function shareBoard (event) {
        let url = 'http://192.168.0.100/'

        if (!props.url){
            // fetch api, create board and insert board_url
            fetchApi('/board', 'POST', {
                'points': JSON.stringify(props.points)
            }, response => {
                if (response.success){
                    url = 'http://192.168.0.100/b/' + response.data.board_url
                } else {
                    console.log('error on fetch POST /board: ', response.error.message)
                }

                props.changeUrl(url)

                router.push(url, undefined, {shallow: true})
            })
        } else {
            props.changeUrl('http://192.168.0.100/b/' + props.url)
        }
        
        props.toggleShow()
    }

    function clearBoard (event) {
        props.clearBoard();

        if (!props.websocket || !props.url) return;

        fetchApi('/board', 'PUT', {
                    board_url: props.url,
                    action: "BOARD_CLEAR"
                }, response => {
                    if (response.success){
                        props.websocket.send(JSON.stringify({
                            action: 'clearBoard'
                        }))
                    } else {
                        console.log('error on fetch PUT /board: ', response.error.message)
                    }
                })
    }

    return (
    <div className={styles.toolbar}>
        <div className={styles.toolbarBlock}>
        - Operations -<br/>
            <button className={styles.shareButton} onClick={shareBoard}>
            Share
            </button>
            <button className={styles.clearButton} onClick={clearBoard}>
            Clear
            </button>
        </div>
        <div className={styles.toolbarBlock}>
        - Color -<br/>
            <img onClick={e => props.changeBrushColor(actions.TOOLBAR_BRUSH_COLOR_RED)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_red.gif" />
            <img onClick={e => props.changeBrushColor(actions.TOOLBAR_BRUSH_COLOR_GREEN)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_green.gif" /> 
            <img onClick={e => props.changeBrushColor(actions.TOOLBAR_BRUSH_COLOR_BLUE)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_blue.gif" /> 
        </div>
        <div className={styles.toolbarBlock}>
        - Width -<br/>
            <img onClick={e => props.changeBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_LOW)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_thin.gif" />
            <img onClick={e => props.changeBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_MIDDLE)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_medium.gif" /> 
            <img onClick={e => props.changeBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_BIG)} className={styles.toolbarImgButton} src="http://professorweb.ru/downloads/pen_thick.gif" />
        </div>
    </div>
    )
}

const mapStateToProps = state => ({
    points: state.board.points
})

const mapDispatchToProps = {
    changeBrushColor,
    changeBrushWidth,
    clearBoard,
    toggleShow,
    changeUrl
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
