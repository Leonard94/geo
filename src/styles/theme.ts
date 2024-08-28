import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontFamily: 'roboto',
          fontSize: '12px'
        },
      },
    },
  },
})

export default theme
