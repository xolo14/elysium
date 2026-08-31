export type RoomPlanId = "room" | "breakfast" | "halfboard";

export type RoomPlan = {
  id: RoomPlanId;
  label: string;
  /** Extra ₹ per guest per night on top of suite rate */
  perGuestNight: number;
  shortLabel: string;
};

export const ROOM_PLANS: RoomPlan[] = [
  {
    id: "room",
    label: "Room only",
    shortLabel: "European Plan",
    perGuestNight: 0,
  },
  {
    id: "breakfast",
    label: "Room + Breakfast",
    shortLabel: "Breakfast included",
    perGuestNight: 0,
  },
  {
    id: "halfboard",
    label: "Room + Breakfast + 1 Meal (Lunch or Dinner)",
    shortLabel: "Breakfast + 1 meal",
    perGuestNight: 750,
  },
];

export type OfferCode = {
  code: string;
  label: string;
  /** Percent off room subtotal before pay-now */
  percent: number;
};

export const OFFER_CODES: OfferCode[] = [
  { code: "ELYSIUM15", label: "ELYSIUM15", percent: 15 },
  { code: "DIRECT10", label: "DIRECT10", percent: 10 },
];

export function parseRate(rate: string) {
  return Number(rate.replace(/[^\d]/g, "")) || 0;
}

export function formatInr(amount: number) {
  return `₹ ${Math.max(0, Math.round(amount)).toLocaleString("en-IN")}`;
}

export type PricingInput = {
  nightlyRate: number;
  nights: number;
  rooms: number;
  guests: number;
  planId: RoomPlanId;
  offerCode: string;
  payNow: boolean;
};

export type PricingBreakdown = {
  roomLine: number;
  mealLine: number;
  subtotal: number;
  listPrice: number;
  promoDiscount: number;
  payNowDiscount: number;
  taxes: number;
  payable: number;
  savings: number;
  plan: RoomPlan;
  offer: OfferCode | null;
};

function findOffer(raw: string): OfferCode | null {
  const code = raw.trim().toUpperCase();
  if (!code) return null;
  return OFFER_CODES.find((o) => o.code === code) ?? null;
}

export function computePricing(input: PricingInput): PricingBreakdown {
  const plan = ROOM_PLANS.find((p) => p.id === input.planId) ?? ROOM_PLANS[0]!;
  const nights = Math.max(1, input.nights);
  const rooms = Math.max(1, input.rooms);
  const guests = Math.max(1, input.guests);

  const roomLine = input.nightlyRate * nights * rooms;
  const mealLine = plan.perGuestNight * guests * nights * rooms;
  const subtotal = roomLine + mealLine;

  const offer = findOffer(input.offerCode);
  const promoDiscount = offer ? Math.round(subtotal * (offer.percent / 100)) : 0;
  const afterPromo = subtotal - promoDiscount;
  const payNowDiscount = input.payNow ? Math.round(afterPromo * 0.1) : 0;
  const afterDiscounts = afterPromo - payNowDiscount;

  /** Bloom-style line: GST shown separately, then rolled into payable */
  const taxes = Math.round(afterDiscounts * 0.05);
  const payable = afterDiscounts + taxes;
  const listPrice = Math.round(subtotal * 1.12);
  const savings = Math.max(0, listPrice - payable);

  return {
    roomLine,
    mealLine,
    subtotal,
    listPrice,
    promoDiscount,
    payNowDiscount,
    taxes,
    payable,
    savings,
    plan,
    offer,
  };
}
