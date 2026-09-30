# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**Velvet Room** is a Persona 3 Reload-style RPG self-improvement app for Android — an Expo / React Native mobile app, V1 MVP. The player levels up five **life stats** by completing real-world **quests**, tracks relationships as **bonds**, and a lunar cycle (Dark Hour / Full Moon) grants timed XP boosts.

`docs/concept.md` is the **authoritative product/rules spec** — terminology, the XP/level/rank formulas (§4.3), boost stacking (§4.2), moon-phase computation (§4.4), day rollover (§4.5), worked examples (§4.8), full rank tiers (Appendix A), and demo seed data (Appendix B). Read it before implementing any game logic; the numeric rules there are exact and must match across the engine, UI, and boost logic.

## Current state (important)

This is an early scaffold. The actual `src/` tree is minimal — only `constants/`, `navigation/`, `lib/db/`, `lib/data/`, `hooks/` (shared hooks), `components/ui/` (general-purpose UI, including `UnderwaterBackground`), `pages/auth/RegisterPage.tsx` (the animated entrance/register screen, with its components in `pages/auth/components/`, hooks in `pages/auth/hooks/` and config in `pages/auth/config/`), and a placeholder `pages/home/HomePage.tsx` with a delete-account button that erases the player row and resets to Register. The only table is `player` (one row, the name). `RootNavigator` opens on Home when a player row exists, otherwise on Register; Register saves the name on submit and replaces itself with Home after the welcome reveal. `UnderwaterBackground` is rendered once in `App.tsx` behind the navigator; the navigation theme and `contentStyle` are transparent, so screens must not paint their own full-screen background. `config.ts` is an empty object. Verify against the actual files before assuming something exists — the eventual plan (per `docs/concept.md`) reaches well beyond what's currently coded.

## Commands

```bash
npx expo start            # Metro dev server (also `npm start`)
npm run android           # prebuild + build + run native Android (expo run:android)
npm run ios               # native iOS build/run
npm run web               # web preview
npx tsc --noEmit          # typecheck — the current CI-equivalent quality gate
npx expo export --platform android   # bundle-verify: confirms Babel/worklets, NativeWind transform, aliases, fonts all resolve
npm run db:generate       # drizzle-kit: regenerate drizzle/ migrations after editing schema.ts
```

There is **no test runner or linter configured yet** (Jest is planned per STATUS.md but not installed). `tsc --noEmit` is the gate for now.

### Running on a device
- Requires a **custom dev build** (`npm run android`), not Expo Go — Reanimated, SVG, and gesture-handler are native modules. An Android emulator or device must be available.
- **Android builds require JDK 21.** Under JDK 24/25 the `react-native-worklets:configureCMakeDebug` task fails with a misleading `restricted method in java.lang.System` warning. This machine pins Gradle to JDK 21 via `org.gradle.java.home` in `~/.gradle/gradle.properties` (not committed).

## Architecture & conventions

### Stack
- Expo SDK 57, RN 0.86, React 19.2, Hermes, New Architecture, TypeScript 6 strict.
- Path alias `@/*` → `src/*` is set in **both** `tsconfig.json` and `app.json` (`experiments.tsconfigPaths`); keep them in sync.
- **Navigation is code-defined** (React Navigation native-stack), with no file-based routing. Add screens to `src/navigation/RootNavigator.tsx` and their params to `navigation.types.ts`.
- **Reanimated v4** uses `react-native-worklets/plugin`, which must stay **last** in `babel.config.js`. Do not add the legacy reanimated plugin.
- **Fonts** (Chakra Petch display, Barlow body) load via `useFonts` in `App.tsx`; the app renders `null` until they are ready.

### Styling
- **NativeWind v4 with Tailwind pinned to v3.4.19. Never upgrade to Tailwind v4**, because NativeWind v4 requires v3. Global CSS is `src/global.css`. `inlineRem: 16` in `metro.config.js` puts spacing on a 4px grid (`p-4` = 16px).
- **Tokens live only in `src/constants/tokens.cjs`.** It is `.cjs` so `tailwind.config.js` can `require` it. Edit values there, never in the Tailwind config. `src/constants/theme.ts` re-exports `colors` and `radius` for JS use.
- **Tailwind names:** text colors drop their `text` prefix (`textPrimary` → `text-primary`): `primary secondary tertiary muted hint disabled`, plus `accent danger ink white`, `background-400…900` and `glow-300…500`. Examples: `bg-background-800`, `border-accent/30`. Scales: `text-2xs…2xl`, `tracking-xs…2xl`, `rounded-xs/sm/md`, `font-display[-italic|-medium]`, `font-body[-italic|-medium|-bold]`. `textPrimarySoft` is JS-only.
- **Rules:**
  - Use `className` for static layout, spacing, color and typography on core RN components. Style `Text` directly with it (family, size, tracking, one color class).
  - Values passed as props or animated (`LinearGradient colors`, SVG `stopColor`, shadows, `useAnimatedStyle`) use JS tokens from `@/constants/theme` and the helpers in `@/lib/style`: `withAlpha(hex, a)`, `glowShadow(color, opts)` and `textGlow`. Use `textGlow` for glowing titles, since `textShadow` has no Tailwind utility.
  - `Animated.*` components take `style`, not `className`. Put `className` on their children.
  - No hex/rgba literals in screens or primitives. The only exception is scene-only illustration palettes (e.g. the register page's water, door and bubble gradients), kept as named local constants.
- **Page layout:** the page folder holds only its entry component (e.g. `pages/auth/RegisterPage.tsx`) plus three folders: `components/`, `hooks/` and `config/`. Every other component the page uses lives in `pages/auth/components/`, one component per file. A component with sub-components gets its own folder holding the component and its sub-components (e.g. `components/VelvetDoor/VelvetDoor.tsx`, `DoorHalf.tsx`, `EdgeShadow.tsx`). Only general-purpose UI goes in `src/components/ui/`. Move a component there once a second page needs it.
- **Config:** tuning values and settings (sizes, timings, easings, asset switches) live in `pages/auth/config/` (`entranceVideo.ts`, `entranceTiming.ts`, `doorSize.ts`), not in components or hooks.
- **Hooks:** the page's hooks (state, animation, sequencing) live in `pages/auth/hooks/`, each file named after the hook it exports (or the hook family, e.g. `useBubbles`). Component files hold only markup and styles.

### Data
- **Local DB:** expo-sqlite + Drizzle ORM. Always go through `getDb()` in `src/lib/db/client.ts`, which lazily opens `velvet-room.db`. The schema goes in `src/lib/db/schema.ts`, and data access is split per table.
  - **Repositories:** one file per table in `src/lib/data/repositories/` (e.g. `playerRepository.ts`), re-exported from its `index.ts`. They run synchronous drizzle calls through `getDb()`.
  - **Hooks:** each repository has a matching hook in `src/lib/data/hooks/` (e.g. `usePlayer`). The hook returns live data via drizzle's `useLiveQuery`, which needs `enableChangeListener` on the connection in `client.ts`, plus the repository's write actions. Screens use the hooks, not the repositories. A hook's query can only run after migrations, so call it only below the migration gate in `App.tsx` (that's why `RootNavigator` picks the initial route).
- **Migrations:** after changing the schema, run `npm run db:generate` and commit the generated `drizzle/` folder, including `migrations.js`. `useDatabaseReady` (`src/lib/db/`) applies pending migrations at boot, and `App.tsx` renders nothing until they finish. The `.sql` files are bundled by `babel-plugin-inline-import` (in `babel.config.js`, before the worklets plugin) plus `sourceExts.push('sql')` in `metro.config.js`. Restart Metro with `--clear` after changing either file.
- **Client state:** Zustand (installed, no stores yet).
- **Planned:** a cloud source of truth mirrored into local SQLite for offline reads and writes. A thin sync layer keeps them aligned (write-through on change, pull on login). The game engine (concept §4 math) will be pure TypeScript over the local mirror.

### Native dirs
- `ios/` and `android/` are gitignored and generated by prebuild. `plugins/withAndroidLocalProperties.js` rewrites `android/local.properties` (the SDK path) on every prebuild, so deleting the native dirs is safe.
