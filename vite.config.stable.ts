import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5174, // Port différent pour éviter les conflits
    watch: {
      usePolling: false,
      interval: 5000 // Intervalle très long
    },
    hmr: false, // Désactiver complètement le HMR
    watch: false // Désactiver la surveillance des fichiers
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  // Désactiver la vérification des types TypeScript pendant le développement
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  // Optimisations pour réduire les rechargements
  optimizeDeps: {
    force: true,
    entries: []
  },
  build: {
    sourcemap: false,
    minify: false,
    cssCodeSplit: false
  }
})
