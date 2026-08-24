import { useEffect, useState } from "react";

/** True only after the first client mount — safe for SSR/prerender hydration. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
