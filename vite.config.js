import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: [
        '**/dist/**',
        '**/*.md',
        '**/*.txt',
        '**/*.log',
      ],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'axios',
      'three',
      '@react-three/fiber',
      '@react-three/drei',
    ],
  },
})
