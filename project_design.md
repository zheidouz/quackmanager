# QuackManager — Duck Farm Management App

## Project Overview

A mobile-first Progressive Web App (PWA) for managing the daily operations of a duck farm. QuackManager enables offline data entry, automatic cloud sync, and provides real-time dashboards for production tracking, inventory, sales, expenses, and profitability analysis.

---

# Phase 1: Product Vision (Approved)

## Product Vision
An offline-first, mobile-friendly Progressive Web App that empowers a duck farm owner to track every aspect of their farm — egg production, sales, feed inventory, expenses, and profitability — from a phone, even in areas with poor or no internet connectivity.

## Target Users
- **Primary**: Single duck farm owner-operator managing 100–500 ducks.
- **Secondary**: Farm workers who may enter daily production data (egg counts, feed usage).
- **Non-target**: This is an internal tool — not designed for multi-tenant/SaaS use.

## Core Features
1. **Egg Production Tracking** — Daily egg collection counts, incubation batches, duckling hatch records.
2. **Duck Sales Tracking** — Sold adult ducks, hatched ducklings, pricing, revenue.
3. **Feed Inventory Management** — Current stock levels, daily usage logs, purchase records.
4. **Expense Management** — Categorized expenses (labor, medicine, transport, electricity, maintenance) with receipt photo attachment and recurring expense support.
5. **Customer Records & Simple Invoicing** — Customer database, purchase history, printable PDF invoices.
6. **Profit & Loss Dashboard** — Real-time P&L, cost-per-duck analysis, break-even per batch.
7. **Alerts & Notifications** — Low feed stock, hatch day reminders, medicine schedule, unsold egg freshness warnings.
8. **Reports & Exports** — Daily activity log, monthly inventory report, export to Excel/PDF.
9. **Offline-First PWA** — All data entry works without internet; syncs automatically when connection is restored.

## Functional Requirements
| ID | Requirement |
|---|---|
| FR-01 | User shall record daily egg count (date, quantity). |
| FR-02 | User shall record egg sales (number sold, price per egg, total, optional customer). |
| FR-03 | User shall record eggs placed in incubator (date, expected hatch date, incubator ID). |
| FR-04 | User shall record ducks sold (number, price each, total revenue). |
| FR-05 | User shall record ducklings hatched (date, quantity, source incubator batch). |
| FR-06 | User shall track feed inventory (current stock in kg/bags, daily usage, purchases). |
| FR-07 | User shall record feed purchases (date, feed type, quantity, cost per unit, total). |
| FR-08 | User shall record expenses with category (labor, medicine, transport, electricity, maintenance). |
| FR-09 | User shall attach receipt photos to expense entries. |
| FR-10 | User shall manage recurring expenses (auto-add or reminder). |
| FR-11 | User shall store customer records (name, contact, purchase history). |
| FR-12 | User shall generate simple invoices (PDF print optional). |
| FR-13 | Dashboard shall show real-time profit = (egg sales + duck sales) − (expenses + feed costs). |
| FR-14 | Dashboard shall calculate cost per duck for a given period. |
| FR-15 | Dashboard shall provide break-even analysis per batch. |
| FR-16 | System shall alert when feed stock is below 3 days of estimated consumption. |
| FR-17 | System shall remind 1–2 days before expected hatch date. |
| FR-18 | System shall remind when medicine/vitamins are due. |
| FR-19 | System shall warn if unsold eggs exceed user-defined freshness period. |
| FR-20 | System shall show a daily activity log (eggs collected, sold, feed used, expenses). |
| FR-21 | System shall generate a monthly inventory report (feed, eggs, duck count). |
| FR-22 | System shall export reports to Excel and PDF. |
| FR-23 | App shall work as a PWA installable on mobile phones. |
| FR-24 | App shall support offline data entry with automatic sync. |

## Non-Functional Requirements
| ID | Requirement |
|---|---|
| NFR-01 | App must load and be usable within 3 seconds on a mid-range mobile device. |
| NFR-02 | All core data entry features must work without internet. |
| NFR-03 | Sync must happen automatically in the background when connectivity returns. |
| NFR-04 | UI must have large touch targets (min 48px), minimal typing, dropdowns and number pickers. |
| NFR-05 | App must be installable on Android and iOS via browser. |
| NFR-06 | Data must be stored locally (IndexedDB) and synced to cloud (Firebase). |
| NFR-07 | Authentication must support single-user or simple PIN/password access. |
| NFR-08 | App must handle 500+ daily transactions without performance degradation. |

## Monetization Strategy
Not applicable — this is a purely internal farm management tool with no monetization.

## Success Metrics
| Metric | Target |
|---|---|
| Daily data entry completion rate | 100% of farm days recorded |
| Offline reliability | All entries possible without internet |
| Sync success rate | >99% of offline entries sync successfully |
| User satisfaction | App is used daily without frustration |

## MVP Scope
The MVP will include the following **essential** features (deliverable within the first phase of development):
1. Daily egg collection recording
2. Egg sales recording with optional customer
3. Incubation batch tracking & duckling hatch recording
4. Duck sales recording
5. Feed inventory tracking (current stock + usage + purchases)
6. Expense recording with categories (no photo attachments yet)
7. Basic Profit & Loss dashboard
8. Low feed stock alert
9. Incubator hatch reminder
10. Offline-first PWA with IndexedDB + Firebase sync
11. Daily activity log
12. Firebase Google Sign-In authentication
13. Simple recurring expenses (mark with frequency, auto-insert on app open)

Post-MVP features (Phase 2+):
- Receipt photo attachments
- Customer records & invoices
- Break-even analysis per batch
- Medicine schedule reminders
- Unsold egg freshness alerts
- Monthly inventory report
- Excel/PDF exports
- Cost-per-duck calculation

---

# Phase 2: UI/UX Design (Approved)

## Design System
- **Style**: Clean, professional, minimal — business-oriented with a warm farm touch.
- **Color Palette**:
  - **Primary**: `#1A73E8` (trustworthy blue) — main actions, headers, active states
  - **Secondary**: `#34A853` (growth green) — positive metrics, revenue, success states
  - **Accent**: `#FBBC04` (warm yellow) — alerts, warnings, egg-related icons
  - **Danger**: `#EA4335` (red) — low stock warnings, losses, deletion
  - **Background**: `#FFFFFF` (white) cards, `#F8F9FA` (light gray) page background
  - **Text**: `#202124` (dark gray) primary, `#5F6368` (medium gray) secondary
- **Typography**: System font stack (San Francisco on iOS, Roboto on Android) — no custom fonts needed for performance.
  - Headings: 600 weight (semi-bold)
  - Body: 400 weight (regular)
  - Labels: 500 weight (medium)
- **Border Radius**: 8px for cards, 12px for modals, 20px for buttons (pill-shaped CTA buttons)
- **Shadows**: Soft, subtle (`0 1px 3px rgba(0,0,0,0.08)`, `0 2px 8px rgba(0,0,0,0.12)`)
- **Icons**: Material Symbols (outlined style) — familiar, recognizable, consistent

## Brand Direction
- **Name**: QuackManager
- **Logo idea**: A minimal duck silhouette combined with a clipboard/chart icon, using the primary blue
- **Tone**: Professional, trustworthy, efficient — like a farm management tool built for a serious operation
- **Tagline idea**: *"Your farm, in your pocket."*

## Page Sitemap
```
Home (Dashboard)
├── Summary Cards (today's eggs, sales, expenses, profit)
├── Quick Stats (week/month trends)
└── Recent Activity Feed

Production
├── Egg Collection (add daily count)
├── Incubation Batches (list + add new)
└── Duckling Hatches (list + add new)

Sales & Inventory
├── Egg Sales (add sale, list)
├── Duck Sales (add sale, list)
├── Feed Inventory (current stock, usage log, purchases)
└── Customers (list, add)

Expenses
├── Add Expense (form with category picker)
└── Expense List (filter by category, date)

Reports & Settings
├── Daily Activity Log
├── Profit & Loss Dashboard
├── Alerts & Notifications
└── Settings (PIN, sync, freshness period, etc.)
```

## User Flow — Daily Routine
```
Open App (PIN entry)
    ↓
Dashboard — see today's summary at a glance
    ↓
Tap "Record Eggs Collected" → enter count → saved
    ↓
Tap "Record Feed Used" → enter kg → saved
    ↓
(If sale happens) → go to Sales tab → record sale
    ↓
(If expense occurs) → go to Expenses tab → record expense
    ↓
Done for the day
```

## Navigation Structure
- **Bottom Tab Bar** (5 tabs, always visible):
  1. **Home** (dashboard) — `🏠`
  2. **Production** (eggs, incubation, hatches) — `🥚`
  3. **Sales** (egg sales, duck sales, feed, customers) — `💰`
  4. **Expenses** (add & list expenses) — `📋`
  5. **More** (reports, P&L, settings) — `⚙️`
- Tab bar height: 56px, with labels below icons
- Active tab: primary blue icon + text
- Inactive tab: medium gray icon + text

## Responsive Design Plan
- **Mobile-first** (primary target: phones 360px–428px width)
- **Tablet** (768px+): Side-by-side layout for list/detail views, wider cards
- **Desktop** (1024px+): Max-width container (480px) centered — app-like feel on big screens
- Touch targets: minimum 48×48px, 8px spacing between tappable elements
- Use number pads (`inputmode="numeric"`) for quantity/price fields
- Gesture support: pull-to-refresh for sync status

## Accessibility Considerations
- All touch targets ≥ 48×48px
- Color contrast ratio ≥ 4.5:1 for text (blue on white passes)
- Labels on all form fields (not just placeholders)
- ARIA labels on icon-only buttons
- Focus indicators visible on all interactive elements
- Large tap areas on dropdowns and number pickers

## UI Component Inventory
| Component | Description |
|---|---|
| Summary Card | White rounded card with icon, label, value, trend arrow |
| Data Entry Form | Vertical form with labeled fields, large inputs, number pickers |
| Number Stepper | Plus/minus buttons with large touch targets for quantity entry |
| Category Picker | Horizontal chip/button group for selecting expense type |
| Stat Badge | Small colored badge for metric display (e.g., "Today: 45 eggs") |
| Status Indicator | Green dot (synced), yellow (pending sync), red (error) |
| Alert Banner | Dismissible colored bar at top (warning, info, error) |
| Bottom Sheet | Slide-up panel for quick actions or filters |
| Activity Feed Item | Icon + title + timestamp + value in a list row |
| Tab Bar | 5-tab bottom navigation with icons and labels |
| PIN Pad | Numeric keypad for authentication entry |
| Pull-to-Refresh | Swipe-down gesture to manually trigger sync |
| Empty State | Illustration + message when no data exists |
| Confirm Dialog | Modal for destructive actions (delete entry) |
| Date Picker | Simplified date selector (defaults to today) |

---

# Phase 3: Frontend Architecture (Approved)

## Frontend Stack
| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 18+ with Vite | Lightweight, no SSR overhead, excellent PWA plugin ecosystem |
| **Language** | TypeScript | Type safety for data models, better DX |
| **Build Tool** | Vite 5 | Fast HMR, optimized builds, native ESM |
| **PWA** | `vite-plugin-pwa` (Workbox) | Service worker generation, offline caching, installable |
| **Routing** | React Router v6 (Hash Router) | Client-side routing, no server needed for PWA |
| **State Management** | Zustand | Lightweight, hook-based, perfect for farm-scale data |
| **Offline Storage** | Dexie.js (IndexedDB) | Reliable offline-first local database |
| **Cloud Sync** | Firebase (Firestore) | Free tier, real-time sync, auth |
| **Styling** | Tailwind CSS 3 | Rapid UI development, consistent design tokens, small bundles |
| **Icons** | Material Symbols (via `@material-symbols/react`) | Consistent outlined icons |
| **HTTP Client** | Native `fetch` + Firebase SDK (minimal HTTP needs) | |

## Frontend Architecture
- **Single Page Application (SPA)** with hash-based routing
- **Offline-first** — all CRUD operations go through Dexie.js (IndexedDB) first, then sync to Firebase
- **Sync Layer** — A lightweight Zustand store + sync engine that:
  - Queues writes locally when offline
  - Pushes changes to Firebase when connectivity returns
  - Pulls remote changes on app open & periodically
  - Shows sync status indicator (synced / pending / error)
- **No backend server** — Firebase handles auth, database, and file storage (for future photo attachments)
- **Feature-based folder structure** — each feature is self-contained

## Folder Structure
```
quackmanager/
├── public/
│   ├── icons/              # PWA icons (192px, 512px)
│   ├── manifest.json       # PWA manifest
│   └── robots.txt
├── src/
│   ├── main.tsx            # App entry point
│   ├── App.tsx             # Root component with router
│   ├── index.css           # Tailwind imports + global styles
│   ├── vite-env.d.ts
│   │
│   ├── features/           # Feature modules (self-contained)
│   │   ├── dashboard/      # Home screen
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── SummaryCard.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── production/     # Eggs, incubation, hatches
│   │   │   ├── ProductionPage.tsx
│   │   │   ├── EggCollectionForm.tsx
│   │   │   ├── IncubationList.tsx
│   │   │   ├── IncubationForm.tsx
│   │   │   ├── HatchList.tsx
│   │   │   └── HatchForm.tsx
│   │   ├── sales/          # Egg sales, duck sales
│   │   │   ├── SalesPage.tsx
│   │   │   ├── EggSaleForm.tsx
│   │   │   ├── DuckSaleForm.tsx
│   │   │   ├── SaleList.tsx
│   │   │   └── CustomerList.tsx
│   │   ├── feed/           # Feed inventory
│   │   │   ├── FeedPage.tsx
│   │   │   ├── FeedStockCard.tsx
│   │   │   ├── FeedUsageForm.tsx
│   │   │   ├── FeedPurchaseForm.tsx
│   │   │   └── FeedHistory.tsx
│   │   ├── expenses/       # Expense tracking
│   │   │   ├── ExpensesPage.tsx
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   └── ExpenseCategoryPicker.tsx
│   │   ├── reports/        # Reports & P&L
│   │   │   ├── ReportsPage.tsx
│   │   │   ├── DailyLog.tsx
│   │   │   ├── ProfitLossDashboard.tsx
│   │   │   └── MonthlyReport.tsx
│   │   └── settings/       # Settings, PIN, sync
│   │       ├── SettingsPage.tsx
│   │       ├── PinSetup.tsx
│   │       └── SyncStatus.tsx
│   │
│   ├── components/         # Shared/reusable UI components
│   │   ├── ui/             # Atomic UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── NumberInput.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── DatePicker.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   └── AlertBanner.tsx
│   │   ├── layout/
│   │   │   ├── TabBar.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   └── AppShell.tsx
│   │   └── feedback/
│   │       ├── SyncIndicator.tsx
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ConfirmDialog.tsx
│   │
│   ├── db/                 # Database layer (Dexie.js)
│   │   ├── schema.ts       # IndexedDB table definitions
│   │   ├── db.ts           # Dexie database instance
│   │   └── seed.ts         # Optional dev seed data
│   │
│   ├── sync/               # Sync engine
│   │   ├── syncEngine.ts   # Core sync logic
│   │   ├── syncStore.ts    # Zustand store for sync state
│   │   └── useOnlineStatus.ts  # Network connectivity hook
│   │
│   ├── stores/             # Zustand global stores
│   │   ├── authStore.ts    # PIN/auth state
│   │   ├── appStore.ts     # App-wide UI state
│   │   └── alertStore.ts   # Alert/notification state
│   │
│   ├── hooks/              # Shared React hooks
│   │   ├── useToday.ts
│   │   ├── useDebounce.ts
│   │   └── useFormattedDate.ts
│   │
│   ├── lib/                # Utility functions
│   │   ├── format.ts       # Currency, date, number formatting
│   │   ├── calculations.ts # P&L, cost-per-duck, break-even math
│   │   └── constants.ts    # App-wide constants
│   │
│   └── types/              # TypeScript type definitions
│       ├── models.ts       # DuckFarm data models
│       └── events.ts       # Custom event types
│
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts          # Vite + PWA plugin config
└── postcss.config.js
```

## Component Architecture
- **Atomic design** approach: Atoms → Molecules → Organisms → Pages
  - **Atoms** (`src/components/ui/`): Button, Input, Badge, Select, Modal
  - **Molecules** (within features): EggCollectionForm, SummaryCard, ExpenseCategoryPicker
  - **Organisms** (feature pages): DashboardPage, ProductionPage, SalesPage
- **Composition over inheritance** — build complex UIs by composing smaller components
- **Container/Presenter pattern** — feature pages handle data logic, presentational components receive props

## Routing Plan
| Route | Component | Tab |
|---|---|---|
| `/` | `DashboardPage` | Home |
| `/production` | `ProductionPage` | Production |
| `/production/incubation` | `IncubationList` | Production |
| `/production/hatch` | `HatchList` | Production |
| `/sales` | `SalesPage` | Sales |
| `/sales/feed` | `FeedPage` | Sales |
| `/expenses` | `ExpensesPage` | Expenses |
| `/reports` | `ReportsPage` | More |
| `/reports/profit-loss` | `ProfitLossDashboard` | More |
| `/settings` | `SettingsPage` | More |

Hash router format: `#/production`, `#/sales/feed`, etc.

## State Management (Zustand Stores)
| Store | Purpose | Key State |
|---|---|---|
| `authStore` | Firebase Google Sign-In auth | `user`, `isAuthenticated`, `login()`, `logout()` |
| `appStore` | Global UI state | `todayDate`, `syncStatus`, `activeTab` |
| `alertStore` | Notification state | `alerts[]`, `dismissAlert()` |
| `syncStore` | Sync engine state | `isOnline`, `pendingCount`, `lastSynced`, `sync()` |

Feature-specific data lives in Dexie.js (IndexedDB), not in Zustand. Zustand only holds UI/transient state.

## Styling Strategy
- **Tailwind CSS** for all styling — utility-first, consistent design tokens
- **Custom design tokens** in `tailwind.config.ts`:
  ```ts
  colors: {
    primary: '#1A73E8',
    secondary: '#34A853',
    accent: '#FBBC04',
    danger: '#EA4335',
    surface: '#F8F9FA',
  }
  ```
- No CSS-in-JS — keeps bundle small and build times fast
- Responsive utilities: `sm:`, `md:`, `lg:` breakpoints
- Dark mode not needed (light-only design)
- Component classes extracted only when patterns repeat 3+ times

## SEO Strategy
- Not applicable — this is a private PWA, not a public website
- Meta tags for PWA manifest and `apple-touch-icon` only
- No SSR, no sitemap, no indexing needed

## Performance Optimization Plan
| Concern | Strategy |
|---|---|
| **Bundle size** | Code-split by route (lazy loading with `React.lazy()`) |
| **Image loading** | No external images; PWA icons are tiny and local |
| **First load** | Workbox precaches all static assets; app loads from cache on repeat visits |
| **Offline** | Dexie.js handles all data locally — zero latency reads |
| **Rendering** | Minimal re-renders via Zustand's shallow equality and React.memo on list items |
| **Sync** | Debounced sync (batch changes, don't sync every keystroke) |
| **CSS** | Tailwind purges unused styles in production |
| **JS execution** | Keep bundle under 200KB gzipped (no heavy UI libraries) |

## Coding Conventions
- **Naming**: PascalCase for components, camelCase for functions/variables, UPPER_CASE for constants
- **Imports order**: React → Third-party → Internal (grouped by feature)
- **Exports**: Named exports for hooks/utils, default exports for pages
- **File size**: Keep components under 200 lines; extract logic into custom hooks
- **Error handling**: Try/catch around all Dexie/Firebase operations; show user-friendly toast on failure
- **Comments**: JSDoc for public functions/types; inline comments for complex logic only
- **Testing readiness**: Keep data logic separate from UI (easy to unit test stores and calculations)

---

# Phase 4: Backend Architecture (Approved)

## Backend Stack
| Layer | Technology | Rationale |
|---|---|---|
| **Backend** | Firebase (serverless) | No backend server needed; auth, db, sync all-in-one |
| **Authentication** | Firebase Auth — Google Sign-In | Simple, no password to remember, works offline-first with local fallback |
| **Database (Cloud)** | Firestore | Real-time sync, generous free tier (1GB stored, 10GB/month downloads) |
| **Database (Local)** | Dexie.js (IndexedDB) | Offline-first local storage, automatic sync with Firestore |
| **File Storage** | Not in MVP (post-MVP: Firebase Storage) | Receipt photo uploads deferred |
| **Security** | Firestore Security Rules | Lock down per-user access |

## Authentication Design
- **Flow**:
  1. App opens → check local auth state (session persisted in IndexedDB)
  2. If not authenticated → show **Google Sign-In button** (Firebase Auth)
  3. On success → Firebase returns user object → store session locally
  4. **Offline behavior**: Once signed in, session persists locally. Google Sign-In requires internet for initial auth, but subsequent app opens use cached credentials.
  5. **Sign out**: Clear local session + Firebase sign-out
- **Why Google Sign-In**:
  - No password to forget — user is already logged into Google on their phone
  - One-tap experience on Android/Chrome
  - Firebase handles all the complexity
  - Secure, no PIN storage risks

## Database Schema Strategy
- **Document-based** (Firestore) with **separate documents per entry**
- Each collection corresponds to a core entity
- All documents have `createdAt`, `updatedAt`, `syncedAt` timestamps
- Local IndexedDB mirrors the Firestore collections with identical schema

### Entity Relationship Diagram
```
Farm [single document, singleton]
  ├── settings: { name, freshnessDays, lowFeedThresholdDays }
  │
  ├── EggCollections [collection]
  │   └── { id, date, quantity, notes, createdAt, updatedAt }
  │
  ├── EggSales [collection]
  │   └── { id, date, quantity, pricePerEgg, total, customerName?, createdAt }
  │
  ├── IncubationBatches [collection]
  │   ├── { id, datePlaced, quantity, incubatorId, expectedHatchDate, notes, createdAt }
  │   └── → DucklingHatches [sub-collection or reference]
  │       └── { id, incubationBatchId, hatchDate, quantity, notes, createdAt }
  │
  ├── DuckSales [collection]
  │   └── { id, date, quantity, priceEach, total, customerName?, createdAt }
  │
  ├── DucklingHatches [collection]
  │   └── { id, date, quantity, incubationBatchId?, notes, createdAt }
  │
  ├── FeedPurchases [collection]
  │   └── { id, date, feedType, quantity, unit (kg/bag), costPerUnit, totalCost, createdAt }
  │
  ├── FeedUsageLogs [collection]
  │   └── { id, date, quantityKg, notes, createdAt }
  │
  ├── FeedStock [singleton document]
  │   └── { currentStockKg, lastUpdated, dailyAvgConsumptionKg, lowStockThresholdKg }
  │
  ├── Expenses [collection]
  │   └── { id, date, category, amount, description, isRecurring, recurringFrequency?, receiptPhotoUrl?, createdAt }
  │
  ├── Customers [collection]  (post-MVP)
  │   └── { id, name, phone, email?, createdAt }
  │
  └── DailyLogs [collection]  (aggregated view)
      └── { id (YYYY-MM-DD), date, eggsCollected, eggsSold, feedUsedKg, expensesTotal, notes }
```

### Recurring Expenses Design
- Expenses can be marked `isRecurring: true` with a `recurringFrequency` field: `"daily"` | `"weekly"` | `"monthly"`
- On app open (or daily first open), the sync engine checks:
  - For each recurring expense, was an instance created for the current period?
  - If not → auto-insert a new expense entry with `isAutoGenerated: true` and a reference to the template
- User can edit or delete auto-generated expenses
- Recurring templates are stored as separate documents in a `RecurringExpenseTemplates` collection

## API Architecture
- **No REST/GraphQL API** — Firebase SDK communicates directly with Firestore
- **Sync Layer** (custom, within the PWA):
  - **Reads**: Always from IndexedDB (instant), Firestore updates sync in background
  - **Writes**: Always to IndexedDB first (instant), queued for Firestore sync
  - **Conflict resolution**: Last-write-wins (simplest for single-user app)
  - **Sync trigger**: On app open, on connectivity change, periodic (every 5 min while active)

## Security Plan
- **Firestore Security Rules**:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // Only authenticated user can access
      match /{document=**} {
        allow read, write: if request.auth != null;
      }
    }
  }
  ```
- **Firebase Auth**: Google Sign-In only, single-user (or whitelist specific email if needed)
- **Local data**: No encryption in MVP (device-level security assumed via phone lock screen)
- **API Keys**: Firebase config in `.env` file, not committed

## Storage Strategy
- **Firebase Storage**: Skipped for MVP (no receipt photo uploads yet)
- Future: `Expenses` document will gain `receiptPhotoUrl` field pointing to Firebase Storage path

## Payment System
- Not applicable — no payments processed in this app

## Caching Strategy
| Cache Layer | What | How |
|---|---|---|
| **IndexedDB** | All farm data | Dexie.js — single source of truth locally |
| **Service Worker** | App shell (HTML, JS, CSS, icons) | Workbox precache via vite-plugin-pwa |
| **Firestore Cache** | Cloud data | Firebase SDK built-in persistence (secondary) |
| **Session** | Auth state | IndexedDB + Firebase Auth state persistence |

## Scalability Plan
- **100–500 ducks** → ~50–200 transactions/day → Firestore free tier easily handles this
- **Offline queue**: Dexie.js handles unlimited offline writes; syncs when online
- **Future growth**: If multi-farm needed later, add `farmId` field to all documents and adjust security rules
- **Performance**: Firestore queries indexed by `date` field for fast time-range queries

## Example Firestore Indexes
```
Collection: EggCollections
  - date (ascending) ← for daily log queries
  - createdAt (descending) ← for recent entries

Collection: Expenses
  - date (ascending)
  - category (ascending)

Collection: FeedUsageLogs
  - date (ascending)

Collection: EggSales
  - date (ascending)
```

## Backend Folder Structure (within the same codebase)
```
src/
├── db/
│   ├── schema.ts        # Dexie table schema definitions
│   ├── db.ts            # Dexie database instance
│   └── seed.ts          # Optional development seed data
├── sync/
│   ├── syncEngine.ts    # Core sync logic (Firestore ↔ IndexedDB)
│   ├── syncStore.ts     # Zustand sync state
│   └── useOnlineStatus.ts  # Network connectivity detection
├── firebase/
│   ├── config.ts        # Firebase app initialization from env
│   ├── auth.ts          # Google Sign-In logic
│   └── firestore.ts     # Firestore helper functions
├── types/
│   └── models.ts        # TypeScript interfaces matching all entities above
└── stores/
    └── authStore.ts     # Zustand auth state (wraps Firebase Auth)
```

---

# Phase 5: QA Testing Strategy (Approved)

## QA Strategy Overview
A pragmatic, risk-based testing approach — focus effort on the **critical paths** (data integrity, offline sync, core CRUD operations) rather than aiming for full coverage. As an internal farm tool, perfect UI pixel-matching is less important than **data correctness and reliability**.

| Testing Layer | Tool | Scope |
|---|---|---|
| **Unit Tests** | Vitest | Data models, calculations (P&L, cost-per-duck), utility functions |
| **Component Tests** | Vitest + React Testing Library | Core forms, summary cards, critical UI interactions |
| **Integration Tests** | Vitest + React Testing Library | Data entry flows, form submission → IndexedDB writes |
| **E2E Tests** | Playwright | PWA installability, offline sync, critical user journeys |
| **Manual Testing** | Checklist | Exploratory testing on real mobile device |

## Automated Testing Plan

### Unit Tests (Vitest)
| Test Suite | What to Test | Priority |
|---|---|---|
| **Calculations** | `profit = sales - expenses - feedCosts` | Critical |
| **Calculations** | `costPerDuck = totalCost / ducksRaised` | High |
| **Calculations** | `breakEven = revenue - cost` per batch | Medium |
| **Formatters** | Currency formatting, date formatting | Medium |
| **Constants** | Category lists, default values | Low |
| **Recurring expenses** | Logic for determining if a new instance should be auto-inserted | High |

### Component Tests (React Testing Library)
| Component | What to Test | Priority |
|---|---|---|
| **EggCollectionForm** | Submit with valid/invalid quantity, required fields | Critical |
| **ExpenseForm** | Category selection, amount entry, recurring toggle | Critical |
| **SummaryCard** | Renders correct value, handles zero/empty | High |
| **NumberInput** | Accepts numeric input, respects min/max | High |
| **SyncIndicator** | Shows correct status (synced/pending/error) | Medium |
| **AlertBanner** | Renders and dismisses alerts | Medium |
| **LoginPage** | Google Sign-In button renders | High |

### Integration Tests
| Flow | What to Test | Priority |
|---|---|---|
| **Egg collection flow** | Form submit → saved to IndexedDB → appears in list | Critical |
| **Expense entry flow** | Form submit → saved with category → appears in daily log | Critical |
| **Feed usage flow** | Log feed use → stock decrements correctly | Critical |
| **Recurring expense** | Create template → verify auto-insertion on app open | High |
| **Daily log aggregation** | Multiple entries → daily summary correct | High |

### E2E Tests (Playwright)
| Test | What to Verify | Priority |
|---|---|---|
| **PWA installable** | `beforeinstallprompt` event fires, manifest valid | High |
| **Service worker** | SW registered, caches static assets | High |
| **Offline data entry** | Enter data offline → stored in IndexedDB | Critical |
| **Online sync** | Go online → pending data syncs to Firestore | Critical |
| **Google Sign-In** | Auth flow completes, user session persists | Critical |
| **Full day workflow** | Record eggs, sale, expense, feed in sequence | High |
| **Navigation** | All 5 tabs navigate to correct pages | Medium |

## Manual Testing Checklist
Test on a **real Android/iOS phone** via Chrome/Safari:

| Test Case | Pass Criteria |
|---|---|
| Install PWA on home screen | App installs and opens standalone |
| Enter data offline (airplane mode) | All data entry forms work, no errors |
| Turn on internet | Data syncs automatically, sync indicator turns green |
| Enter 50 egg collections rapidly | No lag, all entries saved |
| Change date and enter data | Entries attributed to correct date |
| Delete an entry | Entry removed locally and synced |
| Test all 5 tabs | Each page loads with correct data |
| Enter large numbers (999 eggs) | No overflow, displays correctly |
| Test recurring expense | Auto-inserted on next app open |
| Refresh page while offline | App loads from cache, data intact |

## Accessibility Testing
- ✅ Large touch targets (verify all ≥ 48px with DevTools)
- ✅ Color contrast ratio ≥ 4.5:1 (check blue/white/gray combos)
- ✅ All form inputs have associated labels
- ✅ Tab order follows visual order
- ✅ Screen reader: forms announce field labels
- ❌ No dark mode needed (as per design)

## Performance Testing
| Metric | Target | Tool |
|---|---|---|
| First load (cold cache) | < 3s on mid-range phone | Lighthouse (Chrome DevTools) |
| Repeat load (cached) | < 1s | Chrome DevTools |
| Time to interactive | < 3s | Lighthouse |
| IndexedDB read/write | < 50ms per operation | Manual profiling |
| Sync batch (50 entries) | < 5s on 4G | Network throttling in DevTools |
| Bundle size | < 200KB gzipped | Vite build report |

## Security Testing
- ✅ Firebase Security Rules — test read/write with/without auth
- ✅ `.env` file not committed (Firebase config)
- ✅ No sensitive data in IndexedDB (farm data only, no credentials)
- ✅ Service worker scope limited to app origin
- ❌ No XSS surface (no user-rendered HTML, all safe React rendering)

## CI/CD Validation Rules (via GitHub Actions)
| Check | Command | When |
|---|---|---|
| TypeScript type check | `tsc --noEmit` | On every PR & push to main |
| Unit + component tests | `vitest run` | On every PR & push to main |
| Lint | `eslint src/` | On every PR & push to main |
| Build | `vite build` | On every PR & push to main |
| E2E (Playwright) | `npx playwright test` | Before release / on demand |
| PWA Lighthouse audit | `lighthouse-ci` | Before release |

## Test Coverage Goals
| Layer | Target |
|---|---|
| Calculations / Utils | 90%+ coverage |
| Stores (Zustand) | 80%+ coverage |
| Core form components | 70%+ coverage |
| Page-level components | 50%+ coverage |
| E2E critical paths | 100% of critical paths covered |

## Bug Severity Guidelines
| Severity | Definition | Response |
|---|---|---|
| **Critical** | Data loss, app crash, sync failure | Fix immediately, block release |
| **High** | Feature broken, wrong calculations | Fix before next release |
| **Medium** | UI glitch, minor incorrect display | Fix in current/next sprint |
| **Low** | Cosmetic issue, typo | Fix when convenient |

## Release Checklist
- [ ] All critical and high-severity bugs fixed
- [ ] TypeScript type check passes
- [ ] Vitest suite passes (unit + components)
- [ ] Build succeeds (`vite build`)
- [ ] Manual test on real phone (critical paths)
- [ ] Offline → online sync verified
- [ ] PWA installs correctly
- [ ] Firebase security rules tested
- [ ] `.env` excluded from version control

---

# Phase 6: DevOps Deployment (Approved)

## Deployment Architecture
```
                ┌─────────────────────────┐
                │   Developer pushes to    │
                │   GitHub (main branch)   │
                └──────────┬──────────────┘
                           │
                    ┌──────▼──────┐
                    │   GitHub     │
                    │   Actions    │
                    │  (CI/CD)     │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
       ┌──────▼─────┐ ┌───▼────┐ ┌────▼─────┐
       │  tsc check  │ │ Vitest │ │ Vite     │
       │  (types)    │ │ (tests)│ │ Build    │
       └─────────────┘ └────────┘ └────┬─────┘
                                        │
                                 ┌──────▼──────┐
                                 │   Firebase   │
                                 │   Hosting    │
                                 │  (deploy)    │
                                 └──────┬──────┘
                                        │
                          ┌─────────────▼─────────────┐
                          │  quackmanager.web.app      │
                          │  (PWA served via CDN)      │
                          │                            │
                          │  Firestore (data)          │
                          │  Firebase Auth (Google)    │
                          │  Firebase Crashlytics      │
                          └───────────────────────────┘
```

## Hosting Strategy
| Aspect | Decision |
|---|---|
| **Hosting Provider** | **Firebase Hosting** — integrated with existing Firebase stack |
| **Domain** | `quackmanager.web.app` (free Firebase subdomain) |
| **SSL** | Auto-provisioned (free, included) |
| **CDN** | Global Firebase CDN — fast static asset delivery |
| **Cache Policy** | Immutable JS/CSS: 1 year cache; HTML: no-cache (revalidate) |
| **PWA** | Service worker handles all offline assets via Workbox precache |

## CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy QuackManager

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npx tsc --noEmit          # Type check
      - run: npx vitest run             # Unit + component tests
      - run: npx eslint src/            # Lint
      - run: npm run build              # Vite production build

  deploy:
    name: Deploy to Firebase
    needs: quality
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: ${{ secrets.GITHUB_TOKEN }}
          firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
          channelId: live
          projectId: quackmanager
```

## Environment Variables Plan
| Variable | Purpose | Where Set |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase project API key | GitHub Secrets + `.env.example` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain (`quackmanager.firebaseapp.com`) | GitHub Secrets |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID | GitHub Secrets |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket (unused in MVP) | GitHub Secrets |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | GitHub Secrets |
| `VITE_FIREBASE_APP_ID` | Firebase app ID | GitHub Secrets |
| `FIREBASE_SERVICE_ACCOUNT` | Deploy service account JSON | GitHub Secrets (for CI/CD) |

> **Note**: `VITE_` prefix is required for Vite to expose env vars to client code. All Firebase config values are public-facing (they're keys, not secrets) — security is enforced via Firestore Security Rules, not API key secrecy.

## Monitoring & Logging
| Tool | Purpose | Cost |
|---|---|---|
| **Firebase Crashlytics** | Automatic crash reporting with stack traces | Free |
| **Firebase Analytics** | Basic usage tracking (optional) | Free |
| **Firebase Console** | Firestore usage, Auth activity, Hosting logs | Free |
| **Manual** | User reports bugs verbally (internal user) | — |

## Backup & Recovery
| Data | Backup Strategy | Recovery |
|---|---|---|
| **Firestore** | Automatic multi-region replication by Firebase | Point-in-time recovery (last 30 days on Firestore) |
| **Local IndexedDB** | No backup needed (synced to Firestore) | Re-sync from cloud if device lost |
| **Service Account** | Store in GitHub Secrets + password manager | Re-create via Firebase Console |
| **Source Code** | GitHub (automatic) | Clone from GitHub |

## Cost Estimation
| Service | Free Tier | Estimated Monthly Cost |
|---|---|---|
| Firebase Hosting | 10GB storage, 360MB/day bandwidth | **$0** (well within free tier) |
| Firestore | 1GB stored, 50K reads/day, 20K writes/day | **$0** (farm scale fits easily) |
| Firebase Auth | 50K monthly active users | **$0** (single user) |
| Firebase Crashlytics | Free | **$0** |
| GitHub Actions | 2,000 min/month free | **$0** (minimal CI usage) |
| Domain | Free subdomain (`*.web.app`) | **$0** |
| **Total Monthly** | | **$0 — completely free** 🎉 |

## Production Readiness Checklist
- [ ] Firebase project created (`quackmanager`)
- [ ] Firebase Hosting configured with `firebase.json`
- [ ] Firestore database created in production mode
- [ ] Firebase Auth — Google Sign-In enabled
- [ ] Firestore Security Rules deployed
- [ ] Firestore indexes created
- [ ] GitHub repo set up with `main` branch protection
- [ ] GitHub Secrets configured (Firebase config + service account)
- [ ] GitHub Actions workflow file committed (`.github/workflows/deploy.yml`)
- [ ] Service worker tested (precache, offline fallback)
- [ ] PWA manifest valid (icons, short_name, display: standalone)
- [ ] Lighthouse audit passes on mobile
- [ ] Manual E2E test: offline → sync cycle
- [ ] Environment variables documented in `.env.example`
- [ ] `node_modules` and `.env` in `.gitignore`

## Deployment Steps
1. Create Firebase project: `firebase projects:create quackmanager`
2. Enable Firebase Auth → Google Sign-In
3. Create Firestore database (production mode)
4. Deploy Firestore Security Rules & indexes
5. Initialize Firebase Hosting: `firebase init hosting`
6. Configure `firebase.json` for SPA rewrites:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*"],
       "rewrites": [{ "source": "**", "destination": "/index.html" }],
       "headers": [
         {
           "source": "**/*.@(js|css)",
           "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
         },
         {
           "source": "**/*.@(html|json)",
           "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
         }
       ]
     }
   }
   ```
7. Build: `npm run build`
8. Deploy: `firebase deploy`
9. Set up GitHub Actions (push `.github/workflows/deploy.yml`)
10. Open `https://quackmanager.web.app` — verify live

## Rollback Strategy
| Scenario | Action |
|---|---|
| **Buggy deploy** | `firebase hosting:clone —version v1 v2` (instant rollback to previous version) |
| **Firestore data issue** | Restore from Firestore point-in-time recovery (past 30 days) |
| **Auth problem** | Disable/enable Google Sign-In in Firebase Console |
| **Full rollback** | Revert Git commit + push → GitHub Actions auto-deploys previous version |

## Scaling Recommendations
| Scale Level | Actions Needed |
|---|---|
| **Current (100–500 ducks)** | No changes — free tier handles this easily |
| **1,000+ ducks** | Consider Firestore Blaze plan (~$5–10/month if exceeding reads) |
| **Multi-farm** | Add `farmId` field + Firestore collection group indexes + separate Security Rules per farm |
| **10+ users** | Add email-based access control in Firestore Rules |

---

# ✅ Finalization — Project Planning Complete

## Final Tech Stack Summary
| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18 + TypeScript |
| **Build Tool** | Vite 5 |
| **PWA** | vite-plugin-pwa (Workbox) |
| **Styling** | Tailwind CSS 3 |
| **State Management** | Zustand + Dexie.js (IndexedDB) |
| **Cloud Backend** | Firebase (Firestore + Auth + Hosting) |
| **Auth** | Firebase Google Sign-In |
| **Offline Sync** | Custom sync engine (IndexedDB → Firestore) |
| **Testing** | Vitest + React Testing Library + Playwright |
| **CI/CD** | GitHub Actions → Firebase Hosting deploy |
| **Monitoring** | Firebase Crashlytics |
| **Domain** | `quackmanager.web.app` (free) |

## Implementation Roadmap

### Sprint 1 (Weeks 1-2) — Foundation
- [ ] Initialize Vite + React + TypeScript project
- [ ] Configure Tailwind CSS + design tokens
- [ ] Set up Dexie.js schema + database
- [ ] Set up Firebase project + Auth + Firestore
- [ ] Implement Google Sign-In
- [ ] Build App shell with bottom tab navigation
- [ ] Implement offline detection + sync indicator
- [ ] **Deliverable**: Installable PWA with auth and navigation

### Sprint 2 (Weeks 3-4) — Core Production Tracking
- [ ] Egg collection form + list
- [ ] Incubation batch form + list
- [ ] Duckling hatch form + list
- [ ] Daily activity log (aggregated view)
- [ ] Dashboard summary cards
- [ ] **Deliverable**: Full production tracking works offline

### Sprint 3 (Weeks 5-6) — Sales, Feed & Expenses
- [ ] Egg sales form + list
- [ ] Duck sales form + list
- [ ] Feed inventory (stock display, usage log, purchase form)
- [ ] Expense form with categories
- [ ] Recurring expense templates + auto-insert
- [ ] **Deliverable**: All data entry features complete

### Sprint 4 (Weeks 7-8) — Sync & Offline Polish
- [ ] Sync engine (IndexedDB ↔ Firestore)
- [ ] Sync status indicator + manual sync trigger
- [ ] Alert system (low feed stock, hatch reminders)
- [ ] Pull-to-refresh
- [ ] **Deliverable**: Full offline-first sync working

### Sprint 5 (Weeks 9-10) — Reports & Dashboard
- [ ] P&L dashboard (real-time profit calculation)
- [ ] Daily activity log
- [ ] Alert management page
- [ ] Settings page (freshness days, thresholds)
- [ ] **Deliverable**: Dashboard + reports functional

### Sprint 6 (Weeks 11-12) — Testing & Polish
- [ ] Unit tests (calculations, stores, utils)
- [ ] Component tests (core forms)
- [ ] E2E tests (critical paths + offline sync)
- [ ] Manual testing on real phone
- [ ] GitHub Actions CI/CD pipeline
- [ ] Lighthouse audit + PWA validation
- [ ] Final deploy to `quackmanager.web.app`
- [ ] **Deliverable**: Production-ready QuackManager 🎉

## Estimated Infrastructure Costs
| During Development | Monthly Cost |
|---|---|
| Firebase (free tier) | **$0** |
| GitHub (free) | **$0** |
| Domain (free subdomain) | **$0** |
| **Total** | **$0** |

## Estimated Complexity
| Aspect | Rating |
|---|---|
| Frontend complexity | 🟢 **Low-Moderate** — standard React forms + lists |
| Offline sync complexity | 🟡 **Moderate** — custom sync engine is the hardest part |
| Database complexity | 🟢 **Low** — straightforward document schema |
| PWA complexity | 🟢 **Low** — vite-plugin-pwa handles most of it |
| Overall project complexity | 🟢 **Low-Moderate** — perfect for a solo developer |

## Estimated MVP Build Time
**~8 weeks** (Sprints 1–4) for a functional MVP with all core data entry working offline.
**~12 weeks** (Sprints 1–6) for the complete app with reports, full testing, and deployment.

---

## Recommended AI Coding Workflow
1. **Start each coding session** by reading `project_design.md` to understand the full context
2. **Work sprint by sprint** — build foundation first, then features, then polish
3. **Use GitHub Copilot** for:
   - Generating React components from type definitions
   - Writing Dexie.js queries and Firestore sync logic
   - Creating Tailwind UI from component specs
   - Writing Vitest test cases from requirements
4. **Commit often** — after each working feature, commit with descriptive messages
5. **Deploy early** — set up CI/CD in Sprint 1, deploy to Firebase Hosting immediately

## Recommended Prompts for AI Coding Agents

### Frontend Agent Prompt
> Build the [Feature] module for QuackManager, a duck farm PWA. Use React 18 + TypeScript + Tailwind CSS. All data must be stored in Dexie.js (IndexedDB) with types defined in `src/types/models.ts`. Follow the existing component patterns in `src/components/ui/`. Use Zustand stores from `src/stores/` for UI state. Ensure all forms have large touch targets (48px+), use number inputs for quantities, and support offline entry. Reference `project_design.md` for full context.

### Sync/Backend Agent Prompt
> Implement the sync engine for QuackManager between Dexie.js (IndexedDB) and Firestore. Data flow: all writes go to IndexedDB first, then sync to Firestore when online. Handle offline queue, conflict resolution (last-write-wins), sync status tracking, and automatic sync on connectivity change. Use the `src/types/models.ts` types. Reference `project_design.md` for the data model.

### QA Agent Prompt
> Write Vitest tests for QuackManager. Focus on: calculation utilities (P&L, cost-per-duck), Zustand stores, and core form components. Use React Testing Library for component tests. Reference `project_design.md` Phase 5 for the test plan. Run with `vitest run`.

### DevOps Agent Prompt
> Set up the GitHub Actions CI/CD pipeline for QuackManager to deploy to Firebase Hosting. Configure: tsc type check, vitest tests, eslint, vite build, and Firebase deploy on push to main. Use the Firebase hosting-deploy action with service account from GitHub Secrets. Reference `project_design.md` Phase 6 for the full workflow.

---

> **Project planning completed successfully.** 🎉

## Summary
| Area | Decision |
|---|---|
| **Stack** | React + Vite + TypeScript + Tailwind + Firebase |
| **Deployment** | `quackmanager.web.app` via GitHub Actions → Firebase Hosting |
| **Scalability** | Handles 100–500 ducks on free tier; easily scales |
| **Complexity** | Low-Moderate — ideal for solo development |
| **MVP Build Time** | ~8 weeks (core) / ~12 weeks (complete) |
| **Monthly Cost** | **$0** — completely free 🎉 |
