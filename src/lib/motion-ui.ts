/** Shared motion tokens — keep booking + marketing UI feeling one system. */
export const easeLuxe = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
};

export const fadeUpSoft = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
};

export const tapSoft = { scale: 0.97 };
export const tapMicro = { scale: 0.985 };

export function stagger(i: number, base = 0.04) {
  return { duration: 0.28, delay: base + i * 0.04, ease: easeLuxe };
}
