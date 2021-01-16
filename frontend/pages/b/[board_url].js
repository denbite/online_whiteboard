import Board from '../../components/Board'
import Toolbar from '../../components/Toolbar'
import {Notification} from '../../components/Notification'
import {Modal} from '../../components/Modal'
import Head from 'next/head';
import {useRouter} from 'next/router';
import { useDispatch } from 'react-redux';
import { initPoints, addPic, clearBoard} from '../../store/board/actions';
import { toggleShow, changeMessage } from '../../store/notification/actions';
import { fetchApi } from '../../helpers/api'

export default function SyncBoard() {
    const router = useRouter()
    const { board_url } = router.query
    const dispatch = useDispatch()

    if (!board_url) return '';

    fetchApi('/board', 'GET', {board_url: board_url}, response => {
          if (response.success){
              dispatch(initPoints(response.data.board_data));
            } else {
              console.log(response.error.message);

              router.push('http://192.168.0.100', undefined, {shallow:true})

              dispatch(changeMessage("Доска не найдена"))
              dispatch(toggleShow())

              setTimeout(() => {
                dispatch(toggleShow())
              }, 1500)
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
        <Notification />
        <Modal />
        <Toolbar websocket={websocket} url={board_url}/>
        <Board websocket={websocket} url={board_url}/>
      </>
    )
}