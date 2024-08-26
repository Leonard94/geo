import React, { useState } from 'react'
import { Point } from '../PlaceMarkPoint/PlaceMarkPoint'
import styles from './styles.module.scss'

interface EditPointTitleProps {
  point: Point
  updatePointTitle: (id: string, newTitle: string) => void
  onClose: () => void
}

export const EditPointTitle: React.FC<EditPointTitleProps> = ({
  point,
  updatePointTitle,
  onClose,
}) => {
  const [newTitle, setNewTitle] = useState(point.title)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updatePointTitle(point.id, newTitle)
    onClose()
  }

  return (
    <div className={styles.title}>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder='Введите новое название'
        />
        <button type='submit'>Сохранить</button>
        <button type='button' onClick={onClose}>
          Отмена
        </button>
      </form>
    </div>
  )
}
