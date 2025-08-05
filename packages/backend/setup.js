#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if convex.json, .convex directory, or .env.local exists (indicates project is configured)
const convexConfigPath = path.join(__dirname, 'convex.json');
const convexDirPath = path.join(__dirname, '.convex');
const envLocalPath = path.join(__dirname, '.env.local');
const isConfigured = fs.existsSync(convexConfigPath) || fs.existsSync(convexDirPath) || fs.existsSync(envLocalPath);

if (isConfigured) {
  console.log('✅ Convex project already configured. Starting development server...');
  
  // Run convex dev - this will keep the server running
  const args = ['convex', 'dev'];
  
  const convexDev = spawn('npx', args, {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      // Force local deployment to avoid login prompts
      CONVEX_DEPLOYMENT: 'anonymous:anonymous-kafe',
      CONVEX_URL: 'http://127.0.0.1:3210'
    }
  });
  
  convexDev.on('close', (code) => {
    process.exit(code);
  });
  
  convexDev.on('error', (error) => {
    console.error('❌ Failed to start Convex dev server:', error.message);
    process.exit(1);
  });
} else {
  console.log('⚠️  Convex project not configured yet.');
  console.log('');
  console.log('To set up Convex for the first time, please run:');
  console.log('');
  console.log('  cd packages/backend');
  console.log('  npx convex dev --configure');
  console.log('');
  console.log('This will:');
  console.log('  • Prompt you to log in to Convex (if needed)');
  console.log('  • Create or select a team and project');
  console.log('  • Set up your development deployment');
  console.log('');
  console.log('After configuration, you can run `bun dev:setup` to start the dev server.');
  console.log('');
  process.exit(1);
}
