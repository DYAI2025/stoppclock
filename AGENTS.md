# Repository Guidelines

## Project Structure & Module Organization
- Source lives in `src/`, with route-level timers under `src/pages`, reusable UI in `src/components`, shared state in `src/contexts`, and utilities in `src/lib`.
- Static assets, service worker files, and legal pages reside in `public/`; they deploy unchanged.
- Build artifacts (`dist/`, `assets/`) are produced by Vite—treat them as read-only and regenerate via the build script.
- Register new timers by adding a page component and wiring the route in `src/App.tsx`; keep shared styling tokens in `tailwind.config.ts`.

## Build, Test, and Development Commands
- `bun install` installs dependencies; `npm install` is acceptable when Bun is unavailable.
- `bun run dev` (or `npm run dev`) starts the Vite dev server with hot reload.
- `bun run build` creates the production bundle and copies fallback files through the `postbuild` step.
- `bun run preview -- --host` serves the built output; use it for pre-deploy smoke tests.
- `bun run lint` executes ESLint across TypeScript and React sources.

## Coding Style & Naming Conventions
- Use TypeScript throughout; prefer `.tsx` for components, `.ts` for hooks and utilities, and colocate hook files in `src/hooks`.
- Follow the existing two-space indentation, double-quoted strings, and explicit imports via the `@/` alias defined in `tsconfig.json`.
- Compose UI with Tailwind utility classes; add new design tokens in `tailwind.config.ts` before first use.
- Keep component names in PascalCase, hooks in camelCase starting with `use`, and timer routes matching their URL segment (e.g., `Countdown.tsx`).

## Testing Guidelines
- Automated tests are not yet configured; run manual smoke tests for Stopwatch, Countdown, Interval, and cookie consent flows via `bun run dev`.
- After `bun run build`, validate `dist/` output using `bun run preview` to ensure base-path routing and service worker registration work.
- Coordinate before adding a test framework; prefer Vitest + Testing Library with filenames like `Component.test.tsx` alongside the source.

## Commit & Pull Request Guidelines
- Follow the existing conventional style (`feat:`, `fix:`, `build:`, `ci:`) with concise, imperative summaries.
- Reference issues, include relevant screenshots for UI adjustments, and list manual verification steps in the PR body.
- Confirm `bun run lint` and `bun run build` succeed before requesting review; avoid committing generated `dist/` or `assets/` files.
