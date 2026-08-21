/**
 * Report runtime errors from React error boundaries.
 * Kept as a no-op hook so boundaries can call a single reporting entry point.
 */
export function reportRuntimeError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (import.meta.env.DEV) {
    console.error("[runtime]", error, context);
  }
}
