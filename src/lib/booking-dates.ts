export function toInputDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseInputDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d);
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = parseInputDate(checkIn).getTime();
  const b = parseInputDate(checkOut).getTime();
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a) return 1;
  return Math.max(1, Math.round((b - a) / 86_400_000));
}

export function formatNice(iso: string) {
  const d = parseInputDate(iso);
  if (!Number.isFinite(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatShort(iso: string) {
  const d = parseInputDate(iso);
  if (!Number.isFinite(d.getTime())) return "Select date";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Bloom-style: "15 Sep, Tuesday" */
export function formatStayDate(iso: string) {
  const d = parseInputDate(iso);
  if (!Number.isFinite(d.getTime())) return "Select date";
  const day = d.toLocaleDateString("en-IN", { day: "numeric" });
  const month = d.toLocaleDateString("en-IN", { month: "short" });
  const weekday = d.toLocaleDateString("en-IN", { weekday: "long" });
  return `${day} ${month}, ${weekday}`;
}

/** Compact bar: "15 Sep, Tue" */
export function formatStayCompact(iso: string) {
  const d = parseInputDate(iso);
  if (!Number.isFinite(d.getTime())) return "Select date";
  const day = d.toLocaleDateString("en-IN", { day: "numeric" });
  const month = d.toLocaleDateString("en-IN", { month: "short" });
  const weekday = d.toLocaleDateString("en-IN", { weekday: "short" });
  return `${day} ${month}, ${weekday}`;
}

export function startOfDay(d: Date) {
  const next = new Date(d);
  next.setHours(0, 0, 0, 0);
  return next;
}

export function addDays(d: Date, days: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isBeforeDay(a: Date, b: Date) {
  return startOfDay(a).getTime() < startOfDay(b).getTime();
}

export function isAfterDay(a: Date, b: Date) {
  return startOfDay(a).getTime() > startOfDay(b).getTime();
}

export function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });
}

export function buildMonthCells(year: number, month: number) {
  const first = new Date(year, month, 1);
  const startPad = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = 0; i < startPad; i++) {
    const d = new Date(year, month, i - startPad + 1);
    cells.push({ date: d, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ date: new Date(year, month, day), inMonth: true });
  }
  // Always exactly 6 weeks (42 cells) so month changes never stretch the grid
  while (cells.length < 42) {
    const last = cells[cells.length - 1]!.date;
    cells.push({ date: addDays(last, 1), inMonth: false });
  }
  return cells.slice(0, 42);
}
