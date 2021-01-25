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
        if (url){
            copy(url);
        }
    }

    return show ? (
        <div className={styles.modal}>
            <div className={styles.container}>
                <a onClick={hideModal} title="Close" className={styles.modalClose}>Close</a>
                <h1 className={styles.headerText}>Share board</h1>
                <div className={styles.mainText}>
                    This link allows others to edit this board in realtime. Note, you can share this to unlimited number of people.</div>
                <div className={styles.row}>
                    <small className={styles.smallText}>Share: </small>
                    <input className={styles.inputLink} readOnly={true} placeholder={url}></input>
                    <button onClick={copyUrl} className={styles.buttonShare}> Copy link </button>
                </div>
            </div>
        </div>
    ) : null
}
