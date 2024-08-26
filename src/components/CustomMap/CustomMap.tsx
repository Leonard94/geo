import React, { useState } from 'react'
import { Map, YMaps, ZoomControl } from 'react-yandex-maps'
import { PlaceMarkPoint, Point } from '../PlaceMarkPoint/PlaceMarkPoint'
import { EditPointTitle } from '../EditPointTitle/EditPointTitle'
import styles from './styles.module.scss'
import { POINTS } from '../../mocks/points'
import { mapSettings } from './mapSettings'

export const CustomMap: React.FC = () => {
  const apikey = import.meta.env.VITE_YANDEX_API_KEY || ''

  const [points, setPoints] = useState<Point[]>(POINTS)
  const [selectedLocation, setSelectedLocation] = useState<Point | null>(null)
  const [editingPoint, setEditingPoint] = useState<string | null>(null)
  const [isShowLoading, setIsShowLoading] = useState(true)

  const onMapClick = (e: any) => {
    const coords = e.get('coords')
    const newPoint: Point = {
      id: Date.now().toString(),
      lat: coords[0],
      lon: coords[1],
      title: 'Новая точка',
      address: 'Адрес будет здесь', // Нужно уметь автоматически устанавливать адресс через геокодер
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

  return (
    <div>
      {isShowLoading && <div className={styles.loader}>Loading...</div>}
      <YMaps query={{ apikey, load: 'package.full' }}>
        <Map
          modules={['multiRouter.MultiRoute']}
          defaultState={{ center: [55.75, 37.57], zoom: 9 }}
          onClick={onMapClick}
          width='100%'
          height={536}
          options={mapSettings.options}
          state={mapSettings.state}
          onLoad={() => setIsShowLoading(false)}
        >
          <PlaceMarkPoint
            locations={points}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            updatePoint={updatePoint}
            editingPoint={editingPoint}
            setEditingPoint={setEditingPoint}
            updatePointTitle={updatePointTitle}
          />
          <ZoomControl options={{ float: 'left' }} />
        </Map>
      </YMaps>
      {editingPoint && (
        <EditPointTitle
          point={points.find((p) => p.id === editingPoint)!}
          updatePointTitle={updatePointTitle}
          onClose={() => setEditingPoint(null)}
        />
      )}
    </div>
  )
}
