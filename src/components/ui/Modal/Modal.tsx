import React from 'react'

import { Portal } from './Portal'

import styles from './styles.module.scss'

type TProps = {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

export const Modal: React.FC<TProps> = ({ children, onClose, isOpen }) => {
  if (!isOpen) {
    return null
  }

  return (
    <Portal>
      <div className={styles.popup}>
        <div className={styles.overlay} onClick={onClose} />
        <div className={styles.content}>{children}</div>
      </div>
    </Portal>
  )
}