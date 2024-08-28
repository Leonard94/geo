import { Button } from '@mui/material'
import { EDrawingMode, IPoint } from '../types'
import { ExcelUploader } from '../../ExcelUploader/ExcelUploader'

type TProps = {
  drawingMode: EDrawingMode
  setDrawingMode: (modeType: EDrawingMode) => void
  onPointsUpdate: (newPoints: IPoint[]) => void
}

export const Header: React.FC<TProps> = ({
  setDrawingMode,
  drawingMode,
  onPointsUpdate,
}) => {
  return (
    <header className='header'>
      <div>
        <Button
          color='inherit'
          onClick={() => setDrawingMode(EDrawingMode.POINT)}
          sx={{
            bgcolor: drawingMode === EDrawingMode.POINT ? '#1F2326' : 'inherit',
          }}
        >
          Ставить точки
        </Button>
        <Button
          color='inherit'
          onClick={() => setDrawingMode(EDrawingMode.POLYGON)}
          sx={{
            bgcolor:
              drawingMode === EDrawingMode.POLYGON ? '#1F2326' : 'inherit',
          }}
        >
          Рисовать полигон
        </Button>
      </div>
      <ExcelUploader onPointsUpdate={onPointsUpdate} />
    </header>
  )
}
