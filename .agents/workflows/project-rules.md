---
description: Rules for modifying this GitHub Pages project - do not modify config files
---

# Project Rules

## Do NOT Modify Config Files

This project is deployed on **GitHub Pages** with a specific configuration. The following config files must NOT be modified:

- `next.config.mjs`
- `tsconfig.json`
- `postcss.config.mjs`
- `package.json` (do not add/remove dependencies without explicit user approval)
- `.github/` (CI/CD workflows)
- `components.json`

## Only Modify Source Code, Never Commit Build Artifacts

You may freely create or modify files in these directories:
- `app/` — pages, layouts, CSS
- `components/` — React components
- `hooks/` — Custom hooks
- `lib/` — Utilities, constants
- `public/` — Static assets (images, music, etc.)
- `styles/` — Additional stylesheets

> [!WARNING]
> DO NOT commit or retain build artifacts. Directories like `out/`, `.next/`, or `node_modules/` that are generated dynamically during `npm run build` or `npm install` must be ignored or deleted. 
> 
> **Important:** The `next-env.d.ts` file is also automatically modified by Next.js during build/dev. Do not report it as a changed source file. If it gets modified in your Git tree after running a build, run `git checkout next-env.d.ts` to revert it to keep the commit history clean.
> 
> **CRITICAL RULE ON TESTING:** The AI must NEVER run `npm run build` just to verify code. Doing so creates dozens of changed files (in `out/` and `next-env.d.ts`) that pollute the user's workspace. If you need to test the code visually, simply navigate to `http://localhost:3000` assuming the user already has `npm run dev` running. If the server is not running, do not attempt to compile or build—let the user test it manually.
