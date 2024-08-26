import React, { useRef, useState } from 'react'
import { Map, YMaps, ZoomControl } from 'react-yandex-maps'
import { PlaceMarkPoint } from '../PlaceMarkPoint/PlaceMarkPoint'
import { EditPointTitle } from '../EditPointTitle/EditPointTitle'

interface Point {
  id: string
  lat: number
  lon: number
  title: string
  address: string
}

export const App: React.FC = () => {
  const apikey = '47ef0390-da12-4513-b2f7-12ef96644b49'
  const mapRef = useRef<any>(null)

  const [points, setPoints] = useState<Point[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Point | null>(null)
  const [editingPoint, setEditingPoint] = useState<string | null>(null)

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
      <h1>Hello</h1>
      <YMaps query={{ apikey, load: 'package.full' }}>
        <Map
          modules={['multiRouter.MultiRoute']}
          defaultState={{ center: [55.75, 37.57], zoom: 9 }}
          onClick={onMapClick}
          width='100%'
          height={536}
          options={mapOptions}
          state={mapState}
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
