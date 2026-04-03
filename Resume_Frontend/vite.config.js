import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  define: {
    global: 'globalThis',
    'process.env': {},
  },                        // ← this closing brace was missing

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
    ],
  },
})