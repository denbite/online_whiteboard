import styles from '../styles/Modal.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { toggleShow } from '../store/modal/actions'
import copy from 'copy-to-clipboard';

export const Modal = props => {
    const show = useSelector(state => state.modal.show)
    const url = useSelector(state => state.modal.url)

    const dispatch = useDispatch()

    function hideModal(event) {
        dispatch(toggleShow())
    }

    function copyUrl(event){
        copy(url);
    }

    return show ? (
        <div className={styles.modal}>
            <div className={styles.container}>
                <a onClick={hideModal} title="Close" className={styles.modalClose}>Close</a>
                <h1 className={styles.headerText}>Поделиться доской</h1>
                <div className={styles.mainText}>Эта ссылка даёт воможность другим редактировать доску в реальном времени. Вы можете пригласить неограниченное количество людей.</div>
                <div className={styles.row}>
                    <small className={styles.smallText}>Поделиться ссылкой</small>
                    <input className={styles.inputLink} readOnly={true} placeholder={url}></input>
                    <button onClick={copyUrl} className={styles.buttonShare}> Скопировать ссылку </button>
                </div>
            </div>
        </div>
    ) : null
} 