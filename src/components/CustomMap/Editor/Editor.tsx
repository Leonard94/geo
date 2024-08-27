import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Box from '@mui/material/Box'
import { EObjectType, IPoint } from '../types'
import Select from '@mui/material/Select'
import { FormControl, InputLabel, MenuItem } from '@mui/material'

type TProps = {
  onSubmit: (data: IPoint) => void
  onClose: () => void
}

type FormValues = {
  title: string
  comment: string
  validity: boolean
  lat: number
  lon: number
  objectType: EObjectType
}

export const Editor: React.FC<TProps> = ({ onSubmit, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      validity: false, // Set default value for the switch
    },
  })

  const onFormSubmit: SubmitHandler<FormValues> = (data: any) => {
    onSubmit(data)
  }

  return (
    <Box
      component='form'
      onSubmit={handleSubmit(onFormSubmit)}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '300px' }}
    >
      <TextField
        label='Название'
        variant='outlined'
        {...register('title', { required: 'Обязательное поле' })}
        error={!!errors.title}
        helperText={errors.title?.message}
      />
      <TextField
        label='Комментарий'
        variant='outlined'
        multiline
        rows={4}
        {...register('comment')}
        error={!!errors.comment}
        helperText={errors.comment?.message}
      />
      <FormControlLabel
        control={
          <Switch
            {...register('validity')}
            checked={watch('validity')}
            onChange={(e) => setValue('validity', e.target.checked)}
          />
        }
        label='Актуально'
      />
      <TextField
        label='Широта'
        variant='outlined'
        type='number'
        inputProps={{ step: 'any', min: -90, max: 90 }}
        {...register('lat', {
          required: 'Обязательное поле',
          min: {
            value: -90,
            message: 'Координаты должны быть между -90 и 90',
          },
          max: {
            value: 90,
            message: 'Координаты должны быть между -90 и 90',
          },
        })}
        error={!!errors.lat}
        helperText={errors.lat?.message}
      />
      <TextField
        label='Долгота'
        variant='outlined'
        type='number'
        inputProps={{ step: 'any', min: -180, max: 180 }}
        {...register('lon', {
          required: 'Обязательное поле',
          min: {
            value: -180,
            message: 'Координаты должны быть между -180 и 180',
          },
          max: {
            value: 180,
            message: 'Координаты должны быть между -180 и 180',
          },
        })}
        error={!!errors.lon}
        helperText={errors.lon?.message}
      />
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="objectType-label">Тип объекта</InputLabel>
        <Select
          labelId="objectType-label"
          label="Тип объекта"
          {...register('objectType', { required: 'Обязательное поле' })}
          value={watch('objectType')}
          onChange={(e) => setValue('objectType', e.target.value as EObjectType)}
        >
          <MenuItem value={EObjectType.BPLA}>БПЛА</MenuItem>
          <MenuItem value={EObjectType.ROCKET}>Ракета</MenuItem>
        </Select>
      </FormControl>
      <Button type='submit' variant='contained'>
        Создать
      </Button>
      <Button onClick={onClose} variant='outlined'>
        Отмена
      </Button>
    </Box>
  )
}