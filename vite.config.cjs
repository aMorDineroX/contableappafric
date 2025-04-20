const { defineConfig } = require('vite');
const react = require('@vitejs/plugin-react').default;
const path = require('path');

// https://vitejs.dev/config/
module.exports = defineConfig({
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
        return;
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
