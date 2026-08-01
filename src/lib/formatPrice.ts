/**
 * Format a price value for display.
 * - Shows tiyins (decimal part) when they exist: 326 424,45
 * - Shows whole number when no fractional part: 85 000
 * - Caps at 2 decimal places to suppress floating-point artifacts
 */
export function formatPrice(amount: number): string {
  return amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
