import React, { useState } from 'react'
import { Map, Polygon, YMaps, ZoomControl } from 'react-yandex-maps'
import { PlaceMarkPoint } from '../PlaceMarkPoint/PlaceMarkPoint'
import { EditPointTitle } from '../EditPointTitle/EditPointTitle'
import styles from './styles.module.scss'
import { POINTS } from '../../mocks/points'
import { mapSettings } from './mapSettings'
import { IPolygon, IPoint, EDrawingMode, EObjectType } from './types'
import { DrawPolygon } from '../DrawPolygon/DrawPolygon'
import { Modal } from '../ui/Modal/Modal'
import { Editor } from './Editor/Editor'

export const CustomMap: React.FC = () => {
  const apikey = import.meta.env.VITE_YANDEX_API_KEY || ''
  const [ymaps, setYmaps] = useState<any>(null)
  const [map, setMap] = useState<any>(null)

  const [points, setPoints] = useState<IPoint[]>(POINTS)
  const [polygons, setPolygons] = useState<IPolygon[]>([])
  const [selectedLocation, setSelectedLocation] = useState<IPoint | null>(null)
  const [editingPoint, setEditingPoint] = useState<string | null>(null)
  const [isShowLoading, setIsShowLoading] = useState(true)
  const [isOpenEditPoint, setIsOpenEditPoint] = useState(false)
  const [drawingMode, setDrawingMode] = useState<EDrawingMode>(
    EDrawingMode.POINT
  )

  const deletePoint = (id: string) => {
    setPoints(points.filter((point) => point.id !== id))
    setSelectedLocation(null)
  }

  const onMapClick = (e: any) => {
    if (drawingMode === 'polygon') {
      return
    }

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

  const updatePointTitle = (id: string, newTitle: string) => {
    setPoints(
      points.map((point) =>
        point.id === id ? { ...point, title: newTitle } : point
      )
    )
    setEditingPoint(null)
  }

  const handlePolygonComplete = (coordinates: number[][]) => {
    const newPolygon: IPolygon = {
      id: Date.now().toString(),
      coordinates: coordinates,
    }
    setPolygons([...polygons, newPolygon])
    setDrawingMode(EDrawingMode.POINT) // Возвращаемся в режим точек после завершения рисования полигона
  }

  return (
    <div>
      {isShowLoading && <div className={styles.loader}>Loading...</div>}
      <div>
        <button onClick={() => setDrawingMode(EDrawingMode.POINT)}>
          Ставить точки
        </button>
        <button
          onClick={() => setDrawingMode(EDrawingMode.POLYGON)}
          style={{
            background: `${
              drawingMode === EDrawingMode.POLYGON ? 'red' : 'green'
            }`,
          }}
        >
          Рисовать полигон
        </button>
        <button onClick={() => setIsOpenEditPoint(true)}>Добавить точку</button>
      </div>
      <YMaps
        query={{ apikey, load: 'package.full' }}
        onLoad={(ymapsInstance: any) => {
          setYmaps(ymapsInstance)
          setIsShowLoading(false)
        }}
      >
        <Map
          modules={['multiRouter.MultiRoute']}
          defaultState={{ center: [55.75, 37.57], zoom: 9 }}
          onClick={onMapClick}
          width='100%'
          height={536}
          options={mapSettings.options}
          state={mapSettings.state}
          onLoad={(mapInstance) => {
            setMap(mapInstance)
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
            updatePointTitle={updatePointTitle}
            deletePoint={deletePoint}
          />
          {drawingMode === 'polygon' && (
            <DrawPolygon
              ymaps={ymaps}
              map={map}
              onPolygonComplete={handlePolygonComplete}
              drawingMode={drawingMode}
            />
          )}
          {polygons.map((polygon) => (
            <Polygon
              key={polygon.id}
              geometry={[polygon.coordinates]}
              options={{
                fillColor: '#00FF00',
                strokeColor: '#0000FF',
                opacity: 0.5,
                strokeWidth: 3,
              }}
            />
          ))}
          <ZoomControl options={{ float: 'left' }} />
        </Map>
      </YMaps>
      {/* {editingPoint && (
        <EditPointTitle
          point={points.find((p) => p.id === editingPoint)!}
          updatePointTitle={updatePointTitle}
          onClose={() => setEditingPoint(null)}
        />
      )} */}
      <Modal isOpen={isOpenEditPoint} onClose={() => setIsOpenEditPoint(false)}>
        <Editor
          onSubmit={(data) => {
            setIsOpenEditPoint(false)
            setPoints([...points, { ...data, id: Date.now().toString() }])
          }}
          onClose={() => setIsOpenEditPoint(false)}
        />
      </Modal>
    </div>
  )
}
