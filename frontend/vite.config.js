import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://top2000api.runasp.net',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      // Proxy for external images to avoid CORS issues with canvas color sampling
      '/proxy-image': {
        target: 'https://i.scdn.co',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/proxy-image/, ''),
      },
    },
  },
})
//test1@gmail.com
//Test123!

//https://top2000api.runasp.net/api/Top2000/top10?year=2024
//http://top2000api.runasp.net/api/Top2000/top10?year=2024