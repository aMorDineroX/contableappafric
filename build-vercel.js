const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Main build function
async function build() {
  try {
    console.log('Starting Vercel build process...');

    // Skip TypeScript checking completely
    console.log('Skipping TypeScript checking for Vercel deployment...');

    // Run Vite build directly without TypeScript
    console.log('Running Vite build directly...');
    execSync('npx vite build --emptyOutDir', {
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_SKIP_TS_CHECK: 'true',
        CI: 'false',
        TSC_COMPILE_ON_ERROR: 'true',
        SKIP_TS_CHECK: 'true'
      }
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
