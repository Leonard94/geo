import { ExcelUploader } from '../../ExcelUploader/ExcelUploader'
import { IPoint } from '../types'

type TProps = {
  onPointsUpdate: (newPoints: IPoint[]) => void
}

export const Header: React.FC<TProps> = ({ onPointsUpdate }) => {
  return (
    <header className='header'>
      <div>{/* header content */}</div>
      <ExcelUploader onPointsUpdate={onPointsUpdate} />
    </header>
  )
}
