---
goal: Add Duck Inventory Tracking — live duck count, mortality, age cohorts, and dashboard integration
version: 1.0
date_created: 2026-06-02
status: 'Completed'
tags: feature, duck-tracking, inventory
---

# Introduction

![Status: Completed](https://img.shields.io/badge/status-Completed-brightgreen)

Implementation plan to add comprehensive duck inventory tracking to QuackManager. Currently the app tracks duckling hatches and duck sales but has no concept of **current live duck inventory** — how many ducks are alive on the farm, categorized by age group, or mortality events. This plan adds data models, database tables, hooks, UI components, and dashboard integration for full duck lifecycle tracking.

## 1. Requirements & Constraints

- **REQ-001**: Track current live duck count derived from: hatches − (sales + mortality)
- **REQ-002**: Support duck age cohorts/groups: `duckling` (0–2 weeks), `grower` (2–8 weeks), `adult` (8+ weeks)
- **REQ-003**: Record mortality events (date, quantity, cause category, notes)
- **REQ-004**: Show current duck inventory on the Dashboard with age-group breakdown
- **REQ-005**: A Mortality tab in Production page to record deaths
- **REQ-006**: All data must be offline-first (Dexie.js → Firestore sync)
- **REQ-007**: Touch targets ≥ 48px, mobile-first, Material Symbols icons
- **CON-001**: Must not break existing duckling hatch or duck sale features
- **CON-002**: Must work with existing sync engine pattern (TABLE_TO_COLLECTION_MAP)
- **PAT-001**: Follow existing patterns: types → db schema → hook → page component
- **PAT-002**: Feature must be detectable via `noUnusedLocals`/`noUnusedParameters` strict TS

## 2. Implementation Steps

### Implementation Phase 1: Data Model & Database

- GOAL-001: Add DuckMortality type, DuckInventory snapshot type, age group enum to models; add duckInventory and duckMortality tables to Dexie

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-001 | Add `DuckAgeGroup` type, `DuckMortality` interface, and `DuckInventorySnapshot` interface to `src/types/models.ts` | ✅ | 2026-06-02 |
| TASK-002 | Add `duckMortality` and `duckInventory` tables to `src/db/database.ts` Dexie schema | ✅ | 2026-06-02 |
| TASK-003 | Add `DUCK_MORTALITY` and `DUCK_INVENTORY` constants to `src/firebase/firestore.ts` COLLECTIONS object | ✅ | 2026-06-02 |
| TASK-004 | Add `duckMortality` and `duckInventory` entries to `TABLE_TO_COLLECTION_MAP` in `src/sync/syncEngine.ts` | ✅ | 2026-06-02 |
| TASK-005 | Add `MORTALITY_CAUSES` constant to `src/types/models.ts` for categories | ✅ | 2026-06-02 |
| TASK-006 | Add `DUCK_AGE_GROUP_LABELS` constant to `src/types/models.ts` | ✅ | 2026-06-02 |

### Implementation Phase 2: Business Logic & Calculations

- GOAL-002: Add calculation functions for duck inventory math and create the useDuckInventory hook

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-007 | Add `calculateDuckInventory()` function to `src/lib/calculations.ts` that computes current inventory from hatches − (sales + mortality) | ✅ | 2026-06-02 |
| TASK-008 | Add `classifyDuckAgeGroup()` function to determine which cohort a duck belongs to based on hatch date | ✅ | 2026-06-02 |
| TASK-009 | Create `src/hooks/useDuckInventory.ts` with live queries for duck mortality, inventory calculation, and CRUD operations | ✅ | 2026-06-02 |

### Implementation Phase 3: UI — Mortality Tab

- GOAL-003: Add a Mortality tab to the Production page for recording duck deaths

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-010 | Create `src/features/production/MortalityTab.tsx` with form (date, quantity, cause, notes) and list | ✅ | 2026-06-02 |
| TASK-011 | Add `mortality` tab to `src/features/production/ProductionPage.tsx` tab definitions | ✅ | 2026-06-02 |

### Implementation Phase 4: Dashboard Integration

- GOAL-004: Show live duck count and age-group breakdown on the Dashboard

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-012 | Add duck inventory summary card to `src/features/dashboard/DashboardPage.tsx` showing total live ducks | ✅ | 2026-06-02 |
| TASK-013 | Add "Duck Inventory" quick action button linking to production ducklings tab | ✅ | 2026-06-02 |

### Implementation Phase 5: Firestore Security Rules

- GOAL-005: Add security rules for the new collections

| Task     | Description | Completed | Date |
| -------- | ----------- | --------- | ---- |
| TASK-014 | Add `match /duckMortality/{docId}` rule block to `firestore.rules` | ✅ | 2026-06-02 |
| TASK-015 | Add `match /duckInventory/{docId}` rule block to `firestore.rules` | ✅ | 2026-06-02 |

## 3. Alternatives

- **ALT-001**: Compute inventory on the fly from raw data every time — rejected because it's O(n) and slow for large datasets; a cached snapshot + incremental updates is preferred
- **ALT-002**: Store age group as a computed field — rejected because age changes over time; compute based on hatch date vs current date instead
- **ALT-003**: Merge mortality into DuckSale with a `type: 'sale' | 'death'` discriminator — rejected because mortality has different fields (cause category, no revenue) and mixing them would complicate sales reporting

## 4. Dependencies

- **DEP-001**: Existing `DucklingHatch` and `DuckSale` types and tables (unchanged)
- **DEP-002**: Existing sync engine pattern for new collections
- **DEP-003**: Existing ProductionPage tab system for Mortality tab

## 5. Files

- **FILE-001**: `src/types/models.ts` — add `DuckAgeGroup`, `DuckMortality`, `DuckInventorySnapshot`, `MORTALITY_CAUSES`, `DUCK_AGE_GROUP_LABELS`
- **FILE-002**: `src/db/database.ts` — add `duckMortality` and `duckInventory` tables
- **FILE-003**: `src/firebase/firestore.ts` — add collection name constants
- **FILE-004**: `src/sync/syncEngine.ts` — add table-to-collection mapping entries
- **FILE-005**: `src/lib/calculations.ts` — add `calculateDuckInventory()` and `classifyDuckAgeGroup()`
- **FILE-006**: `src/hooks/useDuckInventory.ts` — new hook with live queries + CRUD
- **FILE-007**: `src/features/production/MortalityTab.tsx` — new mortality form/list component
- **FILE-008**: `src/features/production/ProductionPage.tsx` — add mortality tab
- **FILE-009**: `src/features/dashboard/DashboardPage.tsx` — add duck inventory card
- **FILE-010**: `firestore.rules` — add security rules for new collections
- **FILE-011**: `src/lib/__tests__/calculations.test.ts` — add duck inventory calculation tests
- **FILE-012**: `src/features/production/__tests__/ProductionPage.test.tsx` — update mocks

## 6. Testing

- **TEST-001**: Unit test `calculateDuckInventory()` — verify hatches − sales − mortality = current count
- **TEST-002**: Unit test `calculateDuckInventory()` — handles empty arrays
- **TEST-003**: Unit test `calculateDuckInventory()` — handles zero sales/mortality
- **TEST-004**: Unit test `classifyDuckAgeGroup()` — duckling (< 14 days), grower (14–56 days), adult (57+ days)
- **TEST-005**: Unit test `classifyDuckAgeGroup()` — boundary dates exactly at thresholds
- **TEST-006**: TypeScript compiles with no errors (`tsc --noEmit`)
- **TEST-007**: Existing test suite still passes (95 tests)

## 7. Risks & Assumptions

- **RISK-001**: Age group classification depends on knowing the hatch date for each duck — assumed ducklings come from tracked hatches with known dates
- **RISK-002**: Duck inventory snapshot is a derived value — if hatch/sale/mortality data is deleted, the snapshot may be stale until recalculated
- **ASSUMPTION-001**: All live ducks on the farm originated from tracked hatches (no external purchases of adult ducks — if added later, a `DuckPurchase` type would be needed)
- **ASSUMPTION-002**: Mortality will be relatively infrequent events (< 5% of flock per month)

## 8. Related Specifications / Further Reading

[project_design.md](../project_design.md) — Phase 1 Core Features (FR-04, FR-05)
[feature-complete-app-1.md](./feature-complete-app-1.md) — Previous implementation plan
