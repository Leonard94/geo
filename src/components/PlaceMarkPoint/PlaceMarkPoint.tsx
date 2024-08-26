import React from 'react'
import { Placemark } from 'react-yandex-maps'

export interface Point {
  id: string
  lat: number
  lon: number
  title: string
  address: string
}

interface PlaceMarkPointProps {
  locations: Point[]
  selectedLocation: Point | null
  setSelectedLocation: (location: Point | null) => void
  updatePoint: (id: string, lat: number, lon: number) => void
  editingPoint: string | null
  setEditingPoint: (id: string | null) => void
  updatePointTitle: (id: string, newTitle: string) => void
}

interface PlaceMarkPointProps {
  locations: Point[]
  selectedLocation: Point | null
  setSelectedLocation: (location: Point | null) => void
  updatePoint: (id: string, lat: number, lon: number) => void
  setEditingPoint: (id: string | null) => void
}

export const PlaceMarkPoint: React.FC<PlaceMarkPointProps> = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  updatePoint,
  setEditingPoint,
}) => {
  return (
    <>
      {locations.map((item) => (
        <Placemark
          key={item.id}
          geometry={[item.lat, item.lon]}
          onClick={(e: any) => {
            e.originalEvent.domEvent.originalEvent.stopPropagation()
            setSelectedLocation(item)
            setEditingPoint(item.id)
          }}
          onDragEnd={(e: any) => {
            const newCoords = e.originalEvent.target.geometry.getCoordinates()
            updatePoint(item.id, newCoords[0], newCoords[1])
          }}
          modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
          options={{
            draggable: true,
            preset: 'islands#blueDotIcon',
            iconColor:
              selectedLocation && selectedLocation.id === item.id
                ? '#33FFCC'
                : '#1e98ff',
          }}
          properties={{
            hintContent: item.address,
            balloonContent: `<b>${item.title}</b> <br/> ${item.address}`,
          }}
        />
      ))}
    </>
  )
}
