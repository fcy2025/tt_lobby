import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/tt_lobby/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})