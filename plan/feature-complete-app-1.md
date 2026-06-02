---
goal: Complete All Missing App Features for QuackManager Duck Farm PWA
version: 1.0
date_created: 2026-06-02
status: 'Completed'
tags: feature, mvp-completion
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

Implementation plan to complete all missing features for the QuackManager duck farm management PWA. The app already has auth, navigation, dashboard, egg collection, database layer, sync engine skeleton, calculations, stores, and tests. This plan covers building the remaining feature pages, expanding the database schema, adding UI components, and integrating the alert system.

## 1. Requirements & Constraints

- **REQ-001**: All pages must follow existing patterns (Zustand stores, Dexie.js, Tailwind, TypeScript)
- **REQ-002**: All data entry must work offline-first (writes to IndexedDB, sync queue)
- **REQ-003**: Touch targets ≥ 48px, mobile-first responsive design
- **REQ-004**: Use `noUnusedLocals` and `noUnusedParameters` strict TS — no unused imports/vars
- **REQ-005**: Material Symbols for all icons
- **CON-001**: No backend server — Firebase only
- **CON-002**: Single-user app — no multi-tenant concerns
- **PAT-001**: Feature-based folder structure with `__tests__` subfolder
- **PAT-002**: Container/presenter pattern — pages handle data logic, components receive props

## 2. Implementation Steps

### Implementation Phase 1: Expand Database & Sync

- GOAL-001: Add missing Dexie tables and sync engine support for all collections

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-001 | Add incubationBatches, ducklingHatches, duckSales, feedUsageLogs, feedStock, recurringExpenseTemplates, dailyLogs, customers, farmSettings tables to database.ts | ✅ | 2026-06-02 |
| TASK-002 | Add missing collections to sync engine TABLE_TO_COLLECTION_MAP | ✅ | 2026-06-02 |
| TASK-003 | Create ExpenseForm reusable component | ✅ | 2026-06-02 |

### Implementation Phase 2: UI Components

- GOAL-002: Create shared UI components referenced by feature pages

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-004 | Create EmptyState component | ✅ | 2026-06-02 |
| TASK-005 | Create LoadingSpinner component | ✅ | 2026-06-02 |
| TASK-006 | Create ConfirmDialog component | ✅ | 2026-06-02 |
| TASK-007 | Create AlertBanner component | ✅ | 2026-06-02 |
| TASK-008 | Create Badge component | ✅ | 2026-06-02 |

### Implementation Phase 3: Data Hooks

- GOAL-003: Create custom hooks for each feature domain

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-009 | Create useExpenses hook | ✅ | 2026-06-02 |
| TASK-010 | Create useSales hook (egg sales, duck sales) | ✅ | 2026-06-02 |
| TASK-011 | Create useFeedInventory hook | ✅ | 2026-06-02 |
| TASK-012 | Create useProduction hook (incubation, hatches) | ✅ | 2026-06-02 |
| TASK-013 | Create useDailyLog hook | ✅ | 2026-06-02 |
| TASK-014 | Create useAlerts hook | ✅ | 2026-06-02 |

### Implementation Phase 4: Feature Pages

- GOAL-004: Build all missing feature pages

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-015 | Build SalesPage with tabs (Egg Sales, Duck Sales, Feed, Customers) | ✅ | 2026-06-02 |
| TASK-016 | Build ExpensesPage with form, list, recurring, category picker | ✅ | 2026-06-02 |
| TASK-017 | Build ReportsPage with P&L dashboard and daily activity log | ✅ | 2026-06-02 |
| TASK-018 | Build SettingsPage (farm settings, sync, thresholds) | ✅ | 2026-06-02 |
| TASK-019 | Build Incubation tab content (list + form) | ✅ | 2026-06-02 |
| TASK-020 | Build Duckling hatch tab content (list + form) | ✅ | 2026-06-02 |

### Implementation Phase 5: Alert System

- GOAL-005: Integrate alert generation and display

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-021 | Build alert generation logic (low feed, hatch reminders) | ✅ | 2026-06-02 |
| TASK-022 | Wire alerts into Dashboard and AppShell | ✅ | 2026-06-02 |

### Implementation Phase 6: Testing & Polish

- GOAL-006: Verify all features work and tests pass

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-023 | Add tests for new stores and calculations | ✅ | 2026-06-02 |
| TASK-024 | Run TypeScript check and fix errors | ✅ | 2026-06-02 |
| TASK-025 | Run test suite and verify | ✅ | 2026-06-02 |

## 3. Alternatives

- **ALT-001**: Using React Context instead of Zustand — rejected because Zustand's simplicity and shallow equality matching suits this scale better
- **ALT-002**: Using Firebase SDK directly instead of sync engine — rejected because offline-first requires IndexedDB as source of truth

## 4. Dependencies

- **DEP-001**: Dexie.js for IndexedDB access
- **DEP-002**: Zustand for UI state management
- **DEP-003**: Firebase Firestore for cloud sync
- **DEP-004**: Material Symbols for icons (already loaded in index.html)

## 5. Files

- **FILE-001**: `src/db/database.ts` — expand Dexie schema
- **FILE-002**: `src/sync/syncEngine.ts` — expand collection map
- **FILE-003**: `src/components/ui/EmptyState.tsx` — new
- **FILE-004**: `src/components/ui/LoadingSpinner.tsx` — new
- **FILE-005**: `src/components/ui/ConfirmDialog.tsx` — new
- **FILE-006**: `src/components/ui/AlertBanner.tsx` — new
- **FILE-007**: `src/components/ui/Badge.tsx` — new
- **FILE-008**: `src/hooks/useExpenses.ts` — new
- **FILE-009**: `src/hooks/useSales.ts` — new
- **FILE-010**: `src/hooks/useFeedInventory.ts` — new
- **FILE-011**: `src/hooks/useProduction.ts` — new
- **FILE-012**: `src/hooks/useDailyLog.ts` — new
- **FILE-013**: `src/hooks/useAlerts.ts` — new
- **FILE-014**: `src/features/sales/SalesPage.tsx` — rebuild
- **FILE-015**: `src/features/expenses/ExpensesPage.tsx` — rebuild
- **FILE-016**: `src/features/reports/ReportsPage.tsx` — rebuild
- **FILE-017**: `src/features/settings/SettingsPage.tsx` — rebuild
- **FILE-018**: `src/features/dashboard/DashboardPage.tsx` — update with real data
- **FILE-019**: `src/App.tsx` — add profit-loss route
- **FILE-020**: `src/lib/calculations.ts` — add daily log aggregation

## 6. Testing

- **TEST-001**: Verify Sales page renders all tabs and forms work
- **TEST-002**: Verify Expenses page CRUD operations
- **TEST-003**: Verify Reports page shows P&L calculations
- **TEST-004**: Verify Settings page persists values
- **TEST-005**: Verify TypeScript compiles with no errors
- **TEST-006**: Run existing vitest suite — all pass

## 7. Risks & Assumptions

- **RISK-001**: Dexie schema changes may break existing data — DB_VERSION increment handles this
- **ASSUMPTION-001**: Firebase config is already set up and working
- **ASSUMPTION-002**: Material Symbols are loaded globally via index.html link
