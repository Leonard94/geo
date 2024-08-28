import React, { useState } from 'react'
import * as XLSX from 'exceljs'
import { EObjectType } from '../CustomMap/types'

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
          validity: row.getCell(5).value === true,
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
      <label
        htmlFor='excel-file-input'
        style={{
          cursor: 'pointer',
          padding: '10px',
          backgroundColor: '#f0f0f0',
          borderRadius: '5px',
        }}
      >
        Выберите Excel файл
      </label>
      {fileName && <p>Выбранный файл: {fileName}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
