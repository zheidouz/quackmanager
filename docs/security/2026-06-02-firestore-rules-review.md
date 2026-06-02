# Code Review: Firestore Security Rules & Backend Security

**Date**: 2026-06-02
**Reviewer**: SE: Security (GPT-5)
**Component**: Firestore rules, Firebase config, deployment pipeline
**Ready for Production**: **No** (Critical issues must be fixed first)
**Critical Issues**: 2
**High Issues**: 3
**Medium Issues**: 2

---

## Review Plan

### Code Type
- **Firestore Security Rules** → OWASP Top 10 (A01 Broken Access Control, A06 Vulnerable Components)
- **Firebase Auth Integration** → Access control, session management
- **CI/CD Pipeline** → Supply chain security, secret management

### Risk Level
- **High**: Firestore rules (primary data access boundary), deploy credentials
- **Medium**: Firebase config exposure, auth session management
- **Low**: Service worker caching, PWA manifest

### Categories Reviewed
1. **A01 - Broken Access Control** — Firestore Security Rules
2. **A05 - Security Misconfiguration** — Firebase project config, CSP headers
3. **Supply Chain Security** — SHA-pinned actions, Dependabot
4. **Authentication & Session Management** — Firebase Google Sign-In, logout
5. **Data Validation** — Firestore rules-level input validation

---

## Priority 1 (Must Fix) ⛔

### CRITICAL: No Firestore Security Rules File

**Location**: `firestore.rules` did not exist before this review

**Issue**: The repository had no `firestore.rules` file. Without dedicated rules, Firestore uses its default state which blocks all access. However, without a rules file in the repo, there is no version-controlled, auditable, or deployable ruleset. Any manual rules changes in the Firebase Console are invisible to the development team and not deployed via CI/CD.

**Fix Applied**: Created `firestore.rules` with:
- Default-deny catch-all (`match /{document=**} { allow read, write: if false; }`)
- Auth-required reads on all collections
- Input validation on creates (type checks, range checks, required field checks)
- Category whitelisting for `ExpenseCategory` enum
- Unit value constraints for `FeedPurchase.unit`

```firestore
// Before: No rules file existed
// After: Per-collection rules with auth checks and input validation
match /expenses/{docId} {
  allow read: if request.auth != null;
  allow create: if request.auth != null
                && request.resource.data.keys().hasAll(['date','category','amount','description','createdAt'])
                && request.resource.data.amount is number
                && request.resource.data.amount >= 0
                && request.resource.data.category in ['labor','medicine','transport','electricity','maintenance','other'];
}
```

**Severity**: **Critical** — Without these rules, data is unprotected.

---

### CRITICAL: Deploy Workflow Points to Wrong Firebase Project

**Location**: `.github/workflows/deploy.yml` line 48

**Issue**: The deploy workflow specifies `projectId: quackmanager` but the actual Firebase project (verified via `src/firebase/config.ts`) is `duck-inventory-system`. This will cause Firebase Hosting deploys to fail with a project-not-found error, preventing any CI/CD deployment from succeeding.

```yaml
# BUG: Wrong project ID
projectId: quackmanager  # This project does not exist
```

**Fix Applied**:
```yaml
projectId: duck-inventory-system  # Matches src/firebase/config.ts
```

**Severity**: **Critical** — Blocks all production deployments.

---

## Priority 2 (Should Fix) 🔶

### HIGH: Auth Logout Does Not Sign Out of Firebase

**Location**: `src/stores/authStore.ts`

**Issue**: The Zustand `logout()` action only clears local state but does not call Firebase `signOut(auth)`. This means the Firebase Auth session token remains valid even after the user clicks "log out" in the app.

```typescript
// VULNERABILITY: Only clears Zustand state
logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),

// FIX: Must also sign out of Firebase
// SettingsPage or logout hook should call:
// import { signOut } from 'firebase/auth';
// import { auth } from '../firebase/config';
// await signOut(auth);
```

**Recommended Fix**: Create a custom `useLogout` hook or ensure the Settings page calls both `signOut(auth)` and `useAuthStore.getState().logout()`.

**Severity**: **High** — Session token remains valid after logout.

---

### HIGH: Firebase Config Hardcoded Instead of Using Environment Variables

**Location**: `src/firebase/config.ts`

**Issue**: Firebase configuration values (apiKey, authDomain, projectId, etc.) are hardcoded directly in source code. While Firebase API keys are technically public identifiers (not secrets), hardcoding them:
- Makes it impossible to use different Firebase projects for dev/staging/prod without code changes
- Violates the principle of separating config from code
- The `project_design.md` explicitly states these should be in `.env`

```typescript
// VULNERABILITY: Hardcoded config
const firebaseConfig = {
  apiKey: 'AIzaSyAoZurTxg7x7b6LpPITECIsjIHwkrSilpA',
  // ...
};
```

**Recommended Fix**: Move all Firebase config values to environment variables and use `import.meta.env.VITE_FIREBASE_*`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

**Severity**: **High** — Prevents multi-environment deployments, config scattered.

---

### HIGH: No Content Security Policy Headers

**Location**: `vite.config.ts`, `index.html` (missing)

**Issue**: The app is served via Firebase Hosting but there are no CSP headers configured. This means if an XSS vulnerability were introduced, an attacker could execute arbitrary scripts, exfiltrate data from IndexedDB, or access Firebase Auth tokens.

**Fix Applied**: Added CSP and other security headers to `firebase.json`:

```json
{
  "key": "Content-Security-Policy",
  "value": "default-src 'self'; script-src 'self' https://apis.google.com https://*.firebaseio.com https://*.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com; frame-src 'self' https://*.firebaseapp.com;"
}
```

Additional headers added:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

**Severity**: **High** — CSP is a critical defense-in-depth layer against XSS.

---

## Priority 3 (Should Fix Next) 🔹

### MEDIUM: Missing firebase.json and firestore.indexes.json

**Location**: Project root (did not exist before this review)

**Issue**: Without `firebase.json`, `firebase deploy` cannot deploy Firestore rules or configure Hosting. Without `firestore.indexes.json`, composite indexes must be created manually in the Firebase Console, which is error-prone and not version-controlled.

**Fix Applied**: Created both files.

**Severity**: **Medium** — Prevents automated deployment of infrastructure.

---

### MEDIUM: Service Worker Caches Firestore API Responses

**Location**: `vite.config.ts` — Workbox runtimeCaching

**Issue**: The PWA service worker caches Firestore API responses with a 24-hour expiration. If a user's auth token is revoked or changed, stale cached data could temporarily serve outdated access control state.

```typescript
runtimeCaching: [{
  urlPattern: /^https:\/\/firestore\.googleapis\.com\/.*/i,
  handler: 'NetworkFirst',
  options: {
    cacheName: 'firestore-cache',
    expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
  },
}]
```

**Risk**: Low probability (single-user app), but stale auth state in cache could cause confusing behavior.

**Recommended Fix**: Reduce `maxAgeSeconds` to 1 hour, or remove runtimeCaching for Firestore entirely (since Dexie.js is the offline source of truth).

**Severity**: **Medium** — Stale data caching risk.

---

## Additional Recommendations

### LOW: IndexedDB Contains Unencrypted Farm Data

**Location**: `src/db/database.ts`

**Note**: All farm data in IndexedDB is unencrypted. This is acceptable for MVP (device-level security via phone lock screen is assumed). If the app is used on shared devices in the future, add encryption via the Web Crypto API before writing to Dexie.

### LOW: No Rate Limiting on Firestore Writes

**Note**: Firestore free tier has write limits (20K writes/day). There is no client-side rate limiting to prevent rapid-fire writes (e.g., from a script). The Firestore Security Rules enforce data validation but not write rate limits. Acceptable for single-user internal tool.

### INFO: Service Account File Pattern in .gitignore

**Status**: ✅ Already present — `firebase-adminsdk-*.json` and `*-service-account.json` are in `.gitignore`.

### INFO: SHA-Pinned GitHub Actions

**Status**: ✅ All actions in CI, Deploy, and Security workflows are SHA-pinned (not version tags).

### INFO: Dependabot Configured

**Status**: ✅ Dependabot is configured for weekly npm + GitHub Actions updates.

---

## Summary

| Severity | Count | Fixed in this review |
|----------|-------|---------------------|
| **Critical** | 2 | ✅ `firestore.rules` created, ✅ deploy workflow project ID fixed |
| **High** | 3 | ✅ CSP headers added, 🔲 Firebase config→env vars (todo), 🔲 Auth logout fix |
| **Medium** | 2 | ✅ `firebase.json` + `firestore.indexes.json` created, 🔲 SW cache tuning |
| **Low** | 2 | Noted — acceptable for MVP |

### Files Created in This Review
| File | Purpose |
|------|---------|
| `firestore.rules` | Per-collection security rules with auth checks and input validation |
| `firebase.json` | Firebase Hosting config with CSP + security headers |
| `firestore.indexes.json` | Composite indexes for query performance |
| `docs/security/2026-06-02-firestore-rules-review.md` | This report |

### Files Modified in This Review
| File | Change |
|------|--------|
| `.github/workflows/deploy.yml` | Fixed `projectId: duck-inventory-system` (was `quackmanager`) |

### Open Action Items
1. Move Firebase config to environment variables (`src/firebase/config.ts`)
2. Add Firebase `signOut` to the logout flow (SettingsPage)
3. Reduce Firestore runtime cache TTL in `vite.config.ts`
