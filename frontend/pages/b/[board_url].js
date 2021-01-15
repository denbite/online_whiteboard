import Board from '../../components/Board'
import Toolbar from '../../components/Toolbar'
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { initPoints, addPic, clearBoard} from '../../store/board/actions';
import { fetchApi } from '../../helpers/api'

export default function SyncBoard() {
    const { board_url } = useRouter().query
    const dispatch = useDispatch()

    if (!board_url) return '';

    fetchApi('/board', 'GET', {board_url: board_url}, response => {
          if (response.success){
              dispatch(initPoints(response.data.board_data));
            } else {
              // todo: change window.location on HomePage, show notification that board didn't find and you can draw new
              // set var showNotification in store for notification
              console.log(response.error.message);
              window.location.href = 'http://localhost/';
          }
        }
      )

    const websocket = new WebSocket("ws://192.168.0.100:8001/board/" + board_url);

    websocket.onmessage = function (event) {

        const {action} = JSON.parse(event.data);

        switch (action) {
            case 'clearBoard':
              return dispatch(clearBoard())

            case 'saveLastPic':
              const {pic, brush} = JSON.parse(event.data);
      
              return dispatch(addPic(pic, brush))
            
            default:
              return console.log('no one action is correct')
        }

    };

    return (
      <>
      <Head>
          <title>Online Whiteboard</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Toolbar websocket={websocket} url={board_url}/>
        <Board websocket={websocket} url={board_url}/>
      </>
    )
}
