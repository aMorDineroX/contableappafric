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
  // Désactiver la vérification TypeScript pour le build Vercel
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
  build: {
    // Ignorer les erreurs pendant le build
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorer les avertissements spécifiques
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE' || 
            warning.code === 'THIS_IS_UNDEFINED' ||
            warning.message.includes('TypeScript')) {
          return
        }
        warn(warning)
      }
    }
  }
})
