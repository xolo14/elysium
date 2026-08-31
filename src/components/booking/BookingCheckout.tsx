import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import type { Hotel, Suite } from "@/data/hotels";
import { formatStayCompact } from "@/lib/booking-dates";
import {
  OFFER_CODES,
  ROOM_PLANS,
  computePricing,
  formatInr,
  parseRate,
  type RoomPlanId,
} from "@/lib/booking-pricing";
import { easeLuxe, fadeUp, stagger, tapMicro, tapSoft } from "@/lib/motion-ui";
import { cn } from "@/lib/utils";

export type CheckoutDraft = {
  guests: number;
  rooms: number;
  planId: RoomPlanId;
  offerCode: string;
  payNow: boolean;
};

type BookingCheckoutProps = {
  hotel: Hotel;
  suite: Suite;
  checkIn: string;
  checkOut: string;
  nights: number;
  draft: CheckoutDraft;
  onChange: (next: Partial<CheckoutDraft>) => void;
  onModify: () => void;
  onProceed: () => void;
};

export function BookingCheckout({
  hotel,
  suite,
  checkIn,
  checkOut,
  nights,
  draft,
  onChange,
  onModify,
  onProceed,
}: BookingCheckoutProps) {
  const [offerInput, setOfferInput] = useState(draft.offerCode);
  const address = hotel.contact.address.slice(1).join(" ");

  const pricing = useMemo(
    () =>
      computePricing({
        nightlyRate: parseRate(suite.rate),
        nights,
        rooms: draft.rooms,
        guests: draft.guests,
        planId: draft.planId,
        offerCode: draft.offerCode,
        payNow: draft.payNow,
      }),
    [suite.rate, nights, draft],
  );

  const applyOffer = (code: string) => {
    const next = code.trim().toUpperCase();
    setOfferInput(next);
    onChange({ offerCode: next });
  };

  return (
    <div className="min-h-[100svh] bg-forest pt-[4.5rem]">
      <div className="page-wrap relative pb-3 pt-5 sm:pb-4 sm:pt-8">
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, ease: easeLuxe }}
          className="flex items-end justify-between gap-4"
        >
          <h1 className="display-nav text-[clamp(1.65rem,6vw,2.5rem)] text-ivory">
            Booking Details
          </h1>
          <svg
            className="mb-1 hidden h-16 w-20 shrink-0 text-ivory/35 sm:block"
            viewBox="0 0 80 64"
            fill="none"
            aria-hidden="true"
          >
            <rect x="8" y="14" width="36" height="40" rx="3" stroke="currentColor" strokeWidth="2" />
            <path d="M8 26h36M20 8v10M32 8v10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M48 28l18-6v28l-18 6V28z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            <path d="M56 34h8M56 42h8" stroke="currentColor" strokeWidth="2" />
          </svg>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.08, ease: easeLuxe }}
        className="sheet-luxe pb-14 pt-5 sm:pb-16 sm:pt-8"
      >
        <div className="page-wrap space-y-7 sm:space-y-10">
          <motion.section {...fadeUp} transition={stagger(0)}>
            <h2 className="font-nav text-lg font-extrabold text-neutral-800 sm:text-xl">
              {hotel.name}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-neutral-500">{address}</p>

            <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-nav text-base font-extrabold text-neutral-800 sm:text-lg">
                  {formatStayCompact(checkIn)}
                  <span className="mx-2 text-bronze">→</span>
                  {formatStayCompact(checkOut)}
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  <span className="mr-4">2:00pm</span>
                  <span>11:00am</span>
                </p>
              </div>
              <span className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600">
                {nights} Night{nights === 1 ? "" : "s"}
              </span>
            </div>

            <div className="mt-6 flex items-start gap-3 border-t border-neutral-100 pt-6">
              <img
                src={suite.image}
                alt=""
                className="h-16 w-16 shrink-0 rounded-[10px] object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
              />
              <div className="min-w-0 flex-1">
                <p className="font-nav text-base font-extrabold text-neutral-800">{suite.name}</p>
                <div className="mt-2 inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50">
                  <motion.button
                    type="button"
                    whileTap={tapSoft}
                    aria-label="Fewer guests"
                    disabled={draft.guests <= 1}
                    onClick={() => onChange({ guests: Math.max(1, draft.guests - 1) })}
                    className="btn-quiet flex h-9 w-9 items-center justify-center text-neutral-500 disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </motion.button>
                  <span className="min-w-[4.5rem] text-center text-sm font-semibold text-neutral-700">
                    {draft.guests} Guest{draft.guests === 1 ? "" : "s"}
                  </span>
                  <motion.button
                    type="button"
                    whileTap={tapSoft}
                    aria-label="More guests"
                    disabled={draft.guests >= 12}
                    onClick={() => onChange({ guests: Math.min(12, draft.guests + 1) })}
                    className="btn-quiet flex h-9 w-9 items-center justify-center text-forest disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-neutral-500">Room options:</p>
              <ul className="mt-3 space-y-2.5">
                {ROOM_PLANS.map((plan, i) => {
                  const active = draft.planId === plan.id;
                  return (
                    <motion.li
                      key={plan.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={stagger(i, 0.12)}
                    >
                      <motion.button
                        type="button"
                        whileTap={tapMicro}
                        onClick={() => onChange({ planId: plan.id })}
                        className="flex w-full items-start gap-3 rounded-[10px] px-1 py-1.5 text-left transition-colors hover:bg-neutral-50"
                      >
                        <span
                          className={cn(
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300",
                            active ? "border-forest" : "border-neutral-300",
                          )}
                        >
                          {active ? (
                            <motion.span
                              layoutId="plan-dot"
                              className="h-2.5 w-2.5 rounded-full bg-forest"
                              transition={{ duration: 0.28, ease: easeLuxe }}
                            />
                          ) : null}
                        </span>
                        <span
                          className={cn(
                            "text-sm leading-snug transition-colors sm:text-[15px]",
                            active ? "font-semibold text-neutral-800" : "text-neutral-600",
                          )}
                        >
                          {plan.label}
                        </span>
                      </motion.button>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <motion.button
              type="button"
              whileTap={tapMicro}
              onClick={onModify}
              className="btn-quiet mt-6 text-sm font-semibold text-neutral-700 underline underline-offset-4"
            >
              Modify Date/Room Selection
            </motion.button>
          </motion.section>

          <motion.section {...fadeUp} transition={stagger(1)}>
            <h2 className="font-nav text-xl font-extrabold text-bronze sm:text-2xl">Offer Code</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {OFFER_CODES.map((o) => (
                <motion.button
                  key={o.code}
                  type="button"
                  whileTap={tapSoft}
                  onClick={() => applyOffer(o.code)}
                  className={cn(
                    "btn-quiet rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide",
                    draft.offerCode === o.code
                      ? "bg-forest text-ivory"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80",
                  )}
                >
                  {o.label}
                </motion.button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={offerInput}
                onChange={(e) => setOfferInput(e.target.value.toUpperCase())}
                onBlur={() => applyOffer(offerInput)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyOffer(offerInput);
                  }
                }}
                placeholder="Enter Offer Code Here"
                className="field-luxe flex-1"
              />
              <motion.button
                type="button"
                whileTap={tapSoft}
                onClick={() => applyOffer(offerInput)}
                className="btn-quiet nav-cta shrink-0 border border-forest px-4 text-forest"
              >
                Apply
              </motion.button>
            </div>
            {draft.offerCode && !pricing.offer ? (
              <p className="mt-2 text-xs text-bronze">
                That code isn’t valid — try ELYSIUM15 or DIRECT10.
              </p>
            ) : null}
            {pricing.offer ? (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs font-semibold text-forest"
              >
                {pricing.offer.code} applied · {pricing.offer.percent}% off
              </motion.p>
            ) : null}
          </motion.section>

          <motion.section {...fadeUp} transition={stagger(2)}>
            <h2 className="font-nav text-xl font-extrabold text-bronze sm:text-2xl">
              Payment amount
            </h2>
            <motion.button
              type="button"
              whileTap={tapMicro}
              onClick={() => onChange({ payNow: true })}
              className={cn(
                "mt-4 w-full rounded-[12px] border-2 p-4 text-left transition-colors duration-300 sm:p-5",
                draft.payNow ? "border-forest bg-forest/[0.03]" : "border-neutral-200 hover:border-forest/40",
              )}
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    draft.payNow ? "border-forest" : "border-neutral-300",
                  )}
                >
                  {draft.payNow ? <span className="h-2.5 w-2.5 rounded-full bg-forest" /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-nav text-base font-extrabold text-neutral-800">Pay Now</p>
                  {pricing.savings > 0 ? (
                    <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-bronze">
                      <span aria-hidden="true">%</span>
                      Saving {formatInr(pricing.savings)} if you book now
                    </p>
                  ) : null}
                  <p className="mt-1 text-xs text-neutral-400">
                    Hassle-free with Instant Confirmation
                  </p>
                  <p className="mt-3 flex flex-wrap items-baseline gap-2">
                    <span className="text-sm text-neutral-400 line-through">
                      {formatInr(pricing.listPrice)}
                    </span>
                    <span className="font-nav text-lg font-extrabold text-forest">
                      {formatInr(pricing.payable)}{" "}
                      <span className="text-sm font-bold">total</span>
                    </span>
                  </p>
                </div>
              </div>
            </motion.button>

            <div className="mt-5 flex w-full justify-end sm:mt-5">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={tapSoft}
                transition={{ duration: 0.25, ease: easeLuxe }}
                onClick={onProceed}
                className="btn-primary min-h-12 w-full px-8 sm:w-auto"
              >
                Proceed to Book
              </motion.button>
            </div>
          </motion.section>

          <motion.div {...fadeUp} transition={stagger(3)}>
            <PriceBreakdown
              suiteName={suite.name}
              nights={nights}
              rooms={draft.rooms}
              guests={draft.guests}
              pricing={pricing}
              phone={hotel.contact.phone}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function PriceBreakdown({
  suiteName,
  nights,
  rooms,
  guests,
  pricing,
  phone,
}: {
  suiteName: string;
  nights: number;
  rooms: number;
  guests: number;
  pricing: ReturnType<typeof computePricing>;
  phone: string;
}) {
  return (
    <section className="border-t border-neutral-100 pt-8 pb-4">
      <h2 className="font-nav text-xl font-extrabold text-neutral-800 sm:text-2xl">
        Price Breakdown
      </h2>

      <ul className="mt-5 space-y-4">
        <li className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-700">
              {rooms} {suiteName} × {nights} Night{nights === 1 ? "" : "s"}
            </p>
            <p className="mt-0.5 text-xs text-neutral-400">
              {pricing.plan.shortLabel}, {guests} Adult{guests === 1 ? "" : "s"}
            </p>
          </div>
          <p className="shrink-0 text-sm font-bold text-forest">
            {formatInr(pricing.roomLine + pricing.mealLine)}
          </p>
        </li>
        {pricing.promoDiscount > 0 ? (
          <li className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold text-bronze">Promotional Discount</p>
            <p className="shrink-0 text-sm font-bold text-bronze">
              − {formatInr(pricing.promoDiscount)}
            </p>
          </li>
        ) : null}
        {pricing.payNowDiscount > 0 ? (
          <li className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold text-bronze">Pay Now Discount</p>
            <p className="shrink-0 text-sm font-bold text-bronze">
              − {formatInr(pricing.payNowDiscount)}
            </p>
          </li>
        ) : null}
        <li className="flex items-start justify-between gap-4">
          <p className="text-sm font-semibold text-neutral-700">Taxes &amp; Other Charges</p>
          <p className="shrink-0 text-sm font-bold text-forest">{formatInr(pricing.taxes)}</p>
        </li>
      </ul>

      <div className="mt-5 border-t border-neutral-200 pt-5">
        <div className="flex items-center justify-between gap-4">
          <p className="font-nav text-base font-extrabold text-neutral-800">Payable amount</p>
          <p className="font-nav text-xl font-extrabold text-forest">
            {formatInr(pricing.payable)}
          </p>
        </div>
        {pricing.savings > 0 ? (
          <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-bronze">
            <span aria-hidden="true">%</span>
            You are saving {formatInr(pricing.savings)} by booking directly
          </p>
        ) : null}
      </div>

      <div className="mt-10 space-y-2 text-sm text-neutral-500">
        <p>Facing an Issue? Call us for assistance.</p>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="inline-block font-semibold text-neutral-800 underline underline-offset-4 transition-opacity hover:opacity-70"
        >
          {phone}
        </a>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
          <Link to="/terms" className="underline underline-offset-4 transition-opacity hover:opacity-70">
            Cancellation Policy
          </Link>
          <Link to="/terms" className="underline underline-offset-4 transition-opacity hover:opacity-70">
            Terms &amp; Conditions
          </Link>
        </div>
      </div>
    </section>
  );
}
