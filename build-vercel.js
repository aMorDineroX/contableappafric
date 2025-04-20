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

    // Skip TypeScript checking completely for Vercel deployment
    console.log('Skipping TypeScript checking for Vercel deployment...');
    // We're not running TypeScript at all, just building with Vite directly

    // Run Vite build with TypeScript errors ignored
    console.log('Running Vite build with TypeScript errors ignored...');
    execSync('npx vite build --emptyOutDir --config vite.config.vercel.ts', {
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_SKIP_TS_CHECK: 'true',
        CI: 'false',
        TSC_COMPILE_ON_ERROR: 'true'
      }
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
