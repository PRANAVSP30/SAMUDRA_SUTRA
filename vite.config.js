import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    allowedHosts: true, // Fixes Vite 6 breaking localtunnel with HTTP 400
  }
})
