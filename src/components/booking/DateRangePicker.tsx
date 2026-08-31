import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import {
  addDays,
  buildMonthCells,
  formatStayDate,
  isAfterDay,
  isBeforeDay,
  monthLabel,
  nightsBetween,
  sameDay,
  startOfDay,
  toInputDate,
} from "@/lib/booking-dates";
import { easeLuxe, tapSoft } from "@/lib/motion-ui";
import { cn } from "@/lib/utils";

const springSelect = { type: "spring", stiffness: 520, damping: 28, mass: 0.7 } as const;
const springSoft = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
/** Bookable window: this month through 6 months ahead (7 months total). */
const BOOKABLE_MONTHS = 7;

type MonthCursor = { year: number; month: number };

function monthKey(m: MonthCursor) {
  return m.year * 12 + m.month;
}

function addMonths(m: MonthCursor, delta: number): MonthCursor {
  const d = new Date(m.year, m.month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

function clampMonth(m: MonthCursor, min: MonthCursor, max: MonthCursor): MonthCursor {
  const k = monthKey(m);
  if (k < monthKey(min)) return min;
  if (k > monthKey(max)) return max;
  return m;
}

type DateRangePickerProps = {
  checkIn: string;
  checkOut: string;
  onRangeChange: (checkIn: string, checkOut: string) => void;
  onConfirm?: () => void;
  minDate?: Date;
  className?: string;
  /** Card calendar layout (Bloom structure, Elysium forest colours) */
  bloom?: boolean;
};

export function DateRangePicker({
  checkIn,
  checkOut,
  onRangeChange,
  onConfirm,
  minDate,
  className,
  bloom = false,
}: DateRangePickerProps) {
  const today = useMemo(() => startOfDay(minDate ?? new Date()), [minDate]);
  const firstMonth = useMemo(
    () => ({ year: today.getFullYear(), month: today.getMonth() }),
    [today],
  );
  /** Last bookable month (present + 6 = 7 months total). */
  const lastMonth = useMemo(() => addMonths(firstMonth, BOOKABLE_MONTHS - 1), [firstMonth]);
  /** Last day selectable in the window. */
  const maxDate = useMemo(
    () => startOfDay(new Date(lastMonth.year, lastMonth.month + 1, 0)),
    [lastMonth],
  );

  const checkInDate = useMemo(
    () => (checkIn ? startOfDay(new Date(checkIn)) : null),
    [checkIn],
  );
  const checkOutDate = useMemo(
    () => (checkOut ? startOfDay(new Date(checkOut)) : null),
    [checkOut],
  );

  const [viewMonth, setViewMonth] = useState<MonthCursor>(() => {
    const d = checkIn ? new Date(checkIn) : today;
    return clampMonth(
      { year: d.getFullYear(), month: d.getMonth() },
      { year: today.getFullYear(), month: today.getMonth() },
      addMonths(
        { year: today.getFullYear(), month: today.getMonth() },
        BOOKABLE_MONTHS - 1,
      ),
    );
  });

  const secondMonth = useMemo(() => addMonths(viewMonth, 1), [viewMonth]);

  /** Previous hidden on present month; next hidden at end of 7-month window. */
  const canGoPrev = monthKey(viewMonth) > monthKey(firstMonth);
  const canGoNext = monthKey(viewMonth) < monthKey(lastMonth);

  const canConfirm = Boolean(checkIn && checkOut && checkOut > checkIn);
  const nights = canConfirm ? nightsBetween(checkIn, checkOut) : 0;
  const waitingForDates = !canConfirm;

  const selectDate = (date: Date) => {
    if (isBeforeDay(date, today) || isAfterDay(date, maxDate)) return;

    const iso = toInputDate(date);
    const hasCompleteRange = Boolean(checkIn && checkOut && checkOut > checkIn);

    if (hasCompleteRange) {
      onRangeChange(iso, "");
      return;
    }

    if (!checkIn) {
      onRangeChange(iso, "");
      return;
    }

    if (!checkOutDate || !checkInDate) {
      if (isBeforeDay(date, checkInDate!)) {
        onRangeChange(iso, "");
        return;
      }
      if (sameDay(date, checkInDate)) {
        const next = addDays(date, 1);
        if (isAfterDay(next, maxDate)) return;
        onRangeChange(checkIn, toInputDate(next));
        return;
      }
      onRangeChange(checkIn, iso);
    }
  };

  const inRange = (date: Date) => {
    if (!checkInDate || !checkOutDate || !checkIn || !checkOut || checkOut <= checkIn) {
      return false;
    }
    return !isBeforeDay(date, checkInDate) && !isAfterDay(date, checkOutDate);
  };

  const goPrev = () => {
    if (!canGoPrev) return;
    setViewMonth((prev) => clampMonth(addMonths(prev, -1), firstMonth, lastMonth));
  };

  const goNext = () => {
    if (!canGoNext) return;
    setViewMonth((prev) => clampMonth(addMonths(prev, 1), firstMonth, lastMonth));
  };

  const renderMonth = (year: number, month: number) => (
    <div className="min-w-0 flex-1">
      <p
        className={cn(
          "mb-3 text-center font-nav text-base leading-none font-extrabold sm:mb-4 sm:text-lg",
          bloom ? "font-nav text-forest" : "font-display text-forest",
        )}
      >
        {monthLabel(year, month)}
      </p>
      <div
        className="grid grid-cols-7 text-center"
        style={{ gridTemplateRows: "1.5rem repeat(6, minmax(2.35rem, 2.65rem))" }}
      >
        {WEEKDAYS.map((day, i) => (
          <span
            key={`${year}-${month}-wd-${i}`}
            className="flex items-center justify-center text-[0.7rem] font-semibold text-neutral-400"
          >
            {day}
          </span>
        ))}
        {buildMonthCells(year, month).map(({ date, inMonth }, cellIndex) => {
          const outOfWindow = isBeforeDay(date, today) || isAfterDay(date, maxDate);
          const disabled = !inMonth || outOfWindow;
          const isStart = Boolean(checkInDate && sameDay(date, checkInDate) && inMonth);
          const isEnd = Boolean(checkOutDate && sameDay(date, checkOutDate) && inMonth);
          const selected = isStart || isEnd;
          const ranged = inRange(date) && inMonth;
          const mid = ranged && !selected;
          const dayNum = date.getDate();
          const rangeOffset =
            checkInDate && ranged
              ? Math.max(0, Math.round((date.getTime() - checkInDate.getTime()) / 86400000))
              : 0;

          return (
            <motion.button
              key={`${year}-${month}-c${cellIndex}`}
              type="button"
              disabled={disabled}
              onClick={() => selectDate(date)}
              whileTap={disabled ? undefined : { scale: 0.92 }}
              className={cn(
                "relative mx-auto flex h-10 w-full items-center justify-center text-sm sm:h-11",
                !inMonth && "invisible pointer-events-none",
                disabled && inMonth && "cursor-not-allowed text-neutral-300",
                !disabled && !selected && !mid && "text-neutral-700",
                bloom && selected && "z-[2]",
              )}
            >
              {/* Range bridge behind endpoints */}
              {bloom && isStart && checkOutDate ? (
                <motion.span
                  layout
                  initial={{ opacity: 0, scaleX: 0.4 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={springSoft}
                  className="absolute inset-y-0 right-0 left-1/2 origin-left bg-forest"
                  aria-hidden
                />
              ) : null}
              {bloom && isEnd && checkInDate ? (
                <motion.span
                  layout
                  initial={{ opacity: 0, scaleX: 0.4 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={springSoft}
                  className="absolute inset-y-0 right-1/2 left-0 origin-right bg-forest"
                  aria-hidden
                />
              ) : null}

              {/* Mid-range wash */}
              <AnimatePresence>
                {bloom && mid ? (
                  <motion.span
                    key="mid"
                    initial={{ opacity: 0, scaleY: 0.55 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0.7 }}
                    transition={{
                      ...springSoft,
                      delay: Math.min(rangeOffset, 8) * 0.018,
                    }}
                    className="absolute inset-0 bg-forest"
                    aria-hidden
                  />
                ) : null}
              </AnimatePresence>

              {!bloom && mid ? (
                <span className="absolute inset-0 bg-forest/10" aria-hidden />
              ) : null}

              {bloom && selected ? (
                <span className="relative z-[1] flex h-9 w-9 items-center justify-center sm:h-10 sm:w-10">
                  {/* Soft expand ring */}
                  <motion.span
                    key={`ring-${isStart ? "in" : "out"}-${toInputDate(date)}`}
                    initial={{ scale: 0.35, opacity: 0.55 }}
                    animate={{ scale: 1.55, opacity: 0 }}
                    transition={{ duration: 0.45, ease: easeLuxe }}
                    className="absolute inset-0 rounded-full bg-forest/25"
                    aria-hidden
                  />
                  <motion.span
                    layoutId={isStart ? "cal-check-in" : "cal-check-out"}
                    initial={{ scale: 0.55, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={springSelect}
                    className="relative flex h-full w-full items-center justify-center rounded-full bg-forest font-bold text-ivory shadow-[0_8px_20px_-10px_rgba(6,51,44,0.65)]"
                  >
                    <motion.span
                      key={dayNum}
                      initial={{ y: 6, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.22, ease: easeLuxe }}
                    >
                      {dayNum}
                    </motion.span>
                  </motion.span>
                </span>
              ) : bloom && mid ? (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.22,
                    delay: Math.min(rangeOffset, 8) * 0.018,
                    ease: easeLuxe,
                  }}
                  className="relative z-[1] font-semibold text-ivory"
                >
                  {dayNum}
                </motion.span>
              ) : (
                <span
                  className={cn(
                    "relative z-[1] flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10",
                    !bloom && selected && "bg-forest font-medium text-ivory",
                    !disabled && !selected && "hover:bg-neutral-100",
                  )}
                >
                  {dayNum}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden bg-white",
        bloom ? "rounded-[16px] sm:rounded-[20px]" : "border border-border",
        className,
      )}
    >
      <div className="relative flex-1 px-2.5 py-5 sm:px-6 sm:py-8 lg:px-8">
        {canGoPrev ? (
          <motion.button
            type="button"
            whileTap={tapSoft}
            onClick={goPrev}
            aria-label="Previous month"
            className={cn(
              "absolute top-6 left-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full sm:left-5",
              bloom ? "bg-neutral-200 text-neutral-500" : "border border-border bg-background text-forest",
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.button>
        ) : null}
        {canGoNext ? (
          <motion.button
            type="button"
            whileTap={tapSoft}
            onClick={goNext}
            aria-label="Next month"
            className={cn(
              "absolute top-6 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full sm:right-5",
              bloom ? "bg-forest text-ivory" : "border border-forest bg-forest text-ivory",
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        ) : null}

        <p className="mb-4 flex items-center justify-center gap-1.5 px-9 text-center text-[11px] font-medium text-neutral-500 sm:mb-6 sm:px-10 sm:text-[13px]">
          <span aria-hidden="true">⏳</span>
          {waitingForDates
            ? "Wait a little — pick check-in & check-out"
            : "Dates locked in — confirm when you’re ready"}
        </p>

        <LayoutGroup id="elysium-cal-range">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-2 sm:px-8 lg:flex-row lg:gap-10 lg:px-10">
            {renderMonth(viewMonth.year, viewMonth.month)}
            {monthKey(secondMonth) <= monthKey(lastMonth) ? (
              <div className="hidden min-w-0 flex-1 lg:block">
                {renderMonth(secondMonth.year, secondMonth.month)}
              </div>
            ) : null}
          </div>
        </LayoutGroup>
      </div>

      {onConfirm ? (
        <div
          className={cn(
            "flex flex-col gap-4 border-t px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8 sm:py-5",
            bloom ? "border-neutral-100" : "border-border",
          )}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex min-w-0 items-start gap-3 sm:gap-5">
              <div>
                <p className="font-nav text-sm font-extrabold text-neutral-800 sm:text-base">
                  {checkIn ? formatStayDate(checkIn) : "Select date"}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">Check-in</p>
              </div>
              <span className="mt-1 text-forest" aria-hidden="true">
                →
              </span>
              <div>
                <p className="font-nav text-sm font-extrabold text-neutral-800 sm:text-base">
                  {checkOut ? formatStayDate(checkOut) : "Select date"}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">Check-out</p>
              </div>
            </div>
            {nights > 0 ? (
              <span className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-semibold text-neutral-600">
                {nights} Night{nights === 1 ? "" : "s"}
              </span>
            ) : null}
            <p className="hidden items-center gap-1.5 text-xs font-semibold text-forest sm:flex lg:text-[13px]">
              <span aria-hidden="true">⚡</span>
              Book Direct for Lowest Prices!
            </p>
          </div>
          <motion.button
            type="button"
            disabled={!canConfirm}
            whileHover={canConfirm ? { scale: 1.02 } : undefined}
            whileTap={canConfirm ? tapSoft : undefined}
            transition={{ duration: 0.25, ease: easeLuxe }}
            onClick={onConfirm}
            className={cn(
              "nav-cta min-h-12 w-full shrink-0 rounded-[10px] px-10 py-3 text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto",
              "bg-forest",
            )}
          >
            Confirm
          </motion.button>
        </div>
      ) : null}
    </div>
  );
}
