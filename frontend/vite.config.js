import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://top2000api.runasp.net',
=======
        target: 'https://top2000api.runasp.net',
>>>>>>> origin/main
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
//test1@gmail.com
//Test123!

//https://top2000api.runasp.net/api/Top2000/top10?year=2024
//http://top2000api.runasp.net/api/Top2000/top10?year=2024