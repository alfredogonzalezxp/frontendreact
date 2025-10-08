import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    port: 5178,
    proxy: {
      '/api': {
        target: 'https://localhost:8443', // Apunta a tu backend en HTTPS
        changeOrigin: true,
        secure: false, // Permite la conexión a backends con certificados autofirmados
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
