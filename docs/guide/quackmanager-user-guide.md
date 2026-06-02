# QuackManager User Guide

**What is QuackManager?**: A mobile-first app for tracking your duck farm's daily operations — egg production, sales, expenses, and feed inventory.

**Who is this for?**: Duck farm owner-operators managing 100–500 ducks. No technical experience required.

**Time to complete basic setup**: 5 minutes to install and sign in.

---

## Getting Started

### Prerequisites

- A smartphone (Android or iPhone) with internet access for first-time sign-in
- A Google account (Gmail) for authentication
- The app works **offline** after the first sign-in

### First Steps

1. **Open the app**: Navigate to `https://duck-inventory-system.firebaseapp.com` in Chrome or Safari
2. **Install to your home screen** (recommended):
   - **Android (Chrome)**: Tap the install banner or menu → "Add to Home screen"
   - **iPhone (Safari)**: Tap the Share icon → "Add to Home Screen"
3. **Sign in**: Tap the blue **"Sign in with Google"** button and choose your Google account
4. **You're in!**: You'll see the Dashboard with today's summary

> **Note**: You need internet for the first sign-in. After that, the app works completely offline.

---

## Common Workflows

### Recording Daily Egg Collection

**Goal**: Record how many eggs you collected this morning.

1. Open the app → you're on the **Dashboard**
2. Tap **"Record Eggs"** (the big button under Quick Actions)
3. The date is automatically set to today
4. Tap the **+** button to set your egg count
   - Tap and hold **+** to count up faster (increases by 10 every 0.2 seconds)
   - Tap **−** to decrease if you overshoot
5. (Optional) Add a note, like *"Few extra-small today"*
6. Tap **"Save Egg Collection"** — you'll see a confirmation screen
7. Tap **"Record Another"** to continue, or **"Back to Dashboard"** to return home

**Tips**:
- The egg count shows large and bold — easy to read at a glance
- If you need to edit today's entry, just tap Record Eggs again — it will pre-fill your existing count
- Each day can have only one egg collection entry (it updates, not duplicates)

### Recording a Sale

**Goal**: Log an egg or duck sale.

> **Note**: This feature is coming in a future update. Placeholder page shown for now.

1. Tap the **Sales** tab (💰 icon) in the bottom navigation
2. Fill in the sale details (quantity, price, customer)
3. Tap **Save**

### Recording an Expense

**Goal**: Track a farm expense like feed, medicine, or labor.

> **Note**: This feature is coming in a future update. Placeholder page shown for now.

1. Tap the **Expenses** tab (📋 icon) in the bottom navigation
2. Select a category (Labor, Medicine, Transport, Electricity, Maintenance, or Other)
3. Enter the amount and description
4. Tap **Save**

### Checking Your Dashboard

**Goal**: See today's farm performance at a glance.

The Dashboard shows four summary cards:

| Card | What it shows | Color |
|------|---------------|-------|
| 🥚 **Eggs Today** | Total eggs collected today | Yellow |
| 💰 **Sales Today** | Total revenue from sales | Green |
| 📋 **Expenses** | Total costs for today | Red |
| 📈 **Profit** | Revenue minus expenses | Blue |

Below the cards, you'll find **Quick Actions** — one-tap shortcuts to your most common tasks.

---

## Understanding Sync

QuackManager works **offline-first**. Here's what that means:

### How Sync Works

1. All data you enter is saved **instantly** on your phone (IndexedDB)
2. When you have internet, the app **automatically syncs** your data to the cloud (Firestore)
3. If you lose internet, you can keep working — data queues up locally
4. When internet returns, everything syncs in the background

### Sync Status Indicator

Look at the top-right corner of the app header:

| Indicator | What it means |
|-----------|---------------|
| 🟢 **Synced** | All data saved to the cloud |
| 🟡 **Syncing...** | Uploading pending data |
| 🟡 **Offline** | No internet — working offline |

### Manual Sync

Syncing happens automatically, so you rarely need to think about it. The app:
- Syncs when you come back online
- Syncs every 5 minutes while active
- Syncs on first load

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| **Can't sign in** | Make sure you have an internet connection. The "Sign in with Google" button requires internet on first use. |
| **App won't load** | Check that you're using a supported browser (Chrome on Android, Safari on iPhone). Clear your browser cache if problems persist. |
| **Data not showing** | Pull down on the screen to refresh. If offline, data will appear once you reconnect. |
| **Sync indicator stuck on "Syncing..."** | Check your internet connection. If the issue persists, close and reopen the app. |
| **Egg count won't go below 0** | That's by design — egg counts can't be negative. |

---

## FAQs

**Q: Do I need internet to use the app?**
A: Only for the first-time sign-in. After that, all features work offline. Sync happens automatically when you reconnect.

**Q: Is my data safe?**
A: Yes. Data is stored on your phone (IndexedDB) and in the cloud (Firebase Firestore). Only you can access your data — sign-in is required via your Google account.

**Q: What if I lose my phone?**
A: Your data is synced to the cloud. Simply sign in on your new phone, and all your data will be restored.

**Q: Can multiple people use the same account?**
A: The app is designed for a single farm owner-operator. Multiple users sharing one Google account will share the same data.

**Q: How do I update my egg count if I made a mistake?**
A: Just record eggs again for the same day. The app will update the existing entry instead of creating a duplicate.

---

## Additional Resources

- [Architecture Overview](../architecture/overview.md) — Technical deep-dive
- [Developer Onboarding](developer-onboarding.md) — For developers contributing to the project
- [Project Design Document](../../project_design.md) — Full product specification
