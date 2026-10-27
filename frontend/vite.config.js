import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
    // Bundle size optimization
    chunkSizeWarningLimit: 1000,
    // Tree shaking is enabled by default in Vite
    minify: 'esbuild',
    esbuild: {
      drop: ['console', 'debugger'],
    },
  },
  // CDN configuration for production
  base: process.env.NODE_ENV === 'production' ? '/cdn/' : '/',
  // PWA configuration
  server: {
    fs: {
      strict: false,
    },
  },
})
