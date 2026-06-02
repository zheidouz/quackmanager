# User Journey: Daily Egg Collection

## User Persona
- **Who**: Duck farm owner-operator
- **Goal**: Record this morning's egg count quickly and move on to next task
- **Context**: Early morning, standing in the duck house, phone in one hand, may be wearing gloves
- **Success Metric**: Egg count recorded in < 10 seconds with no errors

---

## Journey Stages

### Stage 1: Open App
| Element | Description |
|---------|-------------|
| **What user is doing** | Pulls phone out of pocket, taps QuackManager icon |
| **What user is thinking** | "I need to log today's eggs quickly" |
| **What user is feeling** | 😊 Routine — this is a daily habit |
| **Pain points** | Typing a PIN or password takes too long; Google Sign-In remembered so no auth needed |
| **Opportunity** | App opens directly to Dashboard; big "Record Eggs" button is front and center |

### Stage 2: Navigate to Egg Entry
| Element | Description |
|---------|-------------|
| **What user is doing** | Taps "Record Eggs" quick action on Dashboard — or taps Production tab |
| **What user is thinking** | "Let me get this done" |
| **What user is feeling** | 😊 Confident — knows exactly where to go |
| **Pain points** | None if button is prominent on Dashboard |
| **Opportunity** | Big, colorful CTA button right on home screen with egg icon and today's count already shown |

### Stage 3: Enter Egg Count
| Element | Description |
|---------|-------------|
| **What user is doing** | Uses large +/- stepper buttons to set egg count. Date auto-filled to today. |
| **What user is thinking** | "We got 127 eggs this morning from House A... tap tap tap... 127. Done." |
| **What user is feeling** | 😊 Speedy — large buttons are easy to tap even with gloves |
| **Pain points** | Typing numbers manually is hard with cold/wet hands; small buttons are frustrating |
| **Opportunity** | Large number stepper (48px+ buttons), auto-saves, minimal taps required |

### Stage 4: Confirm & Save
| Element | Description |
|---------|-------------|
| **What user is doing** | Taps the green "Save" button. Gets instant visual + haptic confirmation. |
| **What user is thinking** | "Saved. Good, I can see it on the list. On to the next task." |
| **What user is feeling** | 😊 Satisfied — quick confirmation, no doubt it was saved |
| **Pain points** | Waiting for a spinner/"syncing..." message is confusing if offline |
| **Opportunity** | Instant save to IndexedDB (no spinner). Sync indicator updates silently in background. |

### Stage 5: Verify on Dashboard
| Element | Description |
|---------|-------------|
| **What user is doing** | Glances at Dashboard summary card showing today's egg count |
| **What user is thinking** | "127 eggs — confirmed. Looks right." |
| **What user is feeling** | 😊 Reassured — data is visible and correct |
| **Pain points** | None if Dashboard updates immediately |
| **Opportunity** | Today's egg count shows on the Dashboard card immediately after save |

---

## Emotional Journey Map

```
😊 Happy  |                    ●──●──●──●
🙂 Okay   |       ●
😐 Neutral|  ●
😟 Worried|                    (offline sync concern)
😰 Stressed|
          |_____________________________________
            Open    Navigate   Enter    Save   Verify
```

## Key Takeaways for UI Design

1. **Speed is everything** — Record eggs in < 10 seconds, ideally < 5
2. **No manual typing** — Number steppers with +/- buttons
3. **Auto-fill today's date** — User shouldn't need to set the date
4. **Instant save** — No loading spinners (IndexedDB is instant)
5. **Dashboard visibility** — Show today's count on home screen immediately
6. **One-handed use** — All controls in thumb-reachable area
7. **Error forgiveness** — Easy to edit or delete a wrong entry
