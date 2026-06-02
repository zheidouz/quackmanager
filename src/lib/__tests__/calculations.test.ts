import { describe, it, expect } from 'vitest';
import {
  calculateProfit,
  calculateCostPerDuck,
  calculateBreakEven,
  calculateProfitMargin,
  sumEggCollection,
  calculateFeedDaysRemaining,
  isFeedStockLow,
  calculateTotal,
  getTotalByCategory,
  shouldGenerateRecurringExpense,
  formatCurrency,
  classifyDuckAgeGroup,
  calculateDuckInventory,
} from '../calculations';

// ── calculateProfit ──────────────────────────────────────────────────
describe('calculateProfit', () => {
  it('returns positive profit when revenue exceeds costs', () => {
    expect(calculateProfit(500, 200, 100, 50)).toBe(550);
  });

  it('returns negative profit (loss) when costs exceed revenue', () => {
    expect(calculateProfit(100, 50, 300, 100)).toBe(-250);
  });

  it('returns zero when revenue equals costs', () => {
    expect(calculateProfit(100, 100, 100, 100)).toBe(0);
  });

  it('handles zero values', () => {
    expect(calculateProfit(0, 0, 0, 0)).toBe(0);
  });

  it('handles decimal values', () => {
    expect(calculateProfit(150.5, 75.25, 100, 25.75)).toBe(100);
  });
});

// ── calculateCostPerDuck ─────────────────────────────────────────────
describe('calculateCostPerDuck', () => {
  it('divides total cost by number of ducks', () => {
    expect(calculateCostPerDuck(1000, 50)).toBe(20);
  });

  it('returns 0 when ducksRaised is 0', () => {
    expect(calculateCostPerDuck(1000, 0)).toBe(0);
  });

  it('handles decimal costs', () => {
    expect(calculateCostPerDuck(525.50, 10)).toBe(52.55);
  });

  it('returns Infinity-ish for very small denominators', () => {
    const result = calculateCostPerDuck(100, 0.5);
    expect(result).toBe(200);
  });
});

// ── calculateBreakEven ───────────────────────────────────────────────
describe('calculateBreakEven', () => {
  it('returns total cost as break-even point', () => {
    expect(calculateBreakEven(1500)).toBe(1500);
  });

  it('handles zero cost', () => {
    expect(calculateBreakEven(0)).toBe(0);
  });
});

// ── calculateProfitMargin ────────────────────────────────────────────
describe('calculateProfitMargin', () => {
  it('calculates correct percentage', () => {
    expect(calculateProfitMargin(200, 1000)).toBe(20);
  });

  it('returns 0 when revenue is 0', () => {
    expect(calculateProfitMargin(100, 0)).toBe(0);
  });

  it('returns negative margin for losses', () => {
    const margin = calculateProfitMargin(-200, 1000);
    expect(margin).toBe(-20);
  });

  it('rounds to 2 decimal places', () => {
    expect(calculateProfitMargin(100, 300)).toBe(33.33);
  });
});

// ── sumEggCollection ─────────────────────────────────────────────────
describe('sumEggCollection', () => {
  it('sums an array of egg collection entries', () => {
    const entries = [{ quantity: 127 }, { quantity: 132 }, { quantity: 118 }];
    expect(sumEggCollection(entries)).toBe(377);
  });

  it('returns 0 for empty array', () => {
    expect(sumEggCollection([])).toBe(0);
  });

  it('handles single entry', () => {
    expect(sumEggCollection([{ quantity: 50 }])).toBe(50);
  });
});

// ── calculateFeedDaysRemaining ───────────────────────────────────────
describe('calculateFeedDaysRemaining', () => {
  it('divides stock by daily consumption', () => {
    expect(calculateFeedDaysRemaining(150, 50)).toBe(3);
  });

  it('returns Infinity when daily consumption is 0', () => {
    expect(calculateFeedDaysRemaining(100, 0)).toBe(Infinity);
  });

  it('handles partial days', () => {
    expect(calculateFeedDaysRemaining(125, 50)).toBe(2.5);
  });
});

// ── isFeedStockLow ───────────────────────────────────────────────────
describe('isFeedStockLow', () => {
  it('returns true when days remaining below threshold', () => {
    expect(isFeedStockLow(100, 50, 3)).toBe(true);
  });

  it('returns false when days remaining at or above threshold', () => {
    expect(isFeedStockLow(200, 50, 3)).toBe(false);
  });

  it('returns false when daily consumption is 0', () => {
    expect(isFeedStockLow(100, 0, 3)).toBe(false);
  });

  it('boundary: exactly at threshold returns false', () => {
    expect(isFeedStockLow(150, 50, 3)).toBe(false);
  });

  it('boundary: just below threshold returns true', () => {
    expect(isFeedStockLow(149, 50, 3)).toBe(true);
  });
});

// ── calculateTotal ───────────────────────────────────────────────────
describe('calculateTotal', () => {
  it('multiplies quantity by unit price', () => {
    expect(calculateTotal(10, 5)).toBe(50);
  });

  it('rounds to 2 decimal places', () => {
    expect(calculateTotal(3, 1.33)).toBe(3.99);
  });

  it('handles zero quantity', () => {
    expect(calculateTotal(0, 100)).toBe(0);
  });
});

// ── getTotalByCategory ───────────────────────────────────────────────
describe('getTotalByCategory', () => {
  it('sums expenses for a specific category', () => {
    const expenses = [
      { category: 'labor' as const, amount: 500 },
      { category: 'medicine' as const, amount: 200 },
      { category: 'labor' as const, amount: 300 },
    ];
    expect(getTotalByCategory(expenses, 'labor')).toBe(800);
  });

  it('returns 0 when no expenses match category', () => {
    const expenses = [{ category: 'labor' as const, amount: 100 }];
    expect(getTotalByCategory(expenses, 'medicine')).toBe(0);
  });

  it('handles empty expenses array', () => {
    expect(getTotalByCategory([], 'labor')).toBe(0);
  });
});

// ── shouldGenerateRecurringExpense ───────────────────────────────────
describe('shouldGenerateRecurringExpense', () => {
  it('returns true when lastGenerated is null', () => {
    expect(shouldGenerateRecurringExpense('daily', null, '2026-06-02')).toBe(true);
  });

  describe('daily frequency', () => {
    it('returns true when last generated was yesterday', () => {
      expect(shouldGenerateRecurringExpense('daily', '2026-06-01', '2026-06-02')).toBe(true);
    });

    it('returns false when last generated is today', () => {
      expect(shouldGenerateRecurringExpense('daily', '2026-06-02', '2026-06-02')).toBe(false);
    });
  });

  describe('weekly frequency', () => {
    it('returns true when 7+ days have passed', () => {
      expect(shouldGenerateRecurringExpense('weekly', '2026-05-26', '2026-06-02')).toBe(true);
    });

    it('returns false when less than 7 days have passed', () => {
      expect(shouldGenerateRecurringExpense('weekly', '2026-05-30', '2026-06-02')).toBe(false);
    });
  });

  describe('monthly frequency', () => {
    it('returns true when month changed', () => {
      expect(shouldGenerateRecurringExpense('monthly', '2026-05-15', '2026-06-02')).toBe(true);
    });

    it('returns false when same month', () => {
      expect(shouldGenerateRecurringExpense('monthly', '2026-06-01', '2026-06-02')).toBe(false);
    });

    it('returns true when year changed', () => {
      expect(shouldGenerateRecurringExpense('monthly', '2025-12-31', '2026-01-01')).toBe(true);
    });
  });
});

// ── formatCurrency ───────────────────────────────────────────────────
describe('formatCurrency', () => {
  it('formats whole numbers without decimals', () => {
    expect(formatCurrency(1000)).toBe('1,000');
  });

  it('formats decimal numbers', () => {
    expect(formatCurrency(1250.5)).toBe('1,250.5');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('0');
  });
});

// ── classifyDuckAgeGroup ─────────────────────────────────────────────
describe('classifyDuckAgeGroup', () => {
  it('returns duckling for age under 14 days', () => {
    expect(classifyDuckAgeGroup('2026-06-01', '2026-06-02')).toBe('duckling');
  });

  it('returns duckling at exactly 13 days', () => {
    expect(classifyDuckAgeGroup('2026-05-20', '2026-06-02')).toBe('duckling');
  });

  it('returns grower for age between 14 and 55 days', () => {
    expect(classifyDuckAgeGroup('2026-05-01', '2026-06-02')).toBe('grower');
  });

  it('returns grower at exactly 14 days', () => {
    expect(classifyDuckAgeGroup('2026-05-19', '2026-06-02')).toBe('grower');
  });

  it('returns adult for age 56+ days', () => {
    expect(classifyDuckAgeGroup('2026-01-01', '2026-06-02')).toBe('adult');
  });

  it('returns adult at exactly 56 days', () => {
    expect(classifyDuckAgeGroup('2026-04-07', '2026-06-02')).toBe('adult');
  });

  it('handles same day hatch and reference', () => {
    expect(classifyDuckAgeGroup('2026-06-02', '2026-06-02')).toBe('duckling');
  });
});

// ── calculateDuckInventory ───────────────────────────────────────────
describe('calculateDuckInventory', () => {
  const refDate = '2026-06-02';

  it('returns zero when no data exists', () => {
    const result = calculateDuckInventory([], [], [], refDate);
    expect(result.totalLive).toBe(0);
    expect(result.ducklings).toBe(0);
    expect(result.growers).toBe(0);
    expect(result.adults).toBe(0);
  });

  it('computes live count as hatches minus sales and mortality', () => {
    const hatches = [{ date: '2026-05-01', quantity: 100 }];
    const sales = [{ date: '2026-05-15', quantity: 20 }];
    const mortality = [{ date: '2026-05-20', quantity: 10 }];
    const result = calculateDuckInventory(hatches, sales, mortality, refDate);
    expect(result.totalLive).toBe(70);
  });

  it('returns zero when all ducks are sold or died', () => {
    const hatches = [{ date: '2026-05-01', quantity: 50 }];
    const sales = [{ date: '2026-05-15', quantity: 30 }];
    const mortality = [{ date: '2026-05-20', quantity: 20 }];
    const result = calculateDuckInventory(hatches, sales, mortality, refDate);
    expect(result.totalLive).toBe(0);
  });

  it('handles negative live count (more removed than hatched) gracefully', () => {
    const hatches = [{ date: '2026-05-01', quantity: 10 }];
    const sales = [{ date: '2026-05-15', quantity: 20 }];
    const result = calculateDuckInventory(hatches, sales, [], refDate);
    expect(result.totalLive).toBe(0);
  });

  it('classifies adults correctly for old hatches', () => {
    const hatches = [
      { date: '2026-01-01', quantity: 50 }, // adult (153 days)
      { date: '2026-05-20', quantity: 30 }, // duckling (13 days)
    ];
    const result = calculateDuckInventory(hatches, [], [], refDate);
    expect(result.totalLive).toBe(80);
    expect(result.adults).toBeGreaterThan(0);
    expect(result.ducklings).toBeGreaterThan(0);
    expect(result.adults + result.ducklings + result.growers).toBe(80);
  });

  it('allocates all age groups summing to totalLive', () => {
    const hatches = [
      { date: '2026-01-15', quantity: 40 }, // adult
      { date: '2026-05-01', quantity: 35 }, // grower
      { date: '2026-05-28', quantity: 25 }, // duckling
    ];
    const result = calculateDuckInventory(hatches, [], [], refDate);
    expect(result.totalLive).toBe(100);
    expect(result.adults + result.growers + result.ducklings).toBe(100);
  });

  it('handles hatches with mortality that exceeds total survivors per age group', () => {
    const hatches = [
      { date: '2026-05-01', quantity: 10 }, // grower
      { date: '2026-05-28', quantity: 90 }, // duckling
    ];
    const sales = [{ date: '2026-06-01', quantity: 80 }];
    const result = calculateDuckInventory(hatches, sales, [], refDate);
    expect(result.totalLive).toBe(20);
    // Survival rate = 20/100 = 0.2; growers ~2, ducklings ~18
    expect(result.adults + result.growers + result.ducklings).toBe(20);
  });

  it('handles zero hatches with sales and mortality', () => {
    const result = calculateDuckInventory([], [{ date: '2026-06-01', quantity: 5 }], [{ date: '2026-06-01', quantity: 3 }], refDate);
    expect(result.totalLive).toBe(0);
  });

  it('handles single duckling hatch same day', () => {
    const hatches = [{ date: refDate, quantity: 1 }];
    const result = calculateDuckInventory(hatches, [], [], refDate);
    expect(result.totalLive).toBe(1);
    expect(result.ducklings).toBe(1);
  });
});

// ── Edge-case: isFeedStockLow with zero consumption ──────────────────
describe('isFeedStockLow edge cases', () => {
  it('returns false when daily consumption is 0 regardless of stock', () => {
    expect(isFeedStockLow(0, 0, 3)).toBe(false);
    expect(isFeedStockLow(100, 0, 3)).toBe(false);
    expect(isFeedStockLow(1, 0, 3)).toBe(false);
  });
});

// ── Edge-case: shouldGenerateRecurringExpense ────────────────────────
describe('shouldGenerateRecurringExpense edge cases', () => {
  it('generates when lastGenerated is null regardless of frequency', () => {
    expect(shouldGenerateRecurringExpense('daily', null, '2026-06-02')).toBe(true);
    expect(shouldGenerateRecurringExpense('weekly', null, '2026-06-02')).toBe(true);
    expect(shouldGenerateRecurringExpense('monthly', null, '2026-06-02')).toBe(true);
  });
});

// ── Edge-case: calculateProfit ───────────────────────────────────────
describe('calculateProfit edge cases', () => {
  it('handles very large numbers without overflow', () => {
    const result = calculateProfit(1_000_000_000, 500_000_000, 200_000_000, 100_000_000);
    expect(result).toBe(1_200_000_000);
  });

  it('handles floating point precision', () => {
    // 0.1 + 0.2 = 0.30000000000000004 in floating point
    expect(calculateProfit(0.1, 0.2, 0, 0)).toBeCloseTo(0.3);
  });
});
