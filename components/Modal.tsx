import { CSSProperties } from 'react';
import styles from '../styles/Modal.module.css'

const Modal = ({ open, onModalClose, style, children }: { open: boolean; style?: CSSProperties | undefined, children: JSX.Element; onModalClose: () => void }) => {
  return (
    <div className={`${styles.modalContainer} ${open ? styles.show : ''}`}>
      <div className={styles.overlay} onClick={onModalClose}></div>
      <div className={styles.modal} style={style}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
