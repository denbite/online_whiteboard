import styles from '../styles/Notification.module.css';
import { useSelector } from 'react-redux';

export const Notification = props => {
    const show = useSelector(state => state.notification.show)
    const message = useSelector(state => state.notification.message)

    return show ? (
        <div className={styles.error}>
            <i className={styles.icon}>&#9747;</i> {message}
        </div>
    ) : null
} 