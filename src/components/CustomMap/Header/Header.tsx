import { ExcelDownloader } from '../../ExcelDownloader/ExcelDownloader'
import { ExcelUploader } from '../../ExcelUploader/ExcelUploader'
import { IPoint } from '../types'

type TProps = {
  onPointsUpdate: (newPoints: IPoint[]) => void
  pointsList: IPoint[]
}

export const Header: React.FC<TProps> = ({
  onPointsUpdate,
  pointsList,
}) => {
  return (
    <header className='header'>
      <div>
        {/* Контент */}
      </div>
      {pointsList.length === 0 ? null : (
        <ExcelDownloader pointsList={pointsList} />
      )}
      <ExcelUploader onPointsUpdate={onPointsUpdate} />
    </header>
  )
}
