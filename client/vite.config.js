import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Capacitor packages are only present in native builds (Android/iOS).
// On the web, alias them all to a stub so Vite can resolve the imports.
// init.js checks isNativePlatform() → false → returns early, so the stubs are never used.
const CAPACITOR_STUB = path.resolve(__dirname, 'src/mobile/capacitor-stub.js');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@capacitor\/.*/, replacement: CAPACITOR_STUB },
    ],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      },
      '/uploads': {
        target: 'http://127.0.0.1:3000',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },
})

