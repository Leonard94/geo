import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  server: {
    open: true,
    port: 3000,
  },
  base: '',
  build: {
    assetsDir: '',
  },
})
