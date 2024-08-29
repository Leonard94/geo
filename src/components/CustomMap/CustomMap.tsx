import React, { useState } from 'react'
import { Map, YMaps, ZoomControl } from 'react-yandex-maps'
import { PlaceMarkPoint } from '../PlaceMarkPoint/PlaceMarkPoint'
import styles from './styles.module.scss'
import { POINTS } from '../../mocks/points'
import { mapSettings } from './mapSettings'
import { IPoint, EObjectType } from './types'
import { Modal } from '../ui/Modal/Modal'
import { Editor } from './Editor/Editor'
import { Header } from './Header/Header'
import { Sidebar } from './Sidebar/Sidebar'
import { Box, CircularProgress } from '@mui/material'

export const CustomMap: React.FC = () => {
  const apikey = import.meta.env.VITE_YANDEX_API_KEY || ''

  const [points, setPoints] = useState<IPoint[]>(POINTS)
  const [selectedLocation, setSelectedLocation] = useState<IPoint | null>(null)
  const [editingPoint, setEditingPoint] = useState<IPoint | null>(null)
  const [isShowLoading, setIsShowLoading] = useState(true)
  const [isOpenEditPoint, setIsOpenEditPoint] = useState(false)

  const deletePoint = (id: string) => {
    setPoints(points.filter((point) => point.id !== id))
    setSelectedLocation(null)
  }

  const onMapClick = (e: any) => {
    const coords = e.get('coords')

    const newPoint: IPoint = {
      id: Date.now().toString(),
      lat: coords[0],
      lon: coords[1],
      title: 'Новая точка',
      validity: true,
      address: '', // Нужно уметь автоматически устанавливать адресс через геокодер
      comment: '',
      objectType: EObjectType.BPLA,
    }
    setPoints([...points, newPoint])
  }

  const updatePoint = (id: string, lat: number, lon: number) => {
    setPoints(
      points.map((point) => (point.id === id ? { ...point, lat, lon } : point))
    )
  }

  const onEdit = (point: IPoint) => {
    setEditingPoint(point)
    setIsOpenEditPoint(true)
  }

  const handleCloseModal = () => {
    setIsOpenEditPoint(false)
    setEditingPoint(null)
    setSelectedLocation(null)
  }

  const handleOpenNewPointModal = () => {
    setEditingPoint(null)
    setSelectedLocation(null)
    setIsOpenEditPoint(true)
  }

  const onPointsUpdate = (newPoints: IPoint[]) => {
    setPoints(newPoints)
  }

  const onSubmitEditor = (data: any) => {
    if (editingPoint) {
      setPoints(
        points.map((p) => (p.id === editingPoint.id ? { ...p, ...data } : p))
      )
    } else {
      setPoints([...points, { ...data, id: Date.now().toString() }])
    }
    handleCloseModal()
  }

  return (
    <div className={styles.container}>
      <Header onPointsUpdate={onPointsUpdate} />
      <Sidebar
        onEdit={onEdit}
        pointsList={points}
        handleOpenNewPointModal={handleOpenNewPointModal}
      />
      <div className={styles.content}>
        {isShowLoading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <CircularProgress />
          </Box>
        )}
        <YMaps
          query={{ apikey, load: 'package.full' }}
          onLoad={() => {
            setIsShowLoading(false)
          }}
        >
          <Map
            modules={['multiRouter.MultiRoute']}
            defaultState={{ center: [55.75, 37.57], zoom: 9 }}
            onClick={onMapClick}
            width='100%'
            height='100%'
            options={mapSettings.options}
            state={mapSettings.state}
            onLoad={() => {
              setIsShowLoading(false)
            }}
          >
            <PlaceMarkPoint
              locations={points}
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              updatePoint={updatePoint}
              editingPoint={editingPoint}
              setEditingPoint={setEditingPoint}
              deletePoint={deletePoint}
              onEdit={onEdit}
            />
            <ZoomControl options={{ float: 'left' }} />
          </Map>
        </YMaps>
        <Modal
          isOpen={isOpenEditPoint}
          onClose={() => setIsOpenEditPoint(false)}
        >
          <Editor
            onSubmit={onSubmitEditor}
            onClose={handleCloseModal}
            initialData={editingPoint}
          />
        </Modal>
      </div>
    </div>
  )
}
