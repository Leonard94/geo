export interface IPolygon {
  id: string
  coordinates: number[][]
}

export interface IPoint {
  id: string
  lat: number
  lon: number
  title: string
  address: string
  comment: string
  validity: boolean
  objectType: EObjectType
}

export enum EObjectType {
  BPLA = 'bpla',
  ROCKET = 'rocket',
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
