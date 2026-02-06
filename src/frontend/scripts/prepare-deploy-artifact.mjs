#!/usr/bin/env node

/**
 * Deployment Artifact Preparation Script
 * 
 * This script ensures the deployment artifact is production-ready by:
 * 1. Running the Vite build
 * 2. Verifying the build output
 * 3. Providing clear instructions for deployment
 * 
 * Usage:
 *   node scripts/prepare-deploy-artifact.mjs
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ${message}`, 'red');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function header(message) {
  log('\n' + '='.repeat(60), 'bold');
  log(message, 'bold');
  log('='.repeat(60) + '\n', 'bold');
}

function main() {
  header('Preparing Production Deployment Artifact');

  const projectRoot = join(__dirname, '..');
  const distPath = join(projectRoot, 'dist');

  // Step 1: Check if package manager is available
  info('Detecting package manager...');
  let packageManager = 'npm';
  try {
    execSync('pnpm --version', { stdio: 'ignore' });
    packageManager = 'pnpm';
    success('Using pnpm');
  } catch {
    try {
      execSync('npm --version', { stdio: 'ignore' });
      success('Using npm');
    } catch {
      error('Neither npm nor pnpm found. Please install Node.js and npm.');
      process.exit(1);
    }
  }

  // Step 2: Run the build
  info('\nRunning production build...');
  try {
    execSync(`${packageManager} run build`, {
      cwd: projectRoot,
      stdio: 'inherit',
    });
    success('Build completed successfully');
  } catch (err) {
    error('Build failed. Please fix build errors and try again.');
    process.exit(1);
  }

  // Step 3: Verify dist directory exists
  if (!existsSync(distPath)) {
    error('Build output directory (dist/) not found after build');
    error('The build may have failed silently');
    process.exit(1);
  }

  // Step 4: Run verification script
  info('\nVerifying production artifact...');
  try {
    execSync('node scripts/verify-production-artifact.mjs', {
      cwd: projectRoot,
      stdio: 'inherit',
    });
  } catch (err) {
    error('Artifact verification failed');
    error('Please review the errors above and rebuild');
    process.exit(1);
  }

  // Step 5: Success - provide deployment instructions
  header('Deployment Instructions');
  
  success('Your production artifact is ready!\n');
  
  log('📦 Deploy the following directory:', 'cyan');
  log(`   ${distPath}\n`, 'bold');
  
  log('🚀 Deployment steps:', 'cyan');
  log('   1. Upload the ENTIRE contents of the dist/ folder to your hosting service');
  log('   2. Configure your hosting to serve dist/index.html for all routes (SPA mode)');
  log('   3. Ensure _redirects and _headers files are respected by your host\n');
  
  log('📚 Hosting-specific guides:', 'cyan');
  log('   • Netlify: Drag dist/ folder to Netlify drop zone');
  log('   • Vercel: Run "vercel --prod" from project root');
  log('   • Cloudflare Pages: Connect repo and set build output to "dist"');
  log('   • GitHub Pages: Use gh-pages package to deploy dist/ folder\n');
  
  log('⚠️  IMPORTANT:', 'yellow');
  log('   • Do NOT deploy the source frontend/index.html file');
  log('   • Do NOT deploy the src/ directory');
  log('   • Only deploy the compiled dist/ folder contents\n');
  
  info('See frontend/README.production-deploy.md for detailed instructions\n');
  
  process.exit(0);
}

main();
