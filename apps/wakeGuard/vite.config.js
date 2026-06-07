import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/demos/wake-guard/',
  build: {
    outDir: '../portfolio/public/demos/wake-guard',
    emptyOutDir: true,
  },
  server: {
    port: 5174,
  },
})
