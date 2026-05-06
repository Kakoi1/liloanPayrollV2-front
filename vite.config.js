import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import basicSsl from '@vitejs/plugin-basic-ssl'
// https://vitejs.dev/config/
export default defineConfig({
  // base: '/warehouse/',
  server: {
    host: process.env.VITE_SYSTEM_DOMAIN || '0.0.0.0',
    port: process.env.VITE_PORT || 8053,              
    https: false,                                     
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
