import {
  foodCostPercent,
  laborCostPercent,
  primeCostPercent,
  getStatus,
  getStatusLabel,
} from "@/lib/calculations";

type WeeklyEntry = {
  net_sales: number;
  food_purchases: number;
  bev_purchases: number;
  total_labor: number;
};

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

/**
 * The "one thing to look at" — whichever half of prime cost moved the
 * most since last week drives the diagnosis. Ties and improvements get
 * an honest, non-alarmist note instead of a manufactured problem.
 */
function diagnose(current: WeeklyEntry, previous: WeeklyEntry | null) {
  const foodCost = foodCostPercent(current.food_purchases, current.bev_purchases, current.net_sales);
  const laborCost = laborCostPercent(current.total_labor, current.net_sales);
  const primeCost = primeCostPercent(foodCost, laborCost);

  if (!previous) {
    return {
      foodCost,
      laborCost,
      primeCost,
      change: null as number | null,
      note: "This is your first week in the system, so there's nothing to compare it to yet. Next week you'll see the change.",
    };
  }

  const prevFoodCost = foodCostPercent(previous.food_purchases, previous.bev_purchases, previous.net_sales);
  const prevLaborCost = laborCostPercent(previous.total_labor, previous.net_sales);
  const prevPrimeCost = primeCostPercent(prevFoodCost, prevLaborCost);
  const change = round1(primeCost - prevPrimeCost);

  const foodDelta = foodCost - prevFoodCost;
  const laborDelta = laborCost - prevLaborCost;

  let note: string;
  if (change <= 0) {
    note = `Prime cost moved the right way. Whatever changed this week, it's worth noting so you can keep doing it.`;
  } else if (Math.abs(foodDelta) >= Math.abs(laborDelta)) {
    note = `Food cost is what moved — up ${round1(foodDelta)} points. Usually that's a vendor price increase, portion drift, or waste. Check your last few invoices against last week's.`;
  } else {
    note = `Labor is what moved — up ${round1(laborDelta)} points. Usually that's overtime, overscheduling for the volume you actually did, or a slow week you didn't cut hours for.`;
  }

  return { foodCost, laborCost, primeCost, change, note };
}

export function buildDigestEmail(params: {
  restaurantName: string;
  weekEnding: string;
  current: WeeklyEntry;
  previous: WeeklyEntry | null;
  appUrl: string;
}) {
  const { restaurantName, weekEnding, current, previous, appUrl } = params;
  const { primeCost, change, note } = diagnose(current, previous);
  const status = getStatus(primeCost);
  const statusLabel = getStatusLabel(status);
  const statusColor = status === "green" ? "#34D399" : status === "amber" ? "#FBBF24" : "#F87171";

  const changeLine =
    change === null
      ? ""
      : change === 0
        ? "Same as last week."
        : `${change > 0 ? "Up" : "Down"} ${Math.abs(change)} points from last week.`;

  const subject =
    status === "red"
      ? `${restaurantName}: prime cost needs attention this week`
      : `${restaurantName}: prime cost is ${statusLabel.toLowerCase()} this week`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <p style="font-size: 14px; color: #666;">Week ending ${weekEnding}</p>
      <h1 style="font-size: 22px; margin: 4px 0 20px;">${restaurantName}</h1>

      <div style="border: 1px solid #eee; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <div style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ${statusColor}; margin-right: 8px;"></div>
        <span style="font-size: 13px; font-weight: 600; color: ${statusColor};">${statusLabel}</span>
        <div style="font-size: 32px; font-weight: 600; margin-top: 8px;">${round1(primeCost)}%</div>
        <p style="font-size: 13px; color: #666; margin: 4px 0 0;">Prime cost. ${changeLine}</p>
      </div>

      <p style="font-size: 15px; line-height: 1.5;">${note}</p>

      <a href="${appUrl}/dashboard" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px;">
        See the full breakdown
      </a>
    </div>
  `;

  const text = `${restaurantName} — week ending ${weekEnding}\n\nPrime cost: ${round1(primeCost)}% (${statusLabel}). ${changeLine}\n\n${note}\n\n${appUrl}/dashboard`;

  return { subject, html, text };
}

export function buildReminderEmail(params: { restaurantName: string; appUrl: string }) {
  const { restaurantName, appUrl } = params;

  const subject = `${restaurantName}: this week's numbers aren't in yet`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="font-size: 22px; margin: 0 0 16px;">${restaurantName}</h1>
      <p style="font-size: 15px; line-height: 1.5;">
        You haven't entered numbers for this past week yet. It takes about two
        minutes — net sales, food, beverage, and labor, pulled from your POS
        and payroll.
      </p>
      <a href="${appUrl}/entry" style="display: inline-block; margin-top: 12px; padding: 10px 20px; background: #1a1a1a; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px;">
        Enter this week's numbers
      </a>
    </div>
  `;

  const text = `${restaurantName} — you haven't entered numbers for this past week yet. Takes about two minutes.\n\n${appUrl}/entry`;

  return { subject, html, text };
}
