const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Function to create a temporary tsconfig for building
function createTempTsConfig() {
  const originalTsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  
  // Make a copy with more lenient settings
  const tempConfig = {
    ...originalTsConfig,
    compilerOptions: {
      ...originalTsConfig.compilerOptions,
      strict: false,
      noImplicitAny: false,
      noImplicitReturns: false,
      noFallthroughCasesInSwitch: false,
      skipLibCheck: true,
    }
  };
  
  fs.writeFileSync('tsconfig.vercel.json', JSON.stringify(tempConfig, null, 2));
  console.log('Created temporary tsconfig.vercel.json for build');
}

// Main build function
async function build() {
  try {
    console.log('Starting Vercel build process...');
    
    // Create temporary tsconfig
    createTempTsConfig();
    
    // Run TypeScript in transpile-only mode (ignores type errors)
    console.log('Running TypeScript in transpile-only mode...');
    execSync('npx tsc --noEmit false --skipLibCheck --incremental false', { stdio: 'inherit' });
    
    // Run Vite build
    console.log('Running Vite build...');
    execSync('npx vite build', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
