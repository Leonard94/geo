import { EditIcon } from '../../../icons'
import { IPoint } from '../types'
import styles from './styles.module.scss'
import { Button } from '@mui/material'

type TProps = {
  pointsList: IPoint[]
  handleOpenNewPointModal: () => void
  onEdit: (point: IPoint) => void
}

export const Sidebar: React.FC<TProps> = ({
  pointsList,
  handleOpenNewPointModal,
  onEdit,
}) => {
  return <div className='sidebar'></div>
  return (
    <div className='sidebar'>
      <ul className={styles.points_container}>
        {pointsList.length === 0 ? (
          <span>Вы еще не добавили точки</span>
        ) : (
          pointsList.map((point) => (
            <li key={point.id} onClick={() => onEdit(point)}>
              <div>{point.title}</div>
              <div className={styles.icon}>
                <EditIcon />
              </div>
            </li>
          ))
        )}
      </ul>
      <Button
        color='inherit'
        onClick={handleOpenNewPointModal}
        sx={{
          bgcolor: '#1F2326',
        }}
      >
        Добавить точку
      </Button>
    </div>
  )
}
