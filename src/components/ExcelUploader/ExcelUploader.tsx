import React, { useState } from 'react'
import * as XLSX from 'exceljs'
import { EObjectType } from '../CustomMap/types'
import { Button } from '@mui/material'

interface Point {
  id: string
  title: string
  address: string
  comment: string
  validity: boolean
  objectType: EObjectType
  lat: number
  lon: number
}

interface ExcelUploaderProps {
  onPointsUpdate: (points: Point[]) => void
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  onPointsUpdate,
}) => {
  const [fileName, setFileName] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) {
      setError('Файл не выбран')
      return
    }

    setFileName(file.name)
    setError('')

    try {
      const workbook = new XLSX.Workbook()
      await workbook.xlsx.load(await file.arrayBuffer())

      const worksheet = workbook.getWorksheet(1)
      if (!worksheet) {
        setError('Лист не найден в файле Excel')
        return
      }

      const newPoints: Point[] = []

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber === 1) {
          return
        }

        const point: Point = {
          id: row.getCell(1).value?.toString() || '',
          title: row.getCell(2).value?.toString() || '',
          address: row.getCell(3).value?.toString() || '',
          comment: row.getCell(4).value?.toString() || '',
          validity: ['да', 'Да', 'ДА'].includes(String(row.getCell(5).value)),
          objectType: row.getCell(6).value?.toString() as EObjectType,
          lat: Number(row.getCell(7).value) || 0,
          lon: Number(row.getCell(8).value) || 0,
        }

        newPoints.push(point)
      })

      onPointsUpdate(newPoints)
      setError('')
    } catch (err) {
      setError('Ошибка при обработке файла: ' + (err as Error).message)
    }
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
