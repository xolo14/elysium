import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

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
import { cn } from "@/lib/utils";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

type DateRangePickerProps = {
  checkIn: string;
  checkOut: string;
  onRangeChange: (checkIn: string, checkOut: string) => void;
  onConfirm?: () => void;
  minDate?: Date;
  className?: string;
  /** Bloom-style yellow range + sun confirm bar */
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
  const checkInDate = useMemo(
    () => (checkIn ? startOfDay(new Date(checkIn)) : null),
    [checkIn],
  );
  const checkOutDate = useMemo(
    () => (checkOut ? startOfDay(new Date(checkOut)) : null),
    [checkOut],
  );

  const [viewMonth, setViewMonth] = useState(() => {
    const d = checkIn ? new Date(checkIn) : new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const secondMonth = useMemo(() => {
    const d = new Date(viewMonth.year, viewMonth.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [viewMonth]);

  const canConfirm = Boolean(checkIn && checkOut && checkOut > checkIn);
  const nights = canConfirm ? nightsBetween(checkIn, checkOut) : 0;

  const selectDate = (date: Date) => {
    if (isBeforeDay(date, today)) return;

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
        onRangeChange(checkIn, toInputDate(addDays(date, 1)));
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
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const goNext = () => {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const renderMonth = (year: number, month: number) => (
    <div className="min-w-0 flex-1">
      <p
        className={cn(
          "mb-3 text-center font-nav text-base leading-none font-extrabold sm:mb-4 sm:text-lg",
          bloom ? "text-sun" : "font-display text-forest",
        )}
      >
        {monthLabel(year, month)}
      </p>
      <div
        className="grid grid-cols-7 text-center"
        style={{ gridTemplateRows: "1.75rem repeat(6, 2.65rem)" }}
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
          const disabled = !inMonth || isBeforeDay(date, today);
          const isStart = Boolean(checkInDate && sameDay(date, checkInDate) && inMonth);
          const isEnd = Boolean(checkOutDate && sameDay(date, checkOutDate) && inMonth);
          const selected = isStart || isEnd;
          const ranged = inRange(date) && inMonth;
          const mid = ranged && !selected;

          return (
            <button
              key={`${year}-${month}-c${cellIndex}`}
              type="button"
              disabled={disabled}
              onClick={() => selectDate(date)}
              className={cn(
                "relative mx-auto flex h-10 w-full items-center justify-center text-sm transition-colors sm:h-11",
                !inMonth && "invisible pointer-events-none",
                disabled && inMonth && "cursor-not-allowed text-neutral-300",
                !disabled && !selected && !mid && "text-neutral-700",
                bloom && mid && "bg-sun text-ivory",
                bloom && isStart && checkOutDate && "bg-gradient-to-r from-transparent from-50% to-sun to-50%",
                bloom && isEnd && checkInDate && "bg-gradient-to-l from-transparent from-50% to-sun to-50%",
                !bloom && mid && "bg-forest/10 text-foreground",
                bloom && selected && "z-[1]",
              )}
            >
              {bloom && selected ? (
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-sun bg-white font-semibold text-neutral-800 sm:h-10 sm:w-10">
                  {date.getDate()}
                </span>
              ) : bloom && mid ? (
                <span className="font-semibold">{date.getDate()}</span>
              ) : (
                <span
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full sm:h-10 sm:w-10",
                    !bloom && selected && "bg-forest font-medium text-ivory",
                    !disabled && !selected && "hover:bg-neutral-100",
                  )}
                >
                  {date.getDate()}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex w-full flex-col overflow-hidden bg-white",
        bloom ? "rounded-[20px]" : "border border-border",
        className,
      )}
    >
      <div className="relative flex-1 px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous month"
          className={cn(
            "absolute top-6 left-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full sm:left-5",
            bloom ? "bg-neutral-200 text-neutral-500" : "border border-border bg-background text-forest",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next month"
          className={cn(
            "absolute top-6 right-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full sm:right-5",
            bloom ? "bg-sun text-ivory" : "border border-forest bg-forest text-ivory",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-8 sm:px-10 lg:flex-row lg:gap-12 lg:px-12">
          {renderMonth(viewMonth.year, viewMonth.month)}
          <div className="hidden min-w-0 flex-1 lg:block">
            {renderMonth(secondMonth.year, secondMonth.month)}
          </div>
        </div>
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
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className={cn(
              "nav-cta min-h-12 w-full shrink-0 rounded-[10px] px-10 py-3 text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto",
              bloom ? "bg-sun" : "bg-forest",
            )}
          >
            Confirm
          </button>
        </div>
      ) : null}
    </div>
  );
}
