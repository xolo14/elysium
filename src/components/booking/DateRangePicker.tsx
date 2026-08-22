import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import {
  addDays,
  buildMonthCells,
  formatShort,
  isAfterDay,
  isBeforeDay,
  monthLabel,
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
  onConfirm: () => void;
  minDate?: Date;
  className?: string;
};

export function DateRangePicker({
  checkIn,
  checkOut,
  onRangeChange,
  onConfirm,
  minDate,
  className,
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
      <p className="mb-3 h-7 text-center font-display text-lg leading-7 text-accent sm:mb-4 sm:h-8 sm:text-xl sm:leading-8">
        {monthLabel(year, month)}
      </p>
      <div
        className="grid grid-cols-7 gap-x-0 gap-y-0 text-center"
        style={{ gridTemplateRows: "1.75rem repeat(6, 2.75rem)" }}
      >
        {WEEKDAYS.map((day, i) => (
          <span
            key={`${year}-${month}-wd-${i}`}
            className="flex items-center justify-center text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          >
            {day}
          </span>
        ))}
        {buildMonthCells(year, month).map(({ date, inMonth }, cellIndex) => {
          const disabled = !inMonth || isBeforeDay(date, today);
          const selected =
            (checkInDate && sameDay(date, checkInDate)) ||
            (checkOutDate && sameDay(date, checkOutDate));
          const ranged = inRange(date) && inMonth;

          return (
            <button
              key={`${year}-${month}-c${cellIndex}`}
              type="button"
              disabled={disabled}
              onClick={() => selectDate(date)}
              className={cn(
                "mx-auto flex h-10 w-10 items-center justify-center text-sm transition-colors sm:h-11 sm:w-11",
                !inMonth && "invisible pointer-events-none",
                disabled && inMonth && "cursor-not-allowed text-muted-foreground/35",
                !disabled && !selected && !ranged && "rounded-full text-foreground/80 hover:bg-secondary",
                ranged && !selected && "rounded-none bg-accent/15 text-foreground",
                selected && "rounded-full bg-accent font-medium text-accent-foreground",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={cn("w-full overflow-hidden bg-background", className)}>
      {/* Full-bleed brand header like Bloom date bar */}
      <div className="bg-accent px-4 py-5 sm:px-8 sm:py-6">
        <div className="mx-auto flex w-full max-w-4xl items-center gap-3 rounded-md bg-ivory px-4 py-3.5 text-forest shadow-sm sm:px-5">
          <span className="text-lg" aria-hidden="true">
            📅
          </span>
          <span className="text-sm font-medium sm:text-base">
            {canConfirm
              ? `${formatShort(checkIn)} → ${formatShort(checkOut)}`
              : "Pick check-in & check-out dates"}
          </span>
        </div>
      </div>

      {/* Calendar sheet fills width */}
      <div className="relative border border-t-0 border-border bg-background px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous month"
          className="absolute top-7 left-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-secondary sm:left-4 lg:left-6"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next month"
          className="absolute top-7 right-2 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground transition-opacity hover:opacity-90 sm:right-4 lg:right-6"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="mx-auto flex w-full max-w-4xl flex-col items-stretch gap-8 px-8 sm:px-10 lg:flex-row lg:items-start lg:gap-14 lg:px-12">
          {renderMonth(viewMonth.year, viewMonth.month)}
          <div className="hidden lg:block lg:min-w-0 lg:flex-1">
            {renderMonth(secondMonth.year, secondMonth.month)}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border border-t-0 border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-6 sm:mx-0 sm:flex-1 sm:gap-10">
          <div>
            <p className="text-sm font-medium text-foreground sm:text-base">
              {checkIn ? formatShort(checkIn) : "Select date"}
            </p>
            <p className="eyebrow mt-1 text-muted-foreground">Check-in</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground sm:text-base">
              {checkOut ? formatShort(checkOut) : "Select date"}
            </p>
            <p className="eyebrow mt-1 text-muted-foreground">Check-out</p>
          </div>
        </div>
        <button
          type="button"
          disabled={!canConfirm}
          onClick={onConfirm}
          className="eyebrow min-h-12 w-full shrink-0 rounded-md bg-accent px-10 py-3 text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
