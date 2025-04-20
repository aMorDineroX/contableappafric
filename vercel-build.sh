#!/bin/bash

# Afficher les informations de débogage
echo "Starting Vercel build script..."
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Définir les variables d'environnement
export CI=false
export SKIP_PREFLIGHT_CHECK=true
export TSC_COMPILE_ON_ERROR=true
export VITE_SKIP_TS_CHECK=true
export NODE_OPTIONS="--max-old-space-size=4096"

# Exécuter Vite directement
echo "Running Vite build directly..."
npx vite build --config vite.config.cjs

# Vérifier le résultat
if [ $? -eq 0 ]; then
  echo "Build completed successfully!"
  exit 0
else
  echo "Build failed!"
  exit 1
fi
