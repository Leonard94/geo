import { useEffect } from 'react'
import { IPoint } from '../types'
import { Button } from '@mui/material'
import { Switch, FormControlLabel } from '@mui/material'
import styles from './styles.module.scss'

type TProps = {
  pointsList: IPoint[]
  isPointModeActive: boolean
  isFilteredMode: boolean
  handleOpenNewPointModal: () => void
  onEdit: (point: IPoint) => void
  setPoints: (points: IPoint[]) => void
  setFilteredPoints: (filteredPoints: IPoint[]) => void
  setIsFilteredMode: (newCondition: boolean) => void
  onTogglePointMode: () => void
}

export const Sidebar: React.FC<TProps> = ({
  pointsList,
  handleOpenNewPointModal,
  onTogglePointMode,
  isPointModeActive,
  isFilteredMode,
  setFilteredPoints,
  setIsFilteredMode,
}) => {
  const handleToggleFilter = () => {
    if (isFilteredMode) {
      setFilteredPoints([])
      setIsFilteredMode(false)
      return
    }
    setIsFilteredMode(true)
    const onlyValidPoints = pointsList.filter((item) => item.validity)
    setFilteredPoints(onlyValidPoints)
  }

  useEffect(() => {
    if (isFilteredMode) {
      const onlyValidPoints = pointsList.filter((item) => item.validity)
      setFilteredPoints(onlyValidPoints)
    }
  }, [pointsList])

  return (
    <div className='sidebar'>
      <div className={styles.container}>
        <FormControlLabel
          control={
            <Switch
              checked={isPointModeActive}
              onChange={onTogglePointMode}
              color='primary'
            />
          }
          label='Режим нанесения точек'
          classes={{ label: styles.label }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={isFilteredMode}
              onChange={handleToggleFilter}
              color='primary'
            />
          }
          label='Оставить только актуальные'
          classes={{ label: styles.label }}
        />
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
    </div>
  )
}
