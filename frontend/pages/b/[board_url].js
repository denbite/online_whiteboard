import Board from '../../components/Board'
import Toolbar from '../../components/Toolbar'
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useEffect} from 'react'
import { useDispatch } from 'react-redux';
import { initPoints, addPic, clearBoard} from '../../store/board/actions';

export default function SyncBoard() {
    const { board_url } = useRouter().query
    const dispatch = useDispatch()

    if (!board_url) return '';

    fetch('http://192.168.0.100:8000/api/board?' + new URLSearchParams({
      board_url: board_url
    }), {
        method:'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
        }
    })
    .then(r => r.json())
    .then(response => {
      if (response.success){
        dispatch(initPoints(response.data.board_data));
      } else {
        // todo: change window.location on HomePage, show notification that board didn't find and you can draw new
        // set var showNotification in store for notification
        console.log(response.error.message);
        window.location.href = 'http://localhost/';
      }
    })

    const websocket = new WebSocket("ws://192.168.0.100:8001/board");

    websocket.onmessage = function (event) {

        const {action} = JSON.parse(event.data);

        switch (action) {
            case 'clearBoard':
              return dispatch(clearBoard())

            case 'saveLastPic':
              const {pic, brush} = JSON.parse(event.data);

              console.log('received message from server: ', pic);
      
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
        <Toolbar websocket={websocket} />
        <Board websocket={websocket} url={board_url}/>
      </>
    )
}
