# Production Deployment Guide

This document explains how to properly deploy the Valentine proposal app to production and avoid common deployment issues.

## Critical Requirements

### 1. Deploy the Vite Build Output (NOT the source files)

**⚠️ YOU MUST DEPLOY THE COMPILED PRODUCTION BUILD**, not the source files.

After running `npm run build` (or `pnpm build`), Vite generates:
- `dist/index.html` - Compiled HTML with injected asset references
- `dist/assets/*.js` - Compiled JavaScript bundles with content hashes
- `dist/assets/*.css` - Compiled CSS with content hashes
- `dist/assets/*` - Other static assets (images, fonts, etc.)

**Deploy the entire `dist/` folder contents** to your hosting service.

### 2. Why You Cannot Deploy the Source index.html

The source `frontend/index.html` contains:
