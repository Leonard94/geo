import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { IPoint } from '../CustomMap/types'
import Button from '@mui/material/Button'

interface IProps {
  pointsList: IPoint[]
}

const getFormattedDate = () => {
  const now = new Date()

  const day = String(now.getDate()).padStart(2, '0')
  const month = String(now.getMonth() + 1).padStart(2, '0') // Месяцы начинаются с 0
  const year = String(now.getFullYear()).slice(-2) // Последние 2 цифры года
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}.${minutes}`
}

export const ExcelDownloader: React.FC<IProps> = ({ pointsList }) => {
  const generateExcel = async () => {
    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet('My Sheet')

    worksheet.columns = [
      { header: 'Номер', key: 'id', width: 15 },
      { header: 'Название', key: 'title', width: 25 },
      { header: 'Адрес', key: 'address', width: 25 },
      { header: 'Комментарии', key: 'comment', width: 25 },
      { header: 'Актуально', key: 'validity', width: 25 },
      { header: 'Тип', key: 'objectType', width: 25 },
      { header: 'lan', key: 'lan', width: 25 },
      { header: 'lon', key: 'lon', width: 25 },
    ]

    const data = pointsList.map((point) => ({
      id: point.id,
      title: point.title,
      address: point.address,
      comment: point.comment,
      validity: point.validity ? 'Да' : 'Нет',
      objectType: point.objectType,
      lan: point.geometry.coordinates[1],
      lon: point.geometry.coordinates[0],
    }))

    data.forEach((item) => {
      worksheet.addRow(item)
    })

    const buffer = await workbook.xlsx.writeBuffer()

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    saveAs(blob, `${getFormattedDate()}.xlsx`)
  }
  return (
    <Button variant='outlined' onClick={generateExcel}>
      Сохранить в excel
    </Button>
  )
}
