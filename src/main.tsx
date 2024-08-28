import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/App/App'
import './styles/index.scss'
import { ThemeProvider } from '@mui/material'
import theme from './styles/theme'

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
