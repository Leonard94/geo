import React from 'react'
import { Placemark } from 'react-yandex-maps'
import { IPlaceMarkPointProps } from '../CustomMap/types'

export const PlaceMarkPoint: React.FC<IPlaceMarkPointProps> = ({
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
