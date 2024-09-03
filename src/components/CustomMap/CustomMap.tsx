import React, { useState } from 'react'
import { Map, YMaps, ZoomControl, ObjectManager } from 'react-yandex-maps'
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

  const [points, setPoints] = useState<any[]>(POINTS)
  const [editingPoint, setEditingPoint] = useState<IPoint | null>(null)
  const [isShowLoading, setIsShowLoading] = useState(true)
  const [isOpenEditPoint, setIsOpenEditPoint] = useState(false)
  const [isPointModeActive, setIsPointModeActive] = useState(false)

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
        // balloonContentFooter:
        //   '<button onclick="onEdit()">Редактировать</button>',
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

  const onSubmitEditor = (data: any) => {
    if (editingPoint) {
      setPoints(
        points.map((p) => {
          if (p.id === editingPoint.id) {
            return {
              ...p,
              ...data,
              properties: {
                ...p.properties,
                balloonContentHeader: data.title,
                balloonContentBody: `Адрес: ${data.address}<br>Комментарий: ${data.comment}`,
              },
            }
          }
          return p
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

  return (
    <div className={styles.container}>
      <Header
        onPointsUpdate={onPointsUpdate}
        pointsList={points}
        isPointModeActive={isPointModeActive}
        onTogglePointMode={() => setIsPointModeActive(!isPointModeActive)}
      />
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
              features={points}
              modules={[
                'objectManager.addon.objectsBalloon',
                'objectManager.addon.objectsHint',
              ]}
              instanceRef={(ref: any) => {
                if (ref) {
                  ref.objects.options.set('preset', 'islands#greenDotIcon')
                  ref.objects.events.add('click', (e: any) => {
                    const objectId = e.get('objectId')
                    const point = points.find((p) => p.id === objectId)
                    if (point) {
                      // setSelectedLocation(point)
                    }
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
