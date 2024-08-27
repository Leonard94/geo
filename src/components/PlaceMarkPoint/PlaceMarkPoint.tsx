import React from 'react'
import { Placemark } from 'react-yandex-maps'
import { IPlaceMarkPointProps, IPoint } from '../CustomMap/types'

const createBalloonContent = (location: IPoint) => {
  const content = []
  const { id, title, address, comment, objectType, validity } = location

  if (title) {
    content.push(`<b>${title}</b>`)
  }
  if (address) {
    content.push(`<p>Адрес: ${address}</p>`)
  }
  if (comment) {
    content.push(`<p>Комментарий: ${comment}</p>`)
  }
  if (objectType) {
    content.push(`<p>Тип объекта: ${objectType}</p>`)
  }
  if (validity !== undefined) {
    content.push(
      `<p>${validity ? 'Информация актуальна' : 'Информация не актуальна'}</p>`
    )
  }

  content.push(`
    <button id="editButton_${id}">Редактировать</button>
    <button id="deleteButton_${id}">Удалить</button>
  `)

  return `<div>${content.join('')}</div>`
}

export const PlaceMarkPoint: React.FC<IPlaceMarkPointProps> = ({
  locations,
  selectedLocation,
  setSelectedLocation,
  updatePoint,
  setEditingPoint,
  deletePoint,
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
      {locations.map((location) => {
        const { id, address, lat, lon } = location

        return (
          <Placemark
            key={id}
            geometry={[lat, lon]}
            onClick={(e: any) => {
              e.originalEvent.domEvent.originalEvent.stopPropagation()
              setSelectedLocation(location)
              setEditingPoint(id)
            }}
            onDragEnd={(e: any) => {
              const newCoords = e.originalEvent.target.geometry.getCoordinates()
              updatePoint(location.id, newCoords[0], newCoords[1])
            }}
            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            options={{
              draggable: true,
              preset: 'islands#blueDotIcon',
              iconColor:
                selectedLocation && selectedLocation.id === id
                  ? '#33FFCC'
                  : '#1e98ff',
            }}
            properties={{
              hintContent: address,
              balloonContent: createBalloonContent(location),
            }}
          />
        )
      })}
    </>
  )
}
