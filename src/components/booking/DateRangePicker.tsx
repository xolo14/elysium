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
      return;
    }
  };

  const inRange = (date: Date) => {
    if (!checkInDate || !checkOutDate || !checkIn || !checkOut || checkOut <= checkIn) {
      return false;
    }
    return !isBeforeDay(date, checkInDate) && !isAfterDay(date, checkOutDate);
  };

  const renderMonth = (year: number, month: number) => (
    <div className="min-w-0 flex-1">
      <p className="mb-4 text-center font-display text-lg text-forest sm:text-xl">
        {monthLabel(year, month)}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <span key={`${year}-${month}-${day}`} className="eyebrow py-2 text-muted-foreground">
            {day}
          </span>
        ))}
        {buildMonthCells(year, month).map(({ date, inMonth }) => {
          const disabled = !inMonth || isBeforeDay(date, today);
          const selected =
            (checkInDate && sameDay(date, checkInDate)) ||
            (checkOutDate && sameDay(date, checkOutDate));
          const ranged = inRange(date) && inMonth;

          return (
            <button
              key={toInputDate(date)}
              type="button"
              disabled={disabled}
              onClick={() => selectDate(date)}
              className={cn(
                "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors sm:h-10 sm:w-10",
                !inMonth && "invisible",
                disabled && inMonth && "cursor-not-allowed text-muted-foreground/40",
                !disabled && !selected && !ranged && "text-foreground hover:bg-secondary",
                ranged && !selected && "rounded-none bg-secondary text-foreground",
                selected && "bg-forest font-medium text-ivory",
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );

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

  return (
    <div className={cn("overflow-hidden rounded-sm border border-border bg-background", className)}>
      <div className="relative bg-forest px-4 py-5 sm:px-6">
        <div className="flex items-center gap-3 rounded-sm bg-ivory px-4 py-3.5 text-forest shadow-sm">
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

      <div className="relative px-4 py-6 sm:px-8 sm:py-8">
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous month"
          className="absolute top-8 left-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-secondary sm:left-4"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next month"
          className="absolute top-8 right-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-forest text-ivory transition-opacity hover:opacity-90 sm:right-4"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
          {renderMonth(viewMonth.year, viewMonth.month)}
          <div className="hidden lg:block">{renderMonth(secondMonth.year, secondMonth.month)}</div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
        <div className="grid flex-1 grid-cols-2 gap-6 sm:max-w-md">
          <div>
            <p className="text-sm font-medium text-foreground">
              {checkIn ? formatShort(checkIn) : "Select date"}
            </p>
            <p className="eyebrow mt-1 text-muted-foreground">Check-in</p>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              {checkOut ? formatShort(checkOut) : "Select date"}
            </p>
            <p className="eyebrow mt-1 text-muted-foreground">Check-out</p>
          </div>
        </div>
        <button
          type="button"
          disabled={!canConfirm}
          onClick={onConfirm}
          className="eyebrow min-h-12 shrink-0 rounded-sm bg-forest px-10 py-3 text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirm dates
        </button>
      </div>
    </div>
  );
}
