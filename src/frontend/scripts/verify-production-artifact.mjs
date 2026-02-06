#!/usr/bin/env node

/**
 * Production Artifact Verification Script
 * 
 * This script validates that a deployment artifact is production-ready by checking:
 * 1. index.html does not reference /src/* paths (dev-only)
 * 2. index.html references /assets/* hashed bundles (production build)
 * 3. All referenced /assets/* files exist on disk
 * 
 * Usage:
 *   node scripts/verify-production-artifact.mjs [path-to-dist]
 *   (defaults to ./dist if no path provided)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`❌ ERROR: ${message}`, 'red');
}

function success(message) {
  log(`✅ ${message}`, 'green');
}

function warning(message) {
  log(`⚠️  WARNING: ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ️  ${message}`, 'blue');
}

function main() {
  const distPath = process.argv[2] || join(__dirname, '..', 'dist');
  
  log('\n' + '='.repeat(60), 'bold');
  log('Production Artifact Verification', 'bold');
  log('='.repeat(60) + '\n', 'bold');
  
  info(`Checking deployment artifact at: ${distPath}\n`);

  // Check 1: Verify dist directory exists
  if (!existsSync(distPath)) {
    error(`Deployment directory does not exist: ${distPath}`);
    error('Did you run "npm run build" or "pnpm build" first?');
    process.exit(1);
  }

  // Check 2: Verify index.html exists
  const indexPath = join(distPath, 'index.html');
  if (!existsSync(indexPath)) {
    error('index.html not found in deployment directory');
    error('The dist/ folder must contain index.html');
    process.exit(1);
  }

  success('Found index.html');

  // Check 3: Read and parse index.html
  let indexContent;
  try {
    indexContent = readFileSync(indexPath, 'utf-8');
  } catch (err) {
    error(`Failed to read index.html: ${err.message}`);
    process.exit(1);
  }

  // Check 4: Verify NO /src/* references (dev-only paths)
  const srcReferences = indexContent.match(/["'](\/src\/[^"']+)["']/g);
  if (srcReferences && srcReferences.length > 0) {
    error('index.html contains development-only /src/* references:');
    srcReferences.forEach(ref => error(`  ${ref}`));
    error('\nThis means you are trying to deploy the SOURCE index.html, not the BUILD output.');
    error('You MUST deploy the contents of the dist/ folder after running "npm run build".');
    error('\nThe production index.html should reference /assets/index-[hash].js, not /src/main.tsx');
    process.exit(1);
  }

  success('No /src/* references found (good - production build)');

  // Check 5: Verify /assets/* bundle references exist
  const assetReferences = [...indexContent.matchAll(/["'](\/assets\/[^"']+\.(?:js|mjs|css))["']/g)]
    .map(match => match[1]);

  if (assetReferences.length === 0) {
    warning('No /assets/* bundle references found in index.html');
    warning('This might indicate an incomplete build or non-standard Vite configuration');
  } else {
    success(`Found ${assetReferences.length} /assets/* bundle reference(s)`);
  }

  // Check 6: Verify all referenced assets exist on disk
  let missingAssets = [];
  for (const assetPath of assetReferences) {
    // Remove leading slash and join with dist path
    const relativePath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    const fullPath = join(distPath, relativePath);
    
    if (!existsSync(fullPath)) {
      missingAssets.push(assetPath);
    }
  }

  if (missingAssets.length > 0) {
    error('Referenced assets are missing from the deployment directory:');
    missingAssets.forEach(asset => error(`  ${asset}`));
    error('\nThe build output is incomplete. Try running "npm run build" again.');
    process.exit(1);
  }

  if (assetReferences.length > 0) {
    success('All referenced /assets/* bundles exist on disk');
  }

  // Check 7: Verify assets directory exists and has content
  const assetsPath = join(distPath, 'assets');
  if (!existsSync(assetsPath)) {
    warning('No /assets directory found in deployment artifact');
    warning('This might indicate an incomplete build');
  } else {
    const assetFiles = readdirSync(assetsPath).filter(f => {
      const stat = statSync(join(assetsPath, f));
      return stat.isFile();
    });
    success(`Found ${assetFiles.length} file(s) in /assets directory`);
  }

  // Check 8: Verify service worker exists (optional but recommended)
  const swPath = join(distPath, 'sw.js');
  if (existsSync(swPath)) {
    success('Service worker (sw.js) found');
  } else {
    warning('Service worker (sw.js) not found - offline support will not work');
  }

  // Check 9: Verify static hosting config files
  const redirectsPath = join(distPath, '_redirects');
  const headersPath = join(distPath, '_headers');
  
  if (existsSync(redirectsPath)) {
    success('Static hosting redirects (_redirects) found');
  } else {
    warning('_redirects file not found - SPA routing may not work correctly');
  }

  if (existsSync(headersPath)) {
    success('Static hosting headers (_headers) found');
  } else {
    warning('_headers file not found - MIME types and caching may not be optimal');
  }

  // Final summary
  log('\n' + '='.repeat(60), 'bold');
  log('Verification Complete', 'bold');
  log('='.repeat(60) + '\n', 'bold');
  
  success('✨ Production artifact is valid and ready to deploy!\n');
  info('Deploy the entire contents of the dist/ folder to your hosting service.');
  info('See frontend/README.production-deploy.md for hosting-specific instructions.\n');
  
  process.exit(0);
}

main();
