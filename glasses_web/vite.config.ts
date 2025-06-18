import { defineConfig } from 'vite'
// @ts-ignore
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000', // Адрес Django-сервера
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
