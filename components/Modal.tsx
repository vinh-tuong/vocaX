import { CSSProperties, useEffect } from 'react';
import styles from '../styles/Modal.module.css'

const Modal = ({ open, onModalClose, style, children }: { open: boolean; style?: CSSProperties | undefined, children: JSX.Element; onModalClose: () => void }) => {
  useEffect(() => {
    if (open) {
      document.body.style.height = '100vh';
      document.body.style.overflowY = 'hidden';
    }

    return () => {
      document.body.style.height = 'auto';
      document.body.style.overflowY = 'auto';
    }
  }, [open]);

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
