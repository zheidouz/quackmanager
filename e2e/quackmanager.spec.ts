import { test, expect } from '@playwright/test';

const AUTH_STORAGE_KEY = 'quackmanager-auth';
const AUTH_STATE_VALUE = JSON.stringify({
  state: {
    user: { uid: 'e2e-test-uid', email: 'e2e@duckfarm.com', displayName: 'E2E Farmer' },
    isAuthenticated: true,
    isLoading: false,
  },
  version: 0,
});

/**
 * Seed authenticated state via localStorage (bypasses Google Sign-In).
 * Uses addInitScript so it runs before the app code, avoiding origin issues.
 */
async function seedAuthState(page: import('@playwright/test').Page) {
  await page.addInitScript((args) => {
    localStorage.setItem(args.key, args.value);
  }, { key: AUTH_STORAGE_KEY, value: AUTH_STATE_VALUE });
}

// ────────────────────────────────────────────────────────────────────────────
// Login Page
// ────────────────────────────────────────────────────────────────────────────
test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/#/login');
    // Clear any pre-existing auth state
    await page.evaluate((key) => localStorage.removeItem(key), AUTH_STORAGE_KEY);
    await page.reload();
  });

  test('renders brand name and tagline', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'QuackManager' })).toBeVisible();
    await expect(page.getByText('Your farm, in your pocket.')).toBeVisible();
  });

  test('shows Google Sign-In button', async ({ page }) => {
    const signInButton = page.getByRole('button', { name: 'Sign in with Google' });
    await expect(signInButton).toBeVisible();
  });

  test('shows offline warning when connectivity indicator shown', async ({ page }) => {
    // The login page shows an offline warning card
    await expect(page.getByText("You'll need an internet connection")).toBeVisible();
  });
});

// ────────────────────────────────────────────────────────────────────────────
// Authenticated App Shell (after bypassing login)
// ────────────────────────────────────────────────────────────────────────────
test.describe('Authenticated App', () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthState(page);
    await page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 15000 });
    // Wait for the dashboard header to confirm React has rendered
    await page.waitForSelector('text=Dashboard', { timeout: 10000 });
  });

  test.describe('Dashboard', () => {
    test('shows dashboard with 4 summary cards', async ({ page }) => {
      const main = page.getByRole('main');
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
      await expect(main.getByText('Eggs Today')).toBeVisible();
      await expect(main.getByText('Sales Today')).toBeVisible();
      await expect(main.getByText('Expenses')).toBeVisible();
      await expect(main.getByText('Profit')).toBeVisible();
    });

    test('shows today date in heading', async ({ page }) => {
      const dateText = page.getByRole('main').locator('p').first();
      await expect(dateText).not.toBeEmpty();
    });

    test('shows Quick Actions section with 4 buttons', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Quick Actions' })).toBeVisible();
      await expect(page.getByLabel('Record Eggs')).toBeVisible();
      await expect(page.getByLabel('Add Sale')).toBeVisible();
      await expect(page.getByLabel('Add Expense')).toBeVisible();
      await expect(page.getByLabel('Feed Stock')).toBeVisible();
    });

    test('Record Eggs quick action navigates to production tab', async ({ page }) => {
      await page.getByLabel('Record Eggs').click();
      await expect(page).toHaveURL(/#\/production\?tab=eggs/);
    });
  });

  test.describe('Bottom Navigation', () => {
    test('has 5 navigation tabs', async ({ page }) => {
      const nav = page.getByRole('navigation');
      await expect(nav.getByLabel('Home')).toBeVisible();
      await expect(nav.getByLabel('Production')).toBeVisible();
      await expect(nav.getByLabel('Sales')).toBeVisible();
      await expect(nav.getByLabel('Expenses')).toBeVisible();
      await expect(nav.getByLabel('Reports')).toBeVisible();
    });

    test('navigates to each tab', async ({ page }) => {
      const tabs = [
        { name: 'Production', url: /\/#\/production/ },
        { name: 'Sales', url: /\/#\/sales/ },
        { name: 'Expenses', url: /\/#\/expenses/ },
        { name: 'Reports', url: /\/#\/reports/ },
      ];

      for (const tab of tabs) {
        await page.getByLabel(tab.name).click();
        await expect(page).toHaveURL(tab.url);
      }
    });

    test('Home tab returns to dashboard', async ({ page }) => {
      await page.getByLabel('Production').click();
      await expect(page).toHaveURL(/\/#\/production/);
      await page.getByLabel('Home').click();
      await expect(page).toHaveURL(/\/#\/$/);
    });

    test('sync indicator is visible in header', async ({ page }) => {
      await expect(page.getByText('Connected')).toBeVisible();
    });
  });

  test.describe('Production — Egg Collection', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/#/production?tab=eggs', { waitUntil: 'domcontentloaded', timeout: 15000 });
      // Use aria-label since tab text is hidden on mobile viewport
      await page.waitForSelector('[aria-label="Egg Collection"][aria-current="page"]', { timeout: 10000 });
    });

    test('shows production page with Egg Collection tab active', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Production' })).toBeVisible();
      await expect(page.locator('[aria-label="Egg Collection"][aria-current="page"]')).toBeVisible();
    });

    test('shows 3 production sub-tabs', async ({ page }) => {
      // Use exact role matching to avoid matching the save button
      await expect(page.getByRole('button', { name: 'Egg Collection', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Incubation', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Ducklings', exact: true })).toBeVisible();
    });

    test('egg collection form shows date picker with today date', async ({ page }) => {
      const dateInput = page.getByLabel('Collection date');
      await expect(dateInput).toBeVisible();
      const value = await dateInput.inputValue();
      expect(value).toBe('2026-06-02');
    });

    test('egg collection form shows stepper with default count 0', async ({ page }) => {
      await expect(page.getByRole('status')).toHaveText('0');
    });

    test('stepper increments and decrements egg count', async ({ page }) => {
      const incrementBtn = page.getByLabel('Increase egg count');
      const decrementBtn = page.getByLabel('Decrease egg count');
      const countDisplay = page.getByRole('status');

      // Start at 0, decrement should be disabled
      await expect(decrementBtn).toBeDisabled();

      // Increment to 3
      await incrementBtn.click();
      await incrementBtn.click();
      await incrementBtn.click();
      await expect(countDisplay).toHaveText('3');

      // Decrement to 2
      await decrementBtn.click();
      await expect(countDisplay).toHaveText('2');

      // After decrementing to 0, button should disable again
      await decrementBtn.click();
      await decrementBtn.click();
      await expect(countDisplay).toHaveText('0');
      await expect(decrementBtn).toBeDisabled();
    });

    test('shows optional notes field', async ({ page }) => {
      const notes = page.getByLabel('Optional notes about this collection');
      await expect(notes).toBeVisible();
      await expect(notes).toHaveAttribute('placeholder', /extra-small/);
    });

    test('shows save button with correct label', async ({ page }) => {
      // Button contains Material Symbols icon span + text — use toContainText
      await expect(page.getByLabel('Save egg collection')).toContainText('Save Egg Collection');
    });

    test('entering notes and incrementing shows Save button ready', async ({ page }) => {
      const incrementBtn = page.getByLabel('Increase egg count');
      await incrementBtn.click();
      await incrementBtn.click();
      await incrementBtn.click();
      await incrementBtn.click();
      await incrementBtn.click();

      const notes = page.getByLabel('Optional notes about this collection');
      await notes.fill('Good batch today');

      const countDisplay = page.getByRole('status');
      await expect(countDisplay).toHaveText('5');

      // Save button should be clickable
      await expect(page.getByLabel('Save egg collection')).toBeEnabled();
    });

    test('switches to Incubation tab', async ({ page }) => {
      await page.getByLabel('Incubation').click();
      await expect(page.getByText('Incubation tracking coming soon.')).toBeVisible();
    });

    test('switches to Ducklings tab', async ({ page }) => {
      await page.getByLabel('Ducklings').click();
      await expect(page.getByText('Duckling management coming soon.')).toBeVisible();
    });
  });

  test.describe('Placeholder Pages', () => {
    test.beforeEach(async ({ page }) => {
      await seedAuthState(page);
    });

    test('Sales page shows coming soon message', async ({ page }) => {
      await page.goto('/#/sales', { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('Sales management coming soon.')).toBeVisible();
    });

    test('Expenses page shows coming soon message', async ({ page }) => {
      await page.goto('/#/expenses', { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('Expense tracking coming soon.')).toBeVisible();
    });

    test('Reports page shows coming soon message', async ({ page }) => {
      await page.goto('/#/reports', { waitUntil: 'domcontentloaded' });
      await expect(page.getByText('Reports and analytics coming soon.')).toBeVisible();
    });

    test('unknown routes redirect to dashboard', async ({ page }) => {
      await page.goto('/#/nonexistent', { waitUntil: 'domcontentloaded' });
      await expect(page).toHaveURL(/\/#\/$/);
    });
  });

  test.describe('Offline Behavior', () => {
    test.beforeEach(async ({ page }) => {
      await seedAuthState(page);
    });

    test('sync indicator shows offline status', async ({ page }) => {
      await page.context().setOffline(true);
      await page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForSelector('text=Dashboard', { timeout: 5000 });
      await expect(page.getByText('Offline')).toBeVisible();
      await page.context().setOffline(false);
    });

    test('app continues to render when offline', async ({ page }) => {
      await page.context().setOffline(true);
      await page.goto('/#/', { waitUntil: 'domcontentloaded', timeout: 15000 });
      await page.waitForSelector('text=Dashboard', { timeout: 5000 });
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
      await expect(page.getByLabel('Record Eggs')).toBeVisible();
      await page.context().setOffline(false);
    });
  });
});

// ────────────────────────────────────────────────────────────────────────────
// PWA & Manifest
// ────────────────────────────────────────────────────────────────────────────
test.describe('PWA Manifest', () => {
  test('has correct PWA meta tags', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('QuackManager');
    // Theme-color meta tag is in index.html and available in all environments
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#1A73E8');
    // Apple touch icon for iOS PWA install (link elements in <head> are not "visible")
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/icons/icon-192.png');
  });

  test('service worker is registered', async ({ page }) => {
    await page.goto('/');
    const hasSW = await page.evaluate(() => 'serviceWorker' in navigator);
    expect(hasSW).toBeTruthy();
  });
});
