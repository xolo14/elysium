import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import type { Hotel, Suite } from "@/data/hotels";
import { formatStayCompact } from "@/lib/booking-dates";
import {
  computePricing,
  formatInr,
  parseRate,
} from "@/lib/booking-pricing";
import { easeLuxe, fadeUp, stagger, tapSoft } from "@/lib/motion-ui";
import { cn } from "@/lib/utils";
import type { CheckoutDraft } from "@/components/booking/BookingCheckout";

export type ContactForm = {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
};

type BookingContactProps = {
  hotel: Hotel;
  suite: Suite;
  checkIn: string;
  checkOut: string;
  nights: number;
  draft: CheckoutDraft;
  form: ContactForm;
  signedInAs?: string | null;
  onFormChange: (next: Partial<ContactForm>) => void;
  onEditRooms: () => void;
  onBack: () => void;
  submitting: boolean;
  error: string | null;
  onSubmit: (e: React.FormEvent) => void;
};

export function BookingContact({
  hotel,
  suite,
  checkIn,
  checkOut,
  nights,
  draft,
  form,
  signedInAs = null,
  onFormChange,
  onEditRooms,
  onBack,
  submitting,
  error,
  onSubmit,
}: BookingContactProps) {
  const [gstOpen, setGstOpen] = useState(false);
  const [gst, setGst] = useState({ company: "", gstin: "" });
  const [consent, setConsent] = useState(true);

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

  const address = hotel.contact.address.slice(1).join(" ");
  const canPay =
    consent &&
    form.email.trim() &&
    form.phone.trim() &&
    form.firstName.trim() &&
    form.lastName.trim() &&
    (!gstOpen || (gst.company.trim() && gst.gstin.trim()));

  return (
    <form
      onSubmit={onSubmit}
      className="flex min-h-[100svh] flex-col bg-forest pt-[4.5rem]"
    >
      <div className="page-wrap relative pb-3 pt-5 sm:pb-4 sm:pt-8">
        <motion.button
          type="button"
          whileTap={tapSoft}
          onClick={onBack}
          className="btn-quiet mb-2.5 text-[13px] font-semibold text-ivory/80 hover:text-ivory sm:mb-3 sm:text-sm"
        >
          ← Payment
        </motion.button>
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.5, ease: easeLuxe }}
          className="display-nav text-[clamp(1.65rem,6vw,2.5rem)] text-ivory"
        >
          Booking Details
        </motion.h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.06, ease: easeLuxe }}
        className="sheet-luxe flex flex-1 flex-col pb-[5.5rem] pt-5 sm:pt-8"
      >
        <div className="page-wrap space-y-7 sm:space-y-8">
          <motion.section
            {...fadeUp}
            transition={stagger(0)}
            className="rounded-[12px] border border-neutral-100 bg-white shadow-[0_12px_40px_-28px_rgba(0,0,0,0.35)]"
          >
            <div className="p-5 sm:p-6">
              <h2 className="font-nav text-lg font-extrabold text-neutral-800">{hotel.name}</h2>
              <p className="mt-1 text-sm leading-relaxed text-neutral-500">{address}</p>

              <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-nav text-base font-extrabold text-neutral-800">
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

              <div className="mt-5 border-t border-neutral-100 pt-4">
                <p className="text-sm font-semibold text-neutral-700">
                  {draft.rooms} {suite.name}
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  · {draft.payNow ? "Paying Now" : "Pay at hotel"}
                </p>
              </div>

              <motion.button
                type="button"
                whileTap={tapSoft}
                onClick={onEditRooms}
                className="btn-quiet mt-4 text-sm font-semibold text-neutral-700 underline underline-offset-4"
              >
                ‹ Add or edit rooms
              </motion.button>
            </div>
          </motion.section>

          <motion.section {...fadeUp} transition={stagger(1)}>
            <h2 className="font-nav text-xl font-extrabold text-bronze sm:text-2xl">
              Contact Details
            </h2>
            {signedInAs ? (
              <p className="mt-2 text-sm font-medium text-forest">
                Signed in as {signedInAs} — details filled from your account. Edit anytime.
              </p>
            ) : (
              <p className="mt-2 text-sm text-neutral-400">
                Login / Join in the header to autofill these fields next time.
              </p>
            )}
            <div className="mt-4 grid gap-3">
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="Email ID"
                value={form.email}
                onChange={(e) => onFormChange({ email: e.target.value })}
                className="field-luxe"
              />
              <input
                required
                type="tel"
                autoComplete="tel"
                placeholder="Mobile Number"
                value={form.phone}
                onChange={(e) => onFormChange({ phone: e.target.value })}
                className="field-luxe"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required
                  type="text"
                  autoComplete="given-name"
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => onFormChange({ firstName: e.target.value })}
                  className="field-luxe"
                />
                <input
                  required
                  type="text"
                  autoComplete="family-name"
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => onFormChange({ lastName: e.target.value })}
                  className="field-luxe"
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            {...fadeUp}
            transition={stagger(2)}
            className="border-t border-neutral-100 pt-6"
          >
            <h2 className="font-nav text-lg font-extrabold text-neutral-700">GST Details</h2>
            <p className="mt-1 text-sm text-neutral-400">Add details for input tax benefits.</p>
            <label className="mt-4 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={gstOpen}
                onChange={(e) => setGstOpen(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-neutral-300 accent-forest"
              />
              <span className="text-sm text-neutral-600">Add GST Details (optional)</span>
            </label>
            <AnimatePresence initial={false}>
              {gstOpen ? (
                <motion.div
                  key="gst"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.35, ease: easeLuxe }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 grid gap-3">
                    <input
                      type="text"
                      placeholder="Company name"
                      value={gst.company}
                      onChange={(e) => setGst((g) => ({ ...g, company: e.target.value }))}
                      className="field-luxe"
                    />
                    <input
                      type="text"
                      placeholder="GSTIN"
                      value={gst.gstin}
                      onChange={(e) =>
                        setGst((g) => ({ ...g, gstin: e.target.value.toUpperCase() }))
                      }
                      className="field-luxe"
                    />
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.section>

          <motion.label
            {...fadeUp}
            transition={stagger(3)}
            className="flex items-start gap-3 border-t border-neutral-100 pt-6"
          >
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-neutral-300 accent-forest"
            />
            <span className="text-sm leading-relaxed text-neutral-600">
              I consent to the collection, processing, and storage of my personal data as per the{" "}
              <Link to="/privacy" className="underline underline-offset-2 transition-opacity hover:opacity-70">
                Privacy Policy
              </Link>
              .
            </span>
          </motion.label>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <motion.section
            {...fadeUp}
            transition={stagger(4)}
            className="border-t border-neutral-100 pt-8 pb-6"
          >
            <h2 className="font-nav text-xl font-extrabold text-neutral-800">Price Breakdown</h2>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-neutral-700">
                    {draft.rooms} {suite.name} × {nights} Night{nights === 1 ? "" : "s"}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {pricing.plan.shortLabel}, {draft.guests} Adult
                    {draft.guests === 1 ? "" : "s"}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-bold text-forest">
                  {formatInr(pricing.roomLine + pricing.mealLine)}
                </p>
              </li>
              {pricing.promoDiscount > 0 ? (
                <li className="flex justify-between gap-4">
                  <p className="text-sm font-semibold text-bronze">Promotional Discount</p>
                  <p className="text-sm font-bold text-bronze">− {formatInr(pricing.promoDiscount)}</p>
                </li>
              ) : null}
              {pricing.payNowDiscount > 0 ? (
                <li className="flex justify-between gap-4">
                  <p className="text-sm font-semibold text-bronze">Pay Now Discount</p>
                  <p className="text-sm font-bold text-bronze">− {formatInr(pricing.payNowDiscount)}</p>
                </li>
              ) : null}
              <li className="flex justify-between gap-4">
                <p className="text-sm font-semibold text-neutral-700">Taxes &amp; Other Charges</p>
                <p className="text-sm font-bold text-forest">{formatInr(pricing.taxes)}</p>
              </li>
            </ul>
            <div className="mt-5 flex items-center justify-between border-t border-neutral-200 pt-5">
              <p className="font-nav font-extrabold text-neutral-800">Payable amount</p>
              <p className="font-nav text-xl font-extrabold text-forest">
                {formatInr(pricing.payable)}
              </p>
            </div>
            {pricing.savings > 0 ? (
              <p className="mt-3 text-sm font-semibold text-bronze">
                % You are saving {formatInr(pricing.savings)} by booking directly
              </p>
            ) : null}
            <div className="mt-8 space-y-2 text-sm text-neutral-500">
              <p>Facing an Issue? Call us for assistance.</p>
              <a
                href={`tel:${hotel.contact.phone.replace(/\s/g, "")}`}
                className="inline-block font-semibold text-neutral-800 underline underline-offset-4 transition-opacity hover:opacity-70"
              >
                {hotel.contact.phone}
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
          </motion.section>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.2, ease: easeLuxe }}
        className="sticky-luxe safe-bottom fixed inset-x-0 bottom-0 z-40"
      >
        <div className="page-wrap flex items-center justify-between gap-3 py-2.5 sm:gap-4 sm:py-3">
          <div className="min-w-0">
            <p className="font-nav text-base font-extrabold text-forest sm:text-lg">
              {formatInr(pricing.payable)}{" "}
              <span className="text-xs font-bold sm:text-sm">total</span>
            </p>
            <p className="text-[10px] text-neutral-400 sm:text-[11px]">Payable amount</p>
          </div>
          <motion.button
            type="submit"
            whileHover={canPay && !submitting ? { scale: 1.02 } : undefined}
            whileTap={canPay && !submitting ? tapSoft : undefined}
            disabled={submitting || !canPay}
            className={cn(
              "btn-primary min-h-11 shrink-0 px-5 sm:min-h-12 sm:px-8",
              "disabled:cursor-not-allowed disabled:opacity-40",
            )}
          >
            {submitting ? "Booking…" : "Pay and Book"}
          </motion.button>
        </div>
      </motion.div>
    </form>
  );
}
