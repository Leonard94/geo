import React, { useEffect, useRef, useCallback } from 'react'
import { EDrawingMode } from '../CustomMap/types'

interface DrawPolygonProps {
  ymaps: any
  map: any
  onPolygonComplete: (coordinates: number[][]) => void
  drawingMode: EDrawingMode
}

export const DrawPolygon: React.FC<DrawPolygonProps> = ({
  ymaps,
  map,
  onPolygonComplete,
  drawingMode,
}) => {
  const polygonRef = useRef<any>(null)
  const coordinatesRef = useRef<number[][]>([])

  const onClick = useCallback(
    (e: any) => {
      console.log('eeeee')
      const coords = e.get('coords')
      coordinatesRef.current.push(coords)

      if (!polygonRef.current) {
        polygonRef.current = new ymaps.Polygon(
          [coordinatesRef.current],
          {},
          {
            editorDrawingCursor: 'crosshair',
            fillColor: '#00FF0088',
            strokeColor: '#0000FF',
            strokeWidth: 3,
          }
        )
        map.geoObjects.add(polygonRef.current)
      } else {
        polygonRef.current.geometry.setCoordinates([coordinatesRef.current])
      }
    },
    [ymaps, map]
  )

  const onDblClick = useCallback(
    (e: any) => {
      e.preventDefault()
      map.events.remove('click', onClick)
      map.events.remove('dblclick', onDblClick)
      if (coordinatesRef.current.length >= 3) {
        onPolygonComplete(coordinatesRef.current)
      }
    },
    [map, onClick, onPolygonComplete]
  )

  useEffect(() => {
    console.log('DrawPolygon useEffect check:', { 
      ymapsExists: !!ymaps, 
      mapExists: !!map, 
      drawingMode,
      isPolygonMode: drawingMode === EDrawingMode.POLYGON
    })
  
  
    if (!ymaps || !map || drawingMode !== EDrawingMode.POLYGON) {
      return
    }

    console.log('uraaaa', { ymaps, map, drawingMode })

    map.events.add('click', onClick)
    map.events.add('dblclick', onDblClick)

    return () => {
      map.events.remove('click', onClick)
      map.events.remove('dblclick', onDblClick)
      if (polygonRef.current) {
        map.geoObjects.remove(polygonRef.current)
      }
    }
  }, [ymaps, map, onClick, onDblClick, drawingMode])

  return null
}
