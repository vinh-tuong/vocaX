import { CSSProperties, useEffect } from 'react';
import styles from '../styles/Modal.module.css'
import { mobileCheck } from '@/utils/helpers';

const Modal = ({ open, onModalClose, style, children }: { open: boolean; style?: CSSProperties | undefined, children: JSX.Element; onModalClose: () => void }) => {
  useEffect(() => {
    if (open && mobileCheck()) {
      document.body.style.position = 'fixed';
    }

    return () => {
      document.body.style.position = '';
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
