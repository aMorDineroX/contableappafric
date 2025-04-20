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
    // Ignorer les erreurs pendant le build
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignorer tous les avertissements
        return
      }
    }
  },
  esbuild: {
    // Ignorer toutes les erreurs TypeScript
    legalComments: 'none',
    logOverride: {
      'this-is-undefined-in-esm': 'silent',
      'unsupported-jsx-comment': 'silent',
      'parse-error': 'silent',
      'duplicate-import': 'silent',
    },
  }
})
