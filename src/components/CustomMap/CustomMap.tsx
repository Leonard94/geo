import React, { useRef, useState } from 'react'
import { Map, YMaps, ZoomControl } from 'react-yandex-maps'
import { PlaceMarkPoint } from '../PlaceMarkPoint/PlaceMarkPoint'
import { EditPointTitle } from '../EditPointTitle/EditPointTitle'
import styles from './styles.module.scss'

interface Point {
  id: string
  lat: number
  lon: number
  title: string
  address: string
}

const MOCK_POINTS = [
  {
    id: '1724698282956',
    address: 'Кутузовский 32 к 3',
    title: 'Офис',
    lat: 55.74244745216263,
    lon: 37.5308612060531,
  },
]

export const CustomMap: React.FC = () => {
  const mapRef = useRef<any>(null)
  const apikey = (window as any).REACT_APP_YANDEX_API_KEY

  const [points, setPoints] = useState<Point[]>(MOCK_POINTS)
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

  const mapOptions = {
    suppressMapOpenBlock: true, // Убирает кнопку "Открыть в Яндекс.Картах"
  }

  const mapState = {
    center: [55.75, 37.57],
    zoom: 10,
    controls: [], // Убираем все кнопки с карты (слои, пробки и тд)
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
          options={mapOptions}
          state={mapState}
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
