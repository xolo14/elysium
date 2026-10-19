import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus } from "lucide-react";
import type { Hotel, Suite } from "@/data/hotels";
import { formatStayDate } from "@/lib/booking-dates";
import {
  OFFER_CODES,
  ROOM_PLANS,
  computePricing,
  formatInr,
  parseRate,
  type RoomPlanId,
} from "@/lib/booking-pricing";
import { easeLuxe, tapSoft } from "@/lib/motion-ui";
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
  const [payOpen, setPayOpen] = useState(false);
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

  const hotelPay = useMemo(
    () =>
      computePricing({
        nightlyRate: parseRate(suite.rate),
        nights,
        rooms: draft.rooms,
        guests: draft.guests,
        planId: draft.planId,
        offerCode: draft.offerCode,
        payNow: false,
      }).payable,
    [suite.rate, nights, draft],
  );

  const applyOffer = (code: string) => {
    const next = code.trim().toUpperCase();
    setOfferInput(next);
    onChange({ offerCode: next });
  };

  const offerFields = (
    tone: "forest" | "sheet",
  ) => (
    <OfferFields
      tone={tone}
      offerInput={offerInput}
      activeCode={draft.offerCode}
      offer={pricing.offer}
      onInput={setOfferInput}
      onApply={applyOffer}
    />
  );

  return (
    <div className="relative flex min-h-[100svh] flex-col bg-forest pt-[4.5rem]">
      <HeaderDoodles />

      <div className="page-wrap relative z-10 flex shrink-0 items-end justify-between gap-4 pt-7 pb-6 sm:pt-10 sm:pb-8">
        <h1 className="display-nav text-[clamp(2rem,6vw,3.4rem)] leading-none text-ivory">
          Booking Details
        </h1>
        <CalendarDoodle />
      </div>

      <div className="page-wrap relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col rounded-t-[28px] bg-white px-5 py-8 sm:rounded-t-[36px] sm:px-10 sm:py-10 lg:px-14">
          <div className="grid flex-1 grid-cols-1 items-start gap-x-16 gap-y-10 lg:grid-cols-2 lg:gap-x-24">
            <div className="min-w-0">
              <h2 className="font-nav text-[1.2rem] font-extrabold text-neutral-800 sm:text-[1.4rem]">
                {hotel.name}
              </h2>
              <p className="mt-1 text-[13px] leading-relaxed text-neutral-400">{address}</p>

              <div className="mt-5 flex flex-wrap items-start gap-x-5 gap-y-2">
                <div>
                  <p className="font-nav text-[15px] font-extrabold text-neutral-800">
                    {formatStayDate(checkIn)}
                    <span className="mx-2.5 font-semibold text-neutral-300">→</span>
                    {formatStayDate(checkOut)}
                  </p>
                  <p className="mt-1.5 text-[12px] text-neutral-400">
                    <span className="mr-8">Check-in 2:00pm</span>
                    Check-out 11:00am
                  </p>
                </div>
                <span className="mt-0.5 rounded-full border border-neutral-200 px-3 py-1 text-[11px] font-semibold text-neutral-500">
                  {nights} Night{nights === 1 ? "" : "s"}
                </span>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3 border-t border-neutral-100 pt-5">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    src={suite.image}
                    alt=""
                    className="h-12 w-12 shrink-0 rounded-[10px] object-cover"
                  />
                  <p className="font-nav text-[15px] font-extrabold text-neutral-800">{suite.name}</p>
                </div>
                <div className="inline-flex shrink-0 items-center rounded-full border border-neutral-200 px-1">
                  <button
                    type="button"
                    aria-label="Fewer guests"
                    disabled={draft.guests <= 1}
                    onClick={() => onChange({ guests: Math.max(1, draft.guests - 1) })}
                    className="flex h-8 w-8 items-center justify-center text-neutral-400 disabled:opacity-30"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="min-w-[3.75rem] text-center text-[13px] font-semibold text-neutral-700">
                    {draft.guests} Guest{draft.guests === 1 ? "" : "s"}
                  </span>
                  <button
                    type="button"
                    aria-label="More guests"
                    disabled={draft.guests >= 12}
                    onClick={() => onChange({ guests: Math.min(12, draft.guests + 1) })}
                    className="flex h-8 w-8 items-center justify-center text-neutral-500 disabled:opacity-30"
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-[13px] text-neutral-500">Room options:</p>
                <ul className="mt-2 space-y-2">
                  {ROOM_PLANS.map((plan) => {
                    const active = draft.planId === plan.id;
                    return (
                      <li key={plan.id}>
                        <button
                          type="button"
                          onClick={() => onChange({ planId: plan.id })}
                          className="inline-flex items-center gap-2.5 text-[13px] text-neutral-700"
                        >
                          <span
                            className={cn(
                              "flex h-[16px] w-[16px] items-center justify-center rounded-full border-2",
                              active ? "border-forest" : "border-neutral-300",
                            )}
                          >
                            {active ? <span className="h-[7px] w-[7px] rounded-full bg-forest" /> : null}
                          </span>
                          {plan.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <button
                type="button"
                onClick={onModify}
                className="mt-5 text-[13px] font-semibold text-neutral-700 underline underline-offset-4"
              >
                Modify Date/Room Selection
              </button>

              {payOpen ? <div className="mt-10">{offerFields("sheet")}</div> : null}

              {!payOpen ? (
                <motion.button
                  type="button"
                  whileTap={tapSoft}
                  onClick={() => setPayOpen(true)}
                  className="mt-8 inline-flex min-h-10 items-center rounded-[999px] bg-forest px-5 font-nav text-[13px] font-extrabold text-ivory lg:hidden"
                >
                  See Payment Options
                </motion.button>
              ) : null}

              <AnimatePresence>
                {payOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.32, ease: easeLuxe }}
                    className="overflow-hidden"
                  >
                    <div className="mt-12">
                      <h2 className="font-nav text-[1.7rem] font-extrabold text-forest sm:text-[2rem]">
                        Payment amount
                      </h2>
                      <div className="mt-5 space-y-3">
                        <PayChoice
                          active={draft.payNow}
                          title="Pay now"
                          note={
                            pricing.savings > 0
                              ? `Saving ${formatInr(pricing.savings)} if you book now`
                              : "Hassle-free with Instant Confirmation"
                          }
                          listAmount={pricing.listPrice}
                          amount={pricing.payable}
                          onClick={() => onChange({ payNow: true })}
                        />
                        <PayChoice
                          active={!draft.payNow}
                          title="Pay at Hotel"
                          note="Pay when you arrive"
                          listAmount={pricing.listPrice}
                          amount={hotelPay}
                          onClick={() => onChange({ payNow: false })}
                        />
                      </div>
                      <div className="mt-8 flex justify-center md:justify-start">
                        <motion.button
                          type="button"
                          whileTap={tapSoft}
                          onClick={onProceed}
                          className="inline-flex min-h-11 items-center rounded-[999px] bg-forest px-8 font-nav text-[14px] font-extrabold text-ivory"
                        >
                          Proceed to Book
                        </motion.button>
                      </div>
                    </div>

                    <div className="mt-14 flex flex-wrap items-start justify-between gap-x-8 gap-y-3 border-t border-neutral-100 pt-8 text-[12px] text-neutral-400">
                      <p>
                        Facing an Issue? Call us for assistance.
                        <br />
                        <a href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`} className="underline">
                          {hotel.contact.phone}
                        </a>
                      </p>
                      <div className="flex flex-wrap gap-x-6">
                        <Link to="/terms" className="underline">
                          Cancellation Policy
                        </Link>
                        <Link to="/terms" className="underline">
                          Terms &amp; Conditions
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-[5.5rem] lg:z-20">
              <h3 className="font-nav text-[1.2rem] font-extrabold text-neutral-800 sm:text-[1.4rem]">
                Price Breakdown
              </h3>
              <ul className="mt-4 space-y-3 text-[13px]">
                <li className="flex items-start justify-between gap-8">
                  <div>
                    <p className="text-neutral-600">
                      {draft.rooms} {suite.name} x {nights} Night{nights === 1 ? "" : "s"}
                    </p>
                    <p className="mt-0.5 text-[12px] text-neutral-400">
                      {pricing.plan.shortLabel}, {draft.guests} Adult{draft.guests === 1 ? "" : "s"}
                    </p>
                  </div>
                  <p className="shrink-0 font-semibold text-forest">
                    {formatInr(pricing.roomLine + pricing.mealLine)}
                  </p>
                </li>
                {pricing.promoDiscount > 0 ? (
                  <li className="flex justify-between gap-8 text-bronze">
                    <span>Promotional Discount</span>
                    <span className="shrink-0">− {formatInr(pricing.promoDiscount)}</span>
                  </li>
                ) : null}
                {pricing.payNowDiscount > 0 ? (
                  <li className="flex justify-between gap-8 text-bronze">
                    <span>Pay Now Discount</span>
                    <span className="shrink-0">− {formatInr(pricing.payNowDiscount)}</span>
                  </li>
                ) : null}
                <li className="flex justify-between gap-8 text-neutral-600">
                  <span>Taxes &amp; Other Charges</span>
                  <span className="shrink-0 font-semibold text-forest">{formatInr(pricing.taxes)}</span>
                </li>
                <li className="flex justify-between gap-8 pt-1 font-extrabold text-neutral-800">
                  <span>Payable amount</span>
                  <span className="shrink-0 text-forest">{formatInr(pricing.payable)}</span>
                </li>
              </ul>
              {pricing.savings > 0 ? (
                <p className="mt-3 text-[12px] font-semibold text-bronze">
                  % You are saving {formatInr(pricing.savings)} by booking directly
                </p>
              ) : null}

              {!payOpen ? (
                <motion.button
                  type="button"
                  whileTap={tapSoft}
                  onClick={() => setPayOpen(true)}
                  className="mt-6 hidden min-h-10 items-center rounded-[999px] bg-forest px-5 font-nav text-[13px] font-extrabold text-ivory lg:inline-flex"
                >
                  See Payment Options
                </motion.button>
              ) : null}
            </aside>
          </div>
        </div>
      </div>

      {!payOpen ? (
        <div className="page-wrap relative z-10 shrink-0 py-8 sm:py-10">
          {offerFields("forest")}
        </div>
      ) : null}
    </div>
  );
}

function OfferFields({
  tone,
  offerInput,
  activeCode,
  offer,
  onInput,
  onApply,
}: {
  tone: "forest" | "sheet";
  offerInput: string;
  activeCode: string;
  offer: { code: string; percent: number } | null;
  onInput: (value: string) => void;
  onApply: (code: string) => void;
}) {
  const sheet = tone === "sheet";
  return (
    <>
      <h2
        className={cn(
          "font-nav text-[1.7rem] font-extrabold sm:text-[2rem]",
          sheet ? "text-forest" : "text-ivory",
        )}
      >
        Offer Code
      </h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {OFFER_CODES.map((o) => (
          <button
            key={o.code}
            type="button"
            onClick={() => onApply(o.code)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide",
              activeCode === o.code
                ? sheet
                  ? "bg-forest text-ivory"
                  : "bg-ivory text-forest"
                : sheet
                  ? "bg-neutral-100 text-neutral-600"
                  : "bg-white/15 text-ivory",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="mt-3 flex max-w-xl">
        <input
          type="text"
          value={offerInput}
          onChange={(e) => onInput(e.target.value.toUpperCase())}
          onBlur={() => onApply(offerInput)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onApply(offerInput);
            }
          }}
          placeholder="Enter Offer Code Here"
          className={cn(
            "h-12 w-full rounded-[999px] px-5 text-sm text-neutral-800 outline-none",
            sheet ? "border border-neutral-200 bg-white" : "border-0 bg-white",
          )}
        />
      </div>
      {activeCode && !offer ? (
        <p className={cn("mt-2 text-xs", sheet ? "text-neutral-500" : "text-ivory/70")}>
          That code isn’t valid. Try ELYSIUM15 or DIRECT10.
        </p>
      ) : null}
      {offer ? (
        <p className={cn("mt-2 text-xs font-semibold", sheet ? "text-forest" : "text-ivory")}>
          {offer.code} applied · {offer.percent}% off
        </p>
      ) : null}
    </>
  );
}

function PayChoice({
  active,
  title,
  note,
  listAmount,
  amount,
  onClick,
}: {
  active: boolean;
  title: string;
  note: string;
  listAmount: number;
  amount: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 rounded-[14px] border px-4 py-4 text-left sm:px-5",
        active ? "border-forest bg-white" : "border-neutral-200 bg-white",
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
          active ? "border-forest" : "border-neutral-300",
        )}
      >
        {active ? <span className="h-1.5 w-1.5 rounded-full bg-forest" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <span className="text-[15px] font-extrabold text-neutral-800">{title}</span>
          <span className="text-[12px] font-semibold text-bronze">{note}</span>
        </span>
        <span className="mt-3 flex items-baseline gap-2.5">
          {listAmount > amount ? (
            <span className="text-[13px] text-neutral-400 line-through">{formatInr(listAmount)}</span>
          ) : null}
          <span className="text-[15px] font-extrabold text-forest">{formatInr(amount)} total</span>
        </span>
      </span>
    </button>
  );
}

function CalendarDoodle() {
  return (
    <motion.svg
      className="mb-1 hidden h-16 w-24 shrink-0 text-ivory/55 sm:block"
      viewBox="0 0 96 72"
      fill="none"
      aria-hidden="true"
      initial={{ rotate: -6, opacity: 0, y: 8 }}
      animate={{ rotate: 0, opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeLuxe }}
    >
      <rect x="8" y="16" width="40" height="44" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M8 28h40M22 8v12M34 8v12" stroke="currentColor" strokeWidth="2" />
      <circle cx="20" cy="40" r="2.2" className="fill-ivory/70" />
      <circle cx="32" cy="40" r="2.2" className="fill-ivory/70" />
      <circle cx="44" cy="40" r="2.2" className="fill-ivory/40" />
      <path d="M56 30 84 20v36L56 66V30Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M66 38h10M66 48h10" stroke="currentColor" strokeWidth="2" />
    </motion.svg>
  );
}

function HeaderDoodles() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-72 overflow-hidden" aria-hidden>
      <motion.span
        className="absolute top-20 left-[8%] text-lg text-ivory/35"
        animate={{ y: [0, -6, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        ✦
      </motion.span>
      <motion.span
        className="absolute top-28 left-[22%] text-sm text-ivory/25"
        animate={{ y: [0, 8, 0], opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        ✧
      </motion.span>
      <motion.span
        className="absolute top-16 right-[28%] text-xl text-ivory/30"
        animate={{ y: [0, -8, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
      >
        ❋
      </motion.span>
      <motion.span
        className="absolute top-32 right-[12%] text-base text-ivory/30"
        animate={{ y: [0, 7, 0] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
      >
        ✦
      </motion.span>
      <svg viewBox="0 0 140 80" className="absolute top-24 left-[38%] h-16 w-28 text-ivory/20">
        <motion.path
          d="M8 40 C28 18 48 62 68 36 C84 18 104 52 132 28"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0.15, 1, 0.15] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      <svg viewBox="0 0 80 80" className="absolute top-14 right-[36%] h-12 w-12 text-ivory/20">
        <motion.path
          d="M8 40 H36 M40 8 V36 M44 44 L62 62"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ rotate: [0, 12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
