import React from 'react';
import styles from '../styles/Toolbar.module.css';
import { connect } from 'react-redux';
import {changeBrushColor, changeBrushWidth, changeMode, changeEraserWidth} from '../store/toolbar/actions';
import { clearBoard } from '../store/board/actions';
import { toggleShow , changeUrl} from '../store/modal/actions';
import * as actions from '../store/toolbar/constants';
import { fetchApi } from '../helpers/api';
import { useRouter } from 'next/router';

export const Toolbar = props => {
    const router = useRouter()

    function shareBoard (event) {
        let url = process.env.NEXT_PUBLIC_FRONTEND_HOST

        if (!props.url){
            // fetch api, create board and insert board_url
            fetchApi('/board', 'POST', {
                'points': JSON.stringify(props.points)
            }, response => {
                if (response.success){
                    url += '/b/' + response.data.board_url
                } else {
                    console.log('error on fetch POST /board: ', response.error.message)
                }

                props.changeUrl(url)

                router.push(url, undefined, {shallow: true})
            })
        } else {
            props.changeUrl(url + '/b/' + props.url)
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

    function setBrushColor(color){
        props.changeMode(actions.TOOLBAR_MODE_DRAW)
        props.changeBrushColor(color)
    }

    function setBrushWidth(width){
        props.changeMode(actions.TOOLBAR_MODE_DRAW)
        props.changeBrushWidth(width)
    }

    function setEraserWidth(width){
        props.changeMode(actions.TOOLBAR_MODE_ERASE)
        props.changeEraserWidth(width)
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
            <span onClick={e => setBrushColor(actions.TOOLBAR_BRUSH_COLOR_RED)} className={styles.redCircle + " " + (props.brushColor === actions.TOOLBAR_BRUSH_COLOR_RED && props.mode === actions.TOOLBAR_MODE_DRAW ? styles.activeElement : "")} />
            <span onClick={e => setBrushColor(actions.TOOLBAR_BRUSH_COLOR_GREEN)} className={styles.greenCircle + " " + (props.brushColor === actions.TOOLBAR_BRUSH_COLOR_GREEN && props.mode === actions.TOOLBAR_MODE_DRAW ? styles.activeElement : "")} />
            <span onClick={e => setBrushColor(actions.TOOLBAR_BRUSH_COLOR_BLUE)} className={styles.blueCircle + " " + (props.brushColor === actions.TOOLBAR_BRUSH_COLOR_BLUE && props.mode === actions.TOOLBAR_MODE_DRAW ? styles.activeElement : "")} />
        </div>
        <div className={styles.toolbarBlock}>
        - Thickness -<br/>
            <span onClick={e => setBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_LOW)} className={styles.lowWidth + " " + (props.brushWidth === actions.TOOLBAR_BRUSH_WIDTH_LOW && props.mode === actions.TOOLBAR_MODE_DRAW ? styles.activeElement : "")} />
            <span onClick={e => setBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_MIDDLE)} className={styles.mediumWidth + " " + (props.brushWidth === actions.TOOLBAR_BRUSH_WIDTH_MIDDLE && props.mode === actions.TOOLBAR_MODE_DRAW ? styles.activeElement : "")} />
            <span onClick={e => setBrushWidth(actions.TOOLBAR_BRUSH_WIDTH_BIG)} className={styles.bigWidth + " " + (props.brushWidth === actions.TOOLBAR_BRUSH_WIDTH_BIG && props.mode === actions.TOOLBAR_MODE_DRAW ? styles.activeElement : "")} />
        </div>
        <div className={styles.toolbarBlock}>
        - Eraser -<br/>
            <span onClick={e => setEraserWidth(actions.TOOLBAR_ERASER_WIDTH_LOW)} className={styles.eraserCircle + " " + (props.eraserWidth === actions.TOOLBAR_ERASER_WIDTH_LOW && props.mode === actions.TOOLBAR_MODE_ERASE ? styles.activeElement : "")} />
            <span onClick={e => setEraserWidth(actions.TOOLBAR_ERASER_WIDTH_MIDDLE)} className={styles.eraserCircle + " " + (props.eraserWidth === actions.TOOLBAR_ERASER_WIDTH_MIDDLE && props.mode === actions.TOOLBAR_MODE_ERASE ? styles.activeElement : "")} />
            <span onClick={e => setEraserWidth(actions.TOOLBAR_ERASER_WIDTH_BIG)} className={styles.eraserCircle + " " + (props.eraserWidth === actions.TOOLBAR_ERASER_WIDTH_BIG && props.mode === actions.TOOLBAR_MODE_ERASE ? styles.activeElement : "")} />
        </div>
    </div>
    )
}

const mapStateToProps = state => ({
    points: state.board.points,
    brushWidth: state.toolbar.brushWidth,
    brushColor: state.toolbar.brushColor,
    mode: state.toolbar.mode,
    eraserWidth: state.toolbar.eraserWidth
})

const mapDispatchToProps = {
    changeBrushColor,
    changeBrushWidth,
    changeEraserWidth,
    changeMode,
    clearBoard,
    toggleShow,
    changeUrl
}

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
