/**
 * Cassa Margin — Calculation Module
 *
 * Every percentage in the app comes from this file.
 * Never recompute these inline anywhere else.
 */

/** Food cost % = (food purchases + beverage purchases) / net sales */
export function foodCostPercent(
  foodPurchases: number,
  bevPurchases: number,
  netSales: number
): number {
  if (netSales === 0) return 0;
  return ((foodPurchases + bevPurchases) / netSales) * 100;
}

/** Labor cost % = total labor cost / net sales */
export function laborCostPercent(
  totalLabor: number,
  netSales: number
): number {
  if (netSales === 0) return 0;
  return (totalLabor / netSales) * 100;
}

/** Prime cost % = food cost % + labor cost % */
export function primeCostPercent(
  foodCost: number,
  laborCost: number
): number {
  return foodCost + laborCost;
}

/**
 * Net margin = (net sales − food − beverage − labor − fixed − other) / net sales
 *
 * Fixed costs and other costs default to 0 until the owner enters them.
 * This means net margin will be an overestimate until "Honest margin" ships.
 * That's fine — we show what we know.
 */
export function netMarginPercent(
  netSales: number,
  foodPurchases: number,
  bevPurchases: number,
  totalLabor: number,
  fixedCosts: number = 0,
  otherCosts: number = 0
): number {
  if (netSales === 0) return 0;
  const profit =
    netSales - foodPurchases - bevPurchases - totalLabor - fixedCosts - otherCosts;
  return (profit / netSales) * 100;
}

/** Prime cost status: green < 60%, amber 60–65%, red > 65% */
export type StatusColor = "green" | "amber" | "red";

export function getStatus(primeCost: number): StatusColor {
  if (primeCost < 60) return "green";
  if (primeCost <= 65) return "amber";
  return "red";
}

/** Human-readable label for each status */
export function getStatusLabel(status: StatusColor): string {
  switch (status) {
    case "green":
      return "On track";
    case "amber":
      return "Watch this";
    case "red":
      return "Needs attention";
  }
}
