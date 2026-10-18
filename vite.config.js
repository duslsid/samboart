import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages(duslsid.github.io/samboart/) 하위 경로 배포용
export default defineConfig({
  plugins: [react()],
  base: '/samboart/',
})
