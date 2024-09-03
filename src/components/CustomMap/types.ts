export interface IPolygon {
  id: string
  coordinates: number[][]
}

// export type IPoint = any
// export interface IPoint {
//   id: string
//   lat: number
//   lon: number
//   title: string
//   address: string
//   comment: string
//   validity: boolean
//   objectType: EObjectType
// }
export interface IPoint {
  type: 'Feature'
  id: string
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    balloonContent?: string
    clusterCaption?: string
    hintContent?: string
    balloonContentHeader?: string
    balloonContentBody?: string
    balloonContentFooter?: string
  }
  title: string
  address: string
  comment: string
  validity: boolean
  objectType: EObjectType
}

export enum EObjectType {
  BPLA = 'БПЛА',
  ROCKET = 'Обстрел',
  ObPAO = 'ОбПАО',
}

export interface IPlaceMarkPointProps {
  locations: IPoint[]
  selectedLocation: IPoint | null
  setSelectedLocation: (location: IPoint | null) => void
  updatePoint: (id: string, lat: number, lon: number) => void
  editingPoint: IPoint | null
  setEditingPoint: (point: IPoint | null) => void
  deletePoint: (id: string) => void
  onEdit: (point: IPoint) => void
}

export enum EDrawingMode {
  POINT = 'point',
  POLYGON = 'polygon',
}
