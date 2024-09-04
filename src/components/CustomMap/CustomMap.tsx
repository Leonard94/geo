import React, { useRef, useState } from 'react'
import { Map, YMaps, ZoomControl, ObjectManager } from 'react-yandex-maps'
import styles from './styles.module.scss'
import { mapSettings } from './mapSettings'
import { IPoint, EObjectType } from './types'
import { Modal } from '../ui/Modal/Modal'
import { Editor } from './Editor/Editor'
import { Header } from './Header/Header'
import { Sidebar } from './Sidebar/Sidebar'
import { Box, CircularProgress } from '@mui/material'

export const CustomMap: React.FC = () => {
  const apikey = import.meta.env.VITE_YANDEX_API_KEY || ''

  const [points, setPoints] = useState<IPoint[]>([])
  const [isFilteredMode, setIsFilteredMode] = useState(false)
  const [filteredPoints, setFilteredPoints] = useState<IPoint[]>([])
  const [editingPoint, setEditingPoint] = useState<IPoint | null>(null)
  const [isShowLoading, setIsShowLoading] = useState(true)
  const [isOpenEditPoint, setIsOpenEditPoint] = useState(false)
  const [isPointModeActive, setIsPointModeActive] = useState(false)

  const objectManagerRef = useRef<any>(null)

  const onMapClick = (e: any) => {
    if (!isPointModeActive) {
      return
    }

    const coords = e.get('coords')

    const newPoint: IPoint = {
      id: Date.now().toString(),
      title: 'Новая точка',
      validity: true,
      address: '',
      comment: '',
      objectType: EObjectType.BPLA,
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [coords[0], coords[1]],
      },
      properties: {
        balloonContentHeader: 'Новая точка',
        balloonContentBody: 'Адрес: не указан<br>Комментарий: не указан',
        balloonContentFooter: '',
        clusterCaption: 'Новая точка',
      },
    }
    setPoints([...points, newPoint])
  }

  const onEdit = (point: IPoint) => {
    setEditingPoint(point)
    setIsOpenEditPoint(true)
  }

  const handleCloseModal = () => {
    setIsOpenEditPoint(false)
    setEditingPoint(null)
  }

  const handleOpenNewPointModal = () => {
    setEditingPoint(null)
    setIsOpenEditPoint(true)
  }

  const onPointsUpdate = (newPoints: IPoint[]) => {
    setPoints(newPoints)
  }

  const onDelete = (pointId: string) => {
    setPoints((prevPoints) =>
      prevPoints.filter((point) => point.id !== pointId)
    )
    setFilteredPoints((prevFilteredPoints) =>
      prevFilteredPoints.filter((point) => point.id !== pointId)
    )
  }

  const handleBalloonEvent = (e: any) => {
    const target = e.target as HTMLElement
    if (!target || !target.id) return

    const [action, id] = target.id.split('_')
    const point = points.find((p) => p.id === id)

    if (!point) return

    if (action === 'editButton') {
      onEdit(point)
    } else if (action === 'deleteButton') {
      onDelete(point.id)
    }

    objectManagerRef.current?.objects.balloon.close()
  }

  const onSubmitEditor = (data: any) => {
    if (editingPoint) {
      setPoints(
        points.map((item) => {
          if (item.id === editingPoint.id) {
            return {
              ...item,
              ...data,
              properties: {
                ...item.properties,
                balloonContentHeader: data.title,
                balloonContentBody: `Адрес: ${data.address}<br>Комментарий: ${data.comment}`,
              },
            }
          }
          return item
        })
      )
    } else {
      const newPoint = {
        ...data,
        id: Date.now().toString(),
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            data.geometry.coordinates[0],
            data.geometry.coordinates[1],
          ],
        },
        properties: {
          balloonContentHeader: data.title,
          balloonContentBody: `Адрес: ${data.address}<br>Комментарий: ${data.comment}`,
          // balloonContentFooter:
          //   '<button onclick="editPoint()">Редактировать</button>',
          clusterCaption: data.title,
        },
      }
      setPoints([...points, newPoint])
    }
    handleCloseModal()
  }

  const displayedPoints = isFilteredMode ? filteredPoints : points

  return (
    <div className={styles.container}>
      <Header onPointsUpdate={onPointsUpdate} pointsList={displayedPoints} />
      <Sidebar
        onEdit={onEdit}
        pointsList={points}
        setPoints={setPoints}
        isFilteredMode={isFilteredMode}
        setFilteredPoints={setFilteredPoints}
        handleOpenNewPointModal={handleOpenNewPointModal}
        setIsFilteredMode={setIsFilteredMode}
        onTogglePointMode={() => setIsPointModeActive(!isPointModeActive)}
        isPointModeActive={isPointModeActive}
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
            <ObjectManager
              options={{
                clusterize: true,
                gridSize: 32,
                clusterDisableClickZoom: true,
              }}
              objects={{
                openBalloonOnClick: true,
                preset: 'islands#greenDotIcon',
              }}
              clusters={{
                preset: 'islands#redClusterIcons',
              }}
              features={displayedPoints}
              modules={[
                'objectManager.addon.objectsBalloon',
                'objectManager.addon.objectsHint',
              ]}
              instanceRef={(ref: any) => {
                if (ref) {
                  objectManagerRef.current = ref
                  ref.objects.options.set('preset', 'islands#greenDotIcon')
                  ref.objects.events.add('click', (e: any) => {
                    const objectId = e.get('objectId')
                    const point = points.find((p) => p.id === objectId)
                    if (point) {
                      // Дополнительные действия при клике на точку, если необходимо
                    }
                  })
                  ref.events.add('balloonopen', () => {
                    document.addEventListener('click', handleBalloonEvent)
                  })
                  ref.events.add('balloonclose', () => {
                    document.removeEventListener('click', handleBalloonEvent)
                  })
                }
              }}
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
