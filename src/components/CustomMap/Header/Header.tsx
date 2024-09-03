import { ExcelDownloader } from '../../ExcelDownloader/ExcelDownloader'
import { ExcelUploader } from '../../ExcelUploader/ExcelUploader'
import { IPoint } from '../types'
import { Switch, FormControlLabel } from '@mui/material'

type TProps = {
  onPointsUpdate: (newPoints: IPoint[]) => void
  onTogglePointMode: () => void
  pointsList: IPoint[]
  isPointModeActive: boolean
}

export const Header: React.FC<TProps> = ({
  onPointsUpdate,
  onTogglePointMode,
  pointsList,
  isPointModeActive,
}) => {
  return (
    <header className='header'>
      <div>
        <FormControlLabel
          control={
            <Switch
              checked={isPointModeActive}
              onChange={onTogglePointMode}
              color='primary'
            />
          }
          label='Режим нанесения точек'
        />
      </div>
      {pointsList.length === 0 ? null : (
        <ExcelDownloader pointsList={pointsList} />
      )}
      <ExcelUploader onPointsUpdate={onPointsUpdate} />
    </header>
  )
}
