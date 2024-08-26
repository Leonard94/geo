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
}

export interface IPlaceMarkPointProps {
  locations: IPoint[]
  selectedLocation: IPoint | null
  setSelectedLocation: (location: IPoint | null) => void
  updatePoint: (id: string, lat: number, lon: number) => void
  editingPoint: string | null
  setEditingPoint: (id: string | null) => void
  updatePointTitle: (id: string, newTitle: string) => void
}

export enum EDrawingMode {
  POINT = 'point',
  POLYGON = 'polygon',
}
