# QuackManager — Architecture Plan

## Executive Summary

QuackManager is a **single-page Progressive Web App (SPA/PWA)** for duck farm management, using React + Vite + TypeScript on the frontend and Firebase (Firestore + Auth + Hosting) as a serverless backend. The architecture follows an **offline-first, modular monolith** pattern. All data writes go to IndexedDB (Dexie.js) first, then sync to Firestore when connectivity is available. The entire app runs at **$0/month** on Firebase free tier, serving the target scale of 100-500 ducks.

---

## 1. Architecture Style Validation

**Recommendation**: [OK] **Modular Monolith** -- current design is correct

| Criteria | Assessment |
|----------|-----------|
| Architecture | SPA with feature-based folder structure -- clean domain boundaries |
| Serverless backend | Firebase eliminates server management -- perfect for solo dev |
| Offline-first | Dexie.js (IndexedDB) as local source of truth + Firestore sync |
| Deployment | Single Firebase Hosting with SPA rewrite |
| **Risk** | Custom sync engine is the most complex component -- needs careful design |

---

## 2. Technology Stack Validation

### Frontend Stack

| Criterion | Score | Notes |
|-----------|-------|-------|
| Team Fit | [OK] High | React + TypeScript widely known |
| Ecosystem | [OK] High | Vast ecosystem, PWA support battle-tested |
| Scalability | [OK] High | Handles target 200 tx/day easily |
| Cost | [OK] Low | Free tools -- no licensing costs |
| Performance | [OK] High | Sub-200KB bundle, Workbox precaching |
| **Verdict** | [OK] Approved | Optimal choice |

### State Management

| Criterion | Score | Notes |
|-----------|-------|-------|
| Zustand (UI) | [OK] High | Lightweight, perfect for transient state |
| Dexie.js (data) | [OK] High | Mature IndexedDB wrapper |
| Separation | [OK] High | Clear boundary -- well-designed |
| **Verdict** | [OK] Approved | Dual-state pattern is clean |

### Backend

| Criterion | Score | Notes |
|-----------|-------|-------|
| Firebase Auth | [OK] High | Google Sign-In -- best UX for single user |
| Firestore | [OK] High | 1GB free, real-time sync |
| Firebase Hosting | [OK] High | CDN, SSL, one-command deploy |
| Vendor Lock-in | [~] Medium | Acceptable for internal tool |
| **Verdict** | [OK] Approved | Right choice for zero-cost serverless |

---

## 3. Security Review

| Concern | Status | Action |
|---------|--------|--------|
| Authentication | [OK] Good | Google Sign-In with Firebase Auth |
| Firestore Rules | [!] Needs work | Add `request.auth != null` rules before first write |
| XSS Protection | [OK] Built-in | React escapes output by default |
| CSP Headers | [!] Missing | Add to firebase.json before production deploy |
| IndexedDB encryption | [!] Acceptable gap | Device lock screen assumed |

---

## 4. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|:----------:|:------:|------------|
| Sync conflicts | Low | Medium | Last-write-wins with timestamps |
| IndexedDB limit reached | Low | High | Firestore is authoritative backup |
| Firebase free tier exceeded | Low | Low | Monitor usage; upgrade to Blaze (~$5/mo) |
| Cache invalidation fails | Medium | Medium | Workbox versioning; test on deploy |
| Browser clears storage | Low | High | Cloud sync prevents data loss |

---

## 5. Architecture Verdict

| Area | Verdict |
|------|:-------:|
| Architecture Style | [OK] Modular Monolith -- correct |
| Frontend (React + Vite + TS) | [OK] Approved |
| State (Zustand + Dexie.js) | [OK] Approved |
| Backend (Firebase) | [OK] Approved |
| Testing (Vitest + RTL + Playwright) | [OK] Approved |
| CI/CD (GitHub Actions) | [OK] Approved |
| Scalability | [OK] Free tier sufficient for MVP |
| Cost | [OK] $0/month |
| Security | [!] Minor gaps -- add Rules + CSP |
| **Overall** | [OK] **Architecture is sound -- proceed with Sprint 1** |

## 6. Required Actions Before Production

1. Add Firestore Security Rules: `allow read, write: if request.auth != null;`
2. Add CSP headers in firebase.json
3. Create ADR-004 (Last-write-wins conflict resolution)
4. Create ADR-005 (Hash routing for PWA)
5. Document sync engine architecture before implementation
6. Add ErrorBoundary wrappers around each feature page
7. Set up `.env` file with Firebase config (excluded from git)

---

> Validated using Project Architecture Planner methodology from [github/awesome-copilot](https://github.com/github/awesome-copilot)
