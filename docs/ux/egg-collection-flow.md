# Egg Collection — User Flow & Interaction Specification

## Overview
The egg collection flow lets farm workers quickly record how many eggs were collected from each duck house every day. Designed for **speed, one-hand use, and offline reliability**.

---

## Flow Diagram

```
[Dashboard]
     |
     | Tap "Record Eggs" (big CTA button)
     ▼
[Egg Collection Form]
     ├─────────────────────────────────────────────┐
     │  • Date: [Auto-filled today ▲ YYYY-MM-DD ▼]│
     │  • Flock/House: [House A ▼]                 │
     │  • Egg Count:  [−] [  127  ] [+]            │
     │  • Grade (opt): [All] [Broken] [Dirty]      │
     │  • Notes (opt): [_____________________]     │
     │                                             │
     │  [ 💾 Save Eggs ]                           │
     ├─────────────────────────────────────────────┘
     |
     | Tap "Save"
     ▼
[Success Toast + Haptic]
     |
     | Option A: "Record Another" → Clear form
     | Option B: "Back to Dashboard" → See updated count
```

---

## Screen-by-Screen Specification

### 1. Dashboard — "Record Eggs" CTA

```
┌──────────────────────────┐
│ 🔒 Today's Summary       │
│ ┌──────────────────────┐ │
│ │ 🥚 Today's Eggs      │ │
│ │       127            │ │
│ │ [Record Eggs →]      │ │
│ └──────────────────────┘ │
└──────────────────────────┘
```

| Element | Spec |
|---------|------|
| **Quick action card** | Shows today's egg count (or "0" if none recorded) |
| **CTA button** | Full-width, primary color (`bg-primary`), egg emoji icon, "Record Eggs" text |
| **Tap target** | 56px minimum height |
| **What shows** | If today has records, show count. If not, show "—" |
| **Navigation** | Hash route `#/production?action=record-eggs` |

### 2. Egg Collection Form

```
┌──────────────────────────────┐
│ ← Back          Record Eggs  │ ← Header
│                              │
│ Date                         │
│ ┌──────────────────────────┐ │
│ │ 📅 2024-01-15        ▼  │ │ ← Date picker, auto-filled
│ └──────────────────────────┘ │
│                              │
│ Flock / House                │
│ ┌──────────────────────────┐ │
│ │ House A              ▼  │ │ ← Dropdown selector
│ └──────────────────────────┘ │
│                              │
│ Egg Count                    │
│     ┌────┐                   │
│  [-] │ 127│ [+]              │ ← Large stepper (+/- 48px)
│     └────┘                   │
│                              │
│ Grade (optional)             │
│ ○ All  ○ Broken  ○ Dirty    │ ← Radio chips
│                              │
│ Notes (optional)             │
│ ┌──────────────────────────┐ │
│ │ Few extra-small today    │ │ ← Plain text (small font)
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 💾 Save Egg Collection  │ │ ← Primary button, full-width
│ └──────────────────────────┘ │
│                              │
│ 🕐 Last 7 Days:              │
│ • Jan 14: 132 eggs           │ ← Quick reference
│ • Jan 13: 118 eggs           │
│ • Jan 12: 125 eggs           │
└──────────────────────────────┘
```

#### Form Behaviors

| Behavior | Rule |
|----------|------|
| **Date default** | Always today's date. User can change for back-dated entries. |
| **Count default** | 0 or last-remembered count for this flock (configurable) |
| **Stepper step** | ±1 by default, ±10 on long-press/hold |
| **Stepper min/max** | 0 / 9999 (practical max for any duck house) |
| **Stepper long-press** | After 500ms hold, increment by 10 every 200ms |
| **Validation** | Count must be ≥ 0; date cannot be in the future |
| **Save trigger** | Tap "Save" button (not auto-save — intentional commit) |

### 3. Save Success

```
┌──────────────────────────────┐
│                              │
│        ✅  Saved!            │ ← Toast notification
│     127 eggs recorded        │    3-second auto-dismiss
│                              │
│  ┌────────────────────────┐  │
│  │ 📝 Record Another      │  │ ← CTA: clear form, keep date
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │ 🏠 Back to Dashboard   │  │ ← CTA: go to Dashboard
│  └────────────────────────┘  │
│                              │
└──────────────────────────────┘
```

| Element | Spec |
|---------|------|
| **Toast** | Success checkmark, count summary, auto-dismiss 3s |
| **Haptic feedback** | Short vibration on supported devices |
| **"Record Another"** | Clears count, keeps date + flock selection |
| **"Back to Dashboard"** | Navigates to `#/` |

---

## Data Model (already defined in `src/types/models.ts`)

```typescript
interface EggCollection {
  id?: number;           // Auto-increment (Dexie)
  date: string;          // YYYY-MM-DD
  flockId: string;       // "house-a" | "house-b" | etc.
  totalEggs: number;     // Total collected
  gradeBreakdown?: {     // Optional breakdown
    all: number;
    broken: number;
    dirty: number;
  };
  notes?: string;
  createdAt: string;     // ISO timestamp
  syncedAt?: string;     // ISO timestamp when synced to Firestore
}
```

**Validation rules**:
- `date` + `flockId` must be unique (one entry per flock per day)
- `totalEggs` must be >= 0
- If `gradeBreakdown` provided, sum of breakdown must equal `totalEggs`
- `date` cannot be in the future

---

## Design Principles

### 1. Mobile-First, Thumb Zone
- All interactive elements placed in the **bottom 60%** of the screen (thumb-reachable)
- Primary action button at the **bottom** of the form
- Header controls (back, title) at the top for reference only

### 2. Generous Touch Targets
- All buttons and steppers: **minimum 48×48px** (`min-h-touch`, `min-w-touch`)
- Buttons have **16px internal padding** minimum
- 12px gap between interactive elements to prevent mis-taps

### 3. Visual Hierarchy
- Egg count is the **hero element** — largest font on the page (36px+)
- Stepper buttons are secondary in visual weight
- Optional fields (grade, notes) visually deemphasized with smaller labels and muted colors

### 4. Offline-First
- Form saves to **IndexedDB (Dexie.js)** instantly — no network required
- "Save" button never shows a loading spinner
- Background sync happens silently; synced status shown globally via SyncIndicator

### 5. Error Prevention
- **Prevent double-entry**: If today's date + flock already exists, show existing entry for editing instead of creating new
- **Large confirmation**: Count shown prominently before save
- **No accidental saves**: Require explicit tap on "Save" button

### 6. Accessibility
- All interactive elements have ARIA labels
- Color is never the only indicator (use icons + text)
- Touch targets meet WCAG 2.1 AA (9.6mm / 48px minimum)
- Form fields follow logical tab order
- Error messages are spoken by screen readers

---

## States

| State | What User Sees |
|-------|----------------|
| **Loading** | Skeleton placeholder (grey bars in shape of form fields) |
| **Empty (no entries today)** | "No eggs recorded today" + prominent Record button |
| **Has entries today** | Egg count shown on Dashboard card + form pre-filled for editing |
| **Offline** | Same as online — form works identically. SyncIndicator shows offline status. |
| **Error on save** | Toast with error message, data preserved in form |
| **Duplicate flock+date** | Show existing entry for editing; explain "You already recorded eggs for this flock today" |

---

## Accessibility Checklist

- [ ] All form fields have `<label>` elements
- [ ] Stepper buttons have `aria-label="Increase count"` / `aria-label="Decrease count"`
- [ ] Current count displayed in `aria-live="polite"` region
- [ ] Error messages use `role="alert"`
- [ ] Touch targets ≥ 48×48 CSS pixels
- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Form can be completed using only TalkBack/VoiceOver
- [ ] Toast notifications are announced by screen readers
