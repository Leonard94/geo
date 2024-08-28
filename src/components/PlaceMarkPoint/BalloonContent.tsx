import { IPoint } from '../CustomMap/types'

type TProps = {
  location: IPoint
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export const BalloonContent: React.FC<TProps> = ({
  location,
  onEdit,
  onDelete,
}) => {
  const { id, title, address, comment, objectType, validity } = location

  return (
    <div>
      {title && <b>{title}</b>}
      {address && <p>Адрес: {address}</p>}
      {comment && <p>Комментарий: {comment}</p>}
      {objectType && <p>Тип объекта: {objectType}</p>}
      {validity !== undefined && (
        <p>{validity ? 'Информация актуальна' : 'Информация не актуальна'}</p>
      )}
      <button onClick={() => onEdit(id)}>Редактировать</button>
      <button onClick={() => onDelete(id)}>Удалить</button>
    </div>
  )
}
