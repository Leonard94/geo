import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: 'Inter',
          fontSize: '12px'
        },
      },
    },
  },
})

export default theme
