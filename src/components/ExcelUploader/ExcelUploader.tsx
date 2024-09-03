import React, { useState } from 'react'
import * as XLSX from 'exceljs'
import { EObjectType, IPoint } from '../CustomMap/types'
import { Button } from '@mui/material'


interface ExcelUploaderProps {
  onPointsUpdate: (points: IPoint[]) => void
}

const createBalloonContent = (point: IPoint) => {
  const content = []
  const { title, address, comment, objectType, validity } = point

  if (title) {
    content.push(`<b>${title}</b>`)
  }
  if (address) {
    content.push(`<p>Адрес: ${address}</p>`)
  }
  if (comment) {
    content.push(`<p>Комментарий: ${comment}</p>`)
  }
  if (objectType) {
    content.push(`<p>Тип объекта: ${objectType}</p>`)
  }
  if (validity !== undefined) {
    content.push(
      `<p>${validity ? 'Информация актуальна' : 'Информация не актуальна'}</p>`
    )
  }

  // content.push(`
  //   <div class="row">
  //     <button id="editButton_${id}" class="btn btn_edit">Редактировать</button>
  //     <button id="deleteButton_${id}" class="btn btn_remove">Удалить</button>
  //   </div>
  // `)

  return `<div>${content.join('')}</div>`
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onPointsUpdate,
}) => {
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      setError('Файл не выбран')
      return
    }

    setFileName(file.name)
    setIsLoading(true)
    setError('')

    try {
      const workbook = new XLSX.Workbook()
      await workbook.xlsx.load(await file.arrayBuffer())

      const worksheet = workbook.getWorksheet(1)
      if (!worksheet) {
        setError('Лист не найден в файле Excel')
        return
      }

      const newPoints: IPoint[] = []

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) {
          return
        }

        const point: IPoint = {
          id: row.getCell(1).value?.toString() || '',
          title: row.getCell(2).value?.toString() || '',
          address: row.getCell(3).value?.toString() || '',
          comment: row.getCell(4).value?.toString() || '',
          validity: ['да', 'Да', 'ДА'].includes(String(row.getCell(5).value)),
          objectType: row.getCell(6).value?.toString() as EObjectType,
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [
              Number(row.getCell(7).value) || 0,
              Number(row.getCell(8).value) || 0,
            ],
          },
          properties: {
            balloonContent: 'Temporarily unavailable',
            clusterCaption: 'Temporarily unavailable',
          },
        }
        point.properties.balloonContent = createBalloonContent(point)
        point.properties.clusterCaption = point.title

        newPoints.push(point)
      })

      onPointsUpdate(newPoints)
      setError('')
    } catch (err) {
      setError('Ошибка при обработке файла: ' + (err as Error).message)
    } finally {
      setIsLoading(false)
      console.timeEnd('handleFileUpload')
    }
  }

  if (isLoading) {
    return <div>Загрузка...</div>
  }

  return (
    <div>
      <input
        type='file'
        accept='.xlsx'
        onChange={handleFileUpload}
        style={{ display: 'none' }}
        id='excel-file-input'
      />
      <label htmlFor='excel-file-input'>
        <Button variant='contained' component='span'>
          {fileName ? (
            <p>Выбранный файл: {fileName}</p>
          ) : (
            <p>Выберите Excel файл</p>
          )}
        </Button>
      </label>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
