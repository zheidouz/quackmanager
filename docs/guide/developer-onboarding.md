# Developer Onboarding Guide

**QuackManager** is a mobile-first Progressive Web App (PWA) for duck farm management. This guide will get you from zero to running the app locally, understanding the architecture, and making your first contribution.

**Time to complete**: ~30 minutes

---

## Quick Start

### Prerequisites

- **Node.js** 20+ and npm (check with `node --version` and `npm --version`)
- **Git** for version control
- A code editor (VS Code recommended)
- **Firebase account** (free tier) — only needed if deploying

### Clone and Run

```bash
# Clone the repository
git clone https://github.com/your-org/quackmanager.git
cd quackmanager

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open `http://localhost:5173` in your browser. You'll see the login page.

### Signing In During Development

The app uses Firebase Google Sign-In. To bypass the real auth flow during development:

1. Open your browser's DevTools (F12)
2. Go to **Application** → **Local Storage** → `http://localhost:5173`
3. Add a key `quackmanager-auth` with this value:
   ```json
   {
     "state": {
       "user": { "uid": "dev-uid", "email": "dev@test.com", "displayName": "Dev User" },
       "isAuthenticated": true,
       "isLoading": false
     },
     "version": 0
   }
   ```
4. Refresh the page — you'll be logged in as a test user

Alternatively, the Playwright E2E tests handle this automatically via `page.addInitScript`.

---

## Project Structure

```
quackmanager/
├── e2e/                          # Playwright E2E tests
│   └── quackmanager.spec.ts      # 29 tests covering all user flows
├── docs/                         # Documentation
│   ├── architecture/             # ADRs, system diagrams
│   ├── guide/                    # User guide, onboarding
│   ├── security/                 # Security reviews
│   └── ux/                       # UX research artifacts
├── public/                       # Static assets (PWA icons)
├── src/
│   ├── components/               # Shared UI components
│   │   ├── feedback/             # SyncIndicator, EmptyState, etc.
│   │   └── layout/               # AppShell (tab bar, header)
│   ├── db/                       # Dexie.js (IndexedDB) setup
│   ├── features/                 # Feature modules
│   │   ├── auth/                 # LoginPage
│   │   ├── dashboard/            # Summary cards, quick actions
│   │   └── production/           # Egg collection form
│   ├── firebase/                 # Firebase config + Firestore helpers
│   ├── hooks/                    # Shared React hooks
│   ├── lib/                      # Utilities (calculations, constants)
│   ├── stores/                   # Zustand state stores
│   ├── sync/                     # Offline sync engine
│   └── types/                    # TypeScript interfaces
├── firebase.json                 # Firebase Hosting + CSP headers
├── firestore.rules               # Firestore security rules
├── firestore.indexes.json        # Firestore composite indexes
├── playwright.config.ts          # Playwright E2E configuration
├── vitest.config.ts              # Vitest unit test configuration
└── vite.config.ts                # Vite build + PWA configuration
```

---

## Core Concepts

### Offline-First Architecture

QuackManager uses an **offline-first** pattern. All data goes through this flow:

```
User Action → Dexie.js (IndexedDB) → [when online] → Firestore (Cloud)
```

- **Writes** are always to IndexedDB first (instant, no network required)
- **Reads** are always from IndexedDB (instant, live-updating via Dexie's `liveQuery`)
- **Sync** happens in the background:
  - On app load
  - On connectivity change (coming back online)
  - Every 5 minutes while active
  - Conflict resolution: **last-write-wins** (acceptable for single-user app)

### State Management

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Persistent data** | Dexie.js (IndexedDB) | All farm records (eggs, sales, expenses) |
| **UI state** | Zustand | Auth session, sync status, alerts, active tab |
| **URL state** | React Router v6 (HashRouter) | Page navigation, production tab selection |

**Key rule**: Feature data lives in Dexie.js. Zustand only holds UI/transient state like auth and sync status.

### Data Model (Key Entities)

```typescript
// Each record has timestamps for sync tracking
interface BaseRecord {
  id?: string;
  createdAt: string;
  updatedAt: string;
  syncedAt?: string;   // undefined = not yet synced to cloud
}

// Core farm entities
interface EggCollection extends BaseRecord {
  date: string;        // YYYY-MM-DD (unique per day)
  quantity: number;    // Total eggs collected (0–9999)
  notes?: string;
}
```

Other entities follow the same pattern: `EggSale`, `IncubationBatch`, `DuckSale`, `FeedPurchase`, `FeedUsageLog`, `Expense`, `Customer`.

---

## Development Workflow

### Running Tests

```bash
# Unit + component tests (Vitest) — 95 tests
npm test

# Watch mode for TDD
npm run test:watch

# E2E tests (Playwright) — 29 tests
npm run test:e2e

# E2E with visible browser (debugging)
npm run test:e2e:headed
```

### Type Checking and Linting

```bash
# TypeScript type check
npx tsc --noEmit

# ESLint
npm run lint
```

### Building for Production

```bash
# Full build
npm run build
# Output in dist/ — precached by service worker
```

### Code Conventions

- **Components**: PascalCase, default exports for pages
- **Hooks/Utilities**: camelCase, named exports
- **Constants**: UPPER_CASE
- **File size**: Keep components under 200 lines; extract logic into custom hooks
- **Imports order**: React → Third-party → Internal (grouped by feature)
- **Error handling**: Try/catch around all Dexie/Firebase operations

---

## Key Architectural Decisions

| Decision | Rationale | ADR |
|----------|-----------|-----|
| React + Vite (no SSR) | PWA doesn't need SSR; simpler build | ADR-001 |
| Zustand + Dexie.js | Feature data in IndexedDB, UI state in Zustand | ADR-002 |
| Firebase serverless | No backend to manage; free tier for farm scale | ADR-003 |
| Last-write-wins | Simple conflict resolution for single-user | ADR-004 |

See [Architecture Decision Records](../architecture/ADR-001-to-004.md) for details.

---

## Deployment

Deployment is handled by GitHub Actions:

1. Push to `main` branch
2. CI runs: `tsc --noEmit` → `vitest run` → `vite build`
3. Deploy job uploads `dist/` to Firebase Hosting
4. Firestore rules and indexes deploy automatically

**Domain**: `https://duck-inventory-system.firebaseapp.com`

### Required Secrets (GitHub Actions)

| Secret | Purpose |
|--------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID (`duck-inventory-system`) |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Admin SDK JSON for deployment |

---

## Common Tasks

### Adding a New Feature

1. Define the data model in `src/types/models.ts`
2. Add the Dexie table schema in `src/db/database.ts`
3. Create a custom hook in `src/hooks/` for data operations
4. Create the feature folder under `src/features/`
5. Add the route in `src/App.tsx`
6. Write tests (Vitest + Playwright)
7. Add Firestore security rules in `firestore.rules`

### Debugging Sync Issues

1. Check the sync indicator in the header
2. Open DevTools → **Application** → **IndexedDB** → `QuackManagerDB`
3. Look for entries where `syncedAt` is missing (these haven't synced)
4. Check the browser console for Firestore connection errors

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm run dev` fails | Ensure Node.js 20+ is installed. Delete `node_modules` and run `npm install`. |
| Firebase errors in console | Expected in dev — Firestore connections time out without emulator. Data still works offline. |
| E2E tests fail locally | Run `npx playwright install chromium` to ensure the browser binary is installed. |
| TypeScript errors after pull | Run `npm install` to update `node_modules`. |
| Build fails on `tsc -b` | Check for type errors with `npx tsc --noEmit`. Test files use `vitest/globals` types. |

---

## Additional Resources

- [User Guide](quackmanager-user-guide.md) — For farm owners using the app
- [Architecture Overview](../architecture/overview.md) — System design and data flow
- [Project Design Document](../../project_design.md) — Full product spec and roadmap
- [Firestore Security Rules](../security/2026-06-02-firestore-rules-review.md) — Security review
- [UX Research: Egg Collection](../ux/egg-collection-jtbd.md) — User research artifacts
