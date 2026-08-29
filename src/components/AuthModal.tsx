import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { findSavedGuest, useGuest, type Guest } from "@/context/guest";
import { loyaltyLevels } from "@/data/loyalty";
import { cn } from "@/lib/utils";

const ease = [0.16, 1, 0.3, 1] as const;
const COUNTRY_CODES = ["+91", "+971", "+1", "+44"];

type FormStep = "email" | "details" | "otp";

export function AuthModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const { guest, ready, signIn } = useGuest();
  const [level, setLevel] = useState(0);
  const [paused, setPaused] = useState(false);
  const [formStep, setFormStep] = useState<FormStep>("email");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [codePrefix, setCodePrefix] = useState("+91");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [showRequired, setShowRequired] = useState(false);
  const [error, setError] = useState("");
  const [resent, setResent] = useState(false);
  const [returning, setReturning] = useState(false);
  const resumeTimer = useRef<number | null>(null);
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const split = formStep === "email" || formStep === "otp";

  useEffect(() => {
    if (!open || !ready) return;
    if (guest) {
      onOpenChange(false);
      void navigate({ to: "/account" });
      return;
    }
    setLevel(0);
    setPaused(false);
    setError("");
    setShowRequired(false);
    setResent(false);
    setReturning(false);
    setFormStep("email");
    setEmail("");
    setFirstName("");
    setLastName("");
    setCodePrefix("+91");
    setMobile("");
    setOtp(["", "", "", "", ""]);
  }, [open, ready]);

  useEffect(() => {
    if (!open || paused || formStep === "details") return;
    const id = window.setInterval(() => {
      setLevel((n) => (n + 1) % loyaltyLevels.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [open, paused, formStep]);

  const pickLevel = (index: number) => {
    setLevel(index);
    setPaused(true);
    if (resumeTimer.current) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = window.setTimeout(() => setPaused(false), 10000);
  };

  const current = loyaltyLevels[level] ?? loyaltyLevels[0]!;

  const finish = (profile: Guest) => {
    signIn(profile);
    onOpenChange(false);
    void navigate({ to: "/account" });
  };

  const onEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a valid email address.");
      return;
    }
    setEmail(value);
    setError("");
    const saved = findSavedGuest(value);
    if (saved) {
      setFirstName(saved.firstName);
      setLastName(saved.lastName);
      const parts = saved.mobile.split(" ");
      if (parts[0]?.startsWith("+")) {
        setCodePrefix(parts[0]);
        setMobile(parts.slice(1).join(" "));
      } else {
        setMobile(saved.mobile);
      }
      setReturning(true);
      setOtp(["", "", "", "", ""]);
      setFormStep("otp");
      setLevel(2);
      setPaused(true);
      window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
      return;
    }
    setReturning(false);
    setFormStep("details");
  };

  const onDetailsConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const phone = mobile.replace(/\D/g, "");
    if (firstName.trim().length < 2 || lastName.trim().length < 1 || phone.length < 8) {
      setShowRequired(true);
      return;
    }
    setShowRequired(false);
    setOtp(["", "", "", "", ""]);
    setFormStep("otp");
    setLevel(2);
    setPaused(true);
    window.setTimeout(() => otpRefs.current[0]?.focus(), 80);
  };

  const onOtpContinue = (digits: string[]) => {
    const pin = digits.join("");
    if (pin.length < 5) {
      setError("Enter the 5-digit code.");
      return;
    }
    setError("");
    const saved = findSavedGuest(email);
    finish({
      email,
      firstName: firstName.trim() || saved?.firstName || "Guest",
      lastName: lastName.trim() || saved?.lastName || "",
      mobile: `${codePrefix} ${mobile.replace(/\D/g, "")}`.trim(),
      stays: saved?.stays ?? 0,
    });
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-black/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-[81] w-[calc(100%-1rem)] max-h-[min(92svh,42rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[10px] bg-white shadow-[0_40px_80px_-28px_rgba(0,0,0,0.45)] sm:w-[calc(100%-1.5rem)]",
            "overflow-y-auto focus:outline-none sm:overflow-hidden",
            split
              ? "grid max-w-[52rem] md:grid-cols-[0.42fr_0.58fr]"
              : "max-w-[34rem]",
          )}
        >
          {split ? (
            <aside
              className="relative flex min-h-[12rem] flex-col bg-bronze px-5 py-5 text-ivory sm:px-7 sm:py-7 md:min-h-[30rem]"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <img src="/logo-light.svg" alt="Elysium" className="mb-5 h-7 w-auto self-start opacity-95" />
              <div className="flex flex-wrap gap-2">
                {loyaltyLevels.map((item, i) => (
                  <button
                    key={item.pill}
                    type="button"
                    onClick={() => pickLevel(i)}
                    className={cn(
                      "nav-cta rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors duration-500",
                      i === level
                        ? "border-ivory bg-ivory text-bronze"
                        : "border-ivory/55 bg-transparent text-ivory hover:border-ivory",
                    )}
                  >
                    {item.pill}
                  </button>
                ))}
              </div>
              <div className="relative mt-8 flex-1">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease }}
                    className="flex h-full flex-col"
                  >
                    <h3 className="font-nav text-[2rem] leading-none font-extrabold tracking-[-0.03em] sm:text-[2.35rem]">
                      {current.title}
                    </h3>
                    <p className="mt-3 max-w-[16rem] text-[15px] leading-snug text-ivory/90">{current.copy}</p>
                    <div className="mt-auto pt-6 text-ivory/80">
                      <LoyaltyArt kind={current.art} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </aside>
          ) : null}

          <div className="relative flex flex-col bg-white px-5 py-6 sm:px-8 sm:py-8 md:px-10 md:py-10">
            {!split ? (
              <img src="/logo-dark.svg" alt="Elysium" className="mb-5 h-7 w-auto self-start" />
            ) : null}
            <CloseButton />

            {formStep === "otp" ? (
              <button
                type="button"
                className="mb-5 flex items-center gap-1.5 text-[13px] font-medium text-neutral-400"
                onClick={() => {
                  setError("");
                  setFormStep(returning ? "email" : "details");
                }}
              >
                <span aria-hidden="true">←</span> Back
              </button>
            ) : null}

            <AnimatePresence mode="wait">
              {formStep === "email" ? (
                <motion.form
                  key="email"
                  onSubmit={onEmailContinue}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex flex-1 flex-col"
                >
                  <DialogPrimitive.Title className="font-nav text-[2.15rem] leading-none font-extrabold tracking-[-0.03em] text-bronze sm:text-[2.55rem]">
                    Login / Join
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-4 max-w-md text-[15px] leading-relaxed text-neutral-500">
                    Manage bookings, track benefits &amp; save up to 15% extra on every stay with Elysium loyalty.
                  </DialogPrimitive.Description>
                  <div className="mt-8">
                    <FloatField
                      id="auth-email"
                      label="Email Address"
                      placeholder="Enter Email Address"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(v) => {
                        setEmail(v);
                        setError("");
                      }}
                    />
                  </div>
                  {error ? <p className="mt-2 text-[13px] text-red-500">{error}</p> : null}
                  <button type="submit" className="auth-continue mt-6">
                    Continue
                  </button>
                  <LegalNote onClose={() => onOpenChange(false)} />
                </motion.form>
              ) : null}

              {formStep === "details" ? (
                <motion.form
                  key="details"
                  onSubmit={onDetailsConfirm}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex flex-1 flex-col"
                >
                  <button
                    type="button"
                    className="flex items-center gap-2 text-left text-[14px] text-neutral-500"
                    onClick={() => setFormStep("email")}
                  >
                    {email}
                    <PencilIcon />
                  </button>
                  <DialogPrimitive.Title className="mt-5 font-nav text-[2.15rem] leading-none font-extrabold tracking-[-0.03em] text-bronze sm:text-[2.45rem]">
                    Member Details
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-3 max-w-md text-[15px] leading-relaxed text-neutral-500">
                    Thank you for joining Elysium. We look forward to seeing you soon.
                  </DialogPrimitive.Description>

                  <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    <FloatField
                      id="auth-first"
                      label="First Name"
                      placeholder=""
                      type="text"
                      autoComplete="given-name"
                      invalid
                      value={firstName}
                      onChange={setFirstName}
                    />
                    <FloatField
                      id="auth-last"
                      label="Last Name"
                      placeholder=""
                      type="text"
                      autoComplete="family-name"
                      invalid
                      value={lastName}
                      onChange={setLastName}
                    />
                    <div className="relative sm:col-span-2">
                      <label
                        htmlFor="auth-mobile"
                        className="absolute -top-2 left-3 z-10 bg-white px-1 text-[12px] font-medium text-neutral-500"
                      >
                        Mobile
                      </label>
                      <div
                        className={cn(
                          "flex h-14 items-center rounded-[10px] border",
                          showRequired && mobile.replace(/\D/g, "").length < 8
                            ? "border-red-400"
                            : "border-red-300 focus-within:border-bronze",
                        )}
                      >
                        <select
                          value={codePrefix}
                          onChange={(e) => setCodePrefix(e.target.value)}
                          className="h-full rounded-l-[10px] border-0 bg-transparent pl-3 text-[14px] font-semibold text-bronze outline-none"
                          aria-label="Country code"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <input
                          id="auth-mobile"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          className="h-full min-w-0 flex-1 rounded-r-[10px] border-0 bg-transparent px-3 text-[15px] text-forest outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-[13px] text-red-500">* Please fill all required details</p>
                  <button type="submit" className="auth-continue mt-4">
                    Confirm Membership
                  </button>
                </motion.form>
              ) : null}

              {formStep === "otp" ? (
                <motion.form
                  key="otp"
                  onSubmit={(e) => {
                    e.preventDefault();
                    onOtpContinue(otp);
                  }}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex flex-1 flex-col"
                >
                  <DialogPrimitive.Title className="font-nav text-[2.15rem] leading-none font-extrabold tracking-[-0.03em] text-bronze sm:text-[2.55rem]">
                    Verify Email
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-4 text-[15px] leading-relaxed text-neutral-500">
                    Enter the 5-digit OTP sent to {email}
                  </DialogPrimitive.Description>

                  <div className="mt-8 flex gap-2.5">
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          otpRefs.current[i] = el;
                        }}
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        placeholder="-"
                        aria-label={`Digit ${i + 1}`}
                        className="h-14 w-full rounded-[10px] border border-neutral-300 text-center font-nav text-xl font-bold text-forest outline-none placeholder:text-neutral-300 focus:border-bronze"
                        onPaste={(e) => {
                          const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
                          if (!pasted) return;
                          e.preventDefault();
                          const next = ["", "", "", "", ""];
                          pasted.split("").forEach((ch, idx) => {
                            next[idx] = ch;
                          });
                          setOtp(next);
                          otpRefs.current[Math.min(pasted.length, 4)]?.focus();
                          if (pasted.length === 5) window.setTimeout(() => onOtpContinue(next), 80);
                        }}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, "").slice(-1);
                          const next = [...otp];
                          next[i] = v;
                          setOtp(next);
                          setError("");
                          if (v && i < 4) otpRefs.current[i + 1]?.focus();
                          if (v && i === 4 && next.every((d) => d)) {
                            window.setTimeout(() => onOtpContinue(next), 80);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otp[i] && i > 0) {
                            otpRefs.current[i - 1]?.focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                  {error ? <p className="mt-2 text-[13px] text-red-500">{error}</p> : null}
                  <p className="mt-4 text-[14px] text-neutral-500">
                    Didn&apos;t get a code?{" "}
                    <button
                      type="button"
                      className="font-bold text-forest underline underline-offset-2"
                      onClick={() => {
                        setOtp(["", "", "", "", ""]);
                        setResent(true);
                        setError("");
                        otpRefs.current[0]?.focus();
                      }}
                    >
                      Resend otp
                    </button>
                    {resent ? <span className="ml-2 text-bronze">Sent.</span> : null}
                  </p>
                  <p className="mt-2 text-[12px] text-neutral-400">Any 5 digits will continue on this device.</p>
                  <button type="submit" className="auth-continue mt-6">
                    Continue
                  </button>
                </motion.form>
              ) : null}
            </AnimatePresence>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function CloseButton() {
  return (
    <DialogPrimitive.Close
      className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-500 text-white transition-opacity hover:opacity-80"
      aria-label="Close"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          d="M3.2 3.2 L12.8 12.8 M12.8 3.2 L3.2 12.8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </DialogPrimitive.Close>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 text-neutral-400" aria-hidden="true">
      <path
        d="M11.2 2.4 l2.4 2.4 L5.6 13 H3.2 v-2.4 z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LegalNote({ onClose }: { onClose: () => void }) {
  return (
    <p className="mt-8 text-[12px] leading-relaxed text-neutral-400">
      By continuing, you agree to the{" "}
      <Link to="/terms" onClick={onClose} className="underline">
        terms of use
      </Link>
      ,{" "}
      <Link to="/privacy" onClick={onClose} className="underline">
        privacy &amp; cookie policy
      </Link>
      .
    </p>
  );
}

function FloatField({
  id,
  label,
  placeholder,
  type,
  autoComplete,
  value,
  onChange,
  invalid,
}: {
  id: string;
  label: string;
  placeholder: string;
  type: string;
  autoComplete: string;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
}) {
  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="absolute -top-2 left-3 z-10 bg-white px-1 text-[12px] font-medium text-neutral-500"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-14 w-full rounded-[10px] border px-4 text-[15px] text-forest outline-none placeholder:text-neutral-400",
          invalid ? "border-red-400" : "border-neutral-300 focus:border-bronze",
        )}
      />
    </div>
  );
}

function LoyaltyArt({ kind }: { kind: (typeof loyaltyLevels)[number]["art"] }) {
  if (kind === "drive") {
    return (
      <svg viewBox="0 0 220 110" className="h-28 w-full max-w-[16rem]" fill="none" aria-hidden="true">
        <circle cx="168" cy="22" r="10" stroke="currentColor" strokeWidth="1.6" />
        <path d="M150 18h12 M186 18h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M18 78h28l12-28h72l18 28h28" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M70 50 v28 M118 50 v28" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="62" cy="88" r="10" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="150" cy="88" r="10" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="92" cy="62" r="6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    );
  }
  if (kind === "fly") {
    return (
      <svg viewBox="0 0 220 110" className="h-28 w-full max-w-[16rem]" fill="none" aria-hidden="true">
        <path d="M24 86 V48 h28 v38 M52 62 h42 v24" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M34 58h8 M34 70h8 M64 72h18 M64 80h18" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="168" cy="24" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M120 78 L198 54 L176 78 L198 86 L120 78 Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M36 96 h48" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 220 110" className="h-28 w-full max-w-[16rem]" fill="none" aria-hidden="true">
      <rect x="28" y="18" width="164" height="78" rx="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M52 44 h36 M52 56 h28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="148" cy="48" r="14" stroke="currentColor" strokeWidth="1.6" />
      <path d="M148 40 v8 l6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="64" cy="78" r="6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M84 78 h28 M124 78 h36" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
