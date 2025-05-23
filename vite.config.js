import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: true,
    target: 'es2015',
  },
  esbuild: {
    // Removed jsxInject to prevent duplicate React imports
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
    },
  }
})
