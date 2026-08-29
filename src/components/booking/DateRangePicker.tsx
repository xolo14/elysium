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
  onConfirm?: () => void;
  minDate?: Date;
  className?: string;
  compact?: boolean;
};

export function DateRangePicker({
  checkIn,
  checkOut,
  onRangeChange,
  onConfirm,
  minDate,
  className,
  compact = false,
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
      <p
        className={cn(
          "text-center font-display leading-none text-forest",
          compact ? "mb-2 text-sm" : "mb-3 h-7 text-lg leading-7 sm:mb-4 sm:h-8 sm:text-xl sm:leading-8",
        )}
      >
        {monthLabel(year, month)}
      </p>
      <div
        className="grid grid-cols-7 text-center"
        style={{
          gridTemplateRows: compact ? "1.15rem repeat(6, 1.85rem)" : "1.75rem repeat(6, 2.75rem)",
        }}
      >
        {WEEKDAYS.map((day, i) => (
          <span
            key={`${year}-${month}-wd-${i}`}
            className={cn(
              "flex items-center justify-center font-semibold tracking-[0.12em] text-muted-foreground uppercase",
              compact ? "text-[0.58rem]" : "text-[0.65rem]",
            )}
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
                "mx-auto flex items-center justify-center rounded-[6px] transition-colors",
                compact ? "h-7 w-7 text-xs" : "h-10 w-10 text-sm sm:h-11 sm:w-11",
                !inMonth && "invisible pointer-events-none",
                disabled && inMonth && "cursor-not-allowed text-muted-foreground/35",
                !disabled && !selected && !ranged && "text-foreground/80 hover:bg-secondary",
                ranged && !selected && "bg-forest/10 text-foreground",
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

  return (
    <div className={cn("w-full overflow-hidden bg-background", !compact && "border border-border", className)}>
      {!compact ? (
        <div className="border-b border-border bg-forest px-4 py-5 sm:px-8 sm:py-6">
          <div className="mx-auto flex w-full max-w-4xl items-center gap-3 rounded-[10px] border border-ivory/20 bg-ivory/10 px-4 py-3.5 text-ivory sm:px-5">
            <span className="text-sm font-medium sm:text-base">
              {canConfirm
                ? `${formatShort(checkIn)} → ${formatShort(checkOut)}`
                : "Pick check-in & check-out dates"}
            </span>
          </div>
        </div>
      ) : null}

      <div className={cn("relative bg-background", compact ? "px-1 py-1" : "px-3 py-6 sm:px-6 sm:py-8 lg:px-10")}>
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous month"
          className={cn(
            "absolute z-10 inline-flex items-center justify-center rounded-[8px] border border-border bg-background text-forest transition-colors hover:bg-secondary",
            compact ? "top-0 left-0 h-7 w-7" : "top-7 left-2 h-9 w-9 sm:left-4 lg:left-6",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="Next month"
          className={cn(
            "absolute z-10 inline-flex items-center justify-center rounded-[8px] border border-forest bg-forest text-ivory transition-opacity hover:opacity-90",
            compact ? "top-0 right-0 h-7 w-7" : "top-7 right-2 h-9 w-9 sm:right-4 lg:right-6",
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        <div
          className={cn(
            "flex w-full flex-col items-stretch",
            compact ? "gap-4 px-8 pt-1 lg:flex-row lg:gap-6" : "mx-auto max-w-4xl gap-8 px-8 sm:px-10 lg:flex-row lg:items-start lg:gap-14 lg:px-12",
          )}
        >
          {renderMonth(viewMonth.year, viewMonth.month)}
          <div className={cn("min-w-0 flex-1", compact ? "hidden xl:block" : "hidden lg:block")}>
            {renderMonth(secondMonth.year, secondMonth.month)}
          </div>
        </div>
      </div>

      {!compact && onConfirm ? (
        <div className="flex flex-col gap-4 border-t border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-5">
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
            className="eyebrow min-h-12 w-full shrink-0 rounded-[10px] border border-forest bg-forest px-10 py-3 text-ivory transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            Confirm
          </button>
        </div>
      ) : null}
    </div>
  );
}
