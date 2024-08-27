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
      {/* {locations.map((item, index) => (
        <Placemark
          key={index}
          geometry={[item.lat, item.lon]}
          modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
          options={{
            draggable: false,
            fillColor: 'orange',
            strokeColor: 'black',
            strokeOpacity: 1,
            strokeWidth: 16,
            preset: 'islands#circleIcon',
            iconColor: 'purple',
          }}
          properties={{
            hintContent: item.title,
            iconContent: index,
          }}
        />
      ))} */}
      {locations.map((item) => {
        const { title, address, comment, validity } = item
        const content = `
          ${title ? `<b>${title}</b><br/>` : ''}
          ${address ? `${address}<br/>` : ''}
          ${comment ? `${comment}<br/>` : ''}
          ${validity ? `${validity ? 'Информация актуальна' : 'Информация не актуальна'}<br/>` : ''}
        `.trim()

        const finalContent = content.endsWith('<br/>') ? content.slice(0, -5) : content;

        return (
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
              balloonContent: finalContent,
            }}
          />
        )
      })}
    </>
  )
}
