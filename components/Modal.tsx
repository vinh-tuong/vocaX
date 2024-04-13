import { CSSProperties, useEffect } from 'react';
import styles from '../styles/Modal.module.css'
import { mobileCheck } from '@/utils/helpers';

const Modal = ({ open, onModalClose, style, isSlideshow, children }: { open: boolean; style?: CSSProperties | undefined, isSlideshow?: boolean, children: JSX.Element; onModalClose: () => void }) => {
  useEffect(() => {
    if (open && mobileCheck() && isSlideshow) {
      document.body.style.position = 'fixed';
    }

    return () => {
      if (mobileCheck() && isSlideshow) {
        document.body.style.position = 'unset';
      }
    }
  }, [open, isSlideshow]);

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
