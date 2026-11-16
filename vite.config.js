import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 커스텀 도메인(https://samboart.com/) 루트 배포용
export default defineConfig({
  plugins: [react()],
  base: '/',
})
