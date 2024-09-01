import React from 'react'
import { Placemark } from 'react-yandex-maps'
import { EObjectType, IPlaceMarkPointProps, IPoint } from '../CustomMap/types'

const POINT_COLORS = {
  [EObjectType.BPLA]: '#e50000',
  [EObjectType.ROCKET]: '#1f00e5',
  [EObjectType.ObPAO]: '#90ee90',
  default: '#1e98ff',
}

export const PlaceMarkPoint: React.FC<IPlaceMarkPointProps> = ({
  locations,
  setSelectedLocation,
  updatePoint,
  setEditingPoint,
  deletePoint,
  onEdit,
}) => {
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
        `<p>${
          validity ? 'Информация актуальна' : 'Информация не актуальна'
        }</p>`
      )
    }

    content.push(`
      <div class="row">
        <button id="editButton_${id}" class="btn btn_edit">Редактировать</button>
        <button id="deleteButton_${id}" class="btn btn_remove">Удалить</button>
      </div>
    `)

    return `<div>${content.join('')}</div>`
  }

  return (
    <>
      {locations.map((location) => {
        const { id, address, lat, lon } = location

        return (
          <Placemark
            key={id}
            geometry={[lat, lon]}
            onClick={(e: any) => {
              e.originalEvent.domEvent.originalEvent.stopPropagation()
              setSelectedLocation(location)
              setEditingPoint(location)
            }}
            onDragEnd={(e: any) => {
              const newCoords = e.originalEvent.target.geometry.getCoordinates()
              updatePoint(location.id, newCoords[0], newCoords[1])
            }}
            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            options={{
              draggable: true,
              preset: 'islands#circleDotIcon',
              iconColor:
                POINT_COLORS[location.objectType] || POINT_COLORS.default,
            }}
            properties={{
              hintContent: address,
              balloonContentBody: createBalloonContent(location),
            }}
            instanceRef={(ref: any) => {
              if (ref) {
                ref.events.add('balloonopen', () => {
                  const editButton = document.getElementById(`editButton_${id}`)
                  const deleteButton = document.getElementById(
                    `deleteButton_${id}`
                  )
                  if (deleteButton) {
                    deleteButton.addEventListener('click', () => {
                      deletePoint(id)
                      ref.balloon.close()
                    })
                  }
                  if (editButton) {
                    editButton.addEventListener('click', () => {
                      onEdit(location)
                      ref.balloon.close()
                    })
                  }
                })
              }
            }}
          />
        )
      })}
    </>
  )
}
