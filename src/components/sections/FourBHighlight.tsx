import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { BrandStar } from "@/lib/brand";
import { WhyElysium } from "@/components/sections/WhyElysium";
import { cn } from "@/lib/utils";

function isWhyHash() {
  return typeof window !== "undefined" && window.location.hash === "#why";
}

/**
 * Invisible mount for the 4B’s story — renders nothing until opened via #why
 * (nav, “Explore the 4B’s”, or other highlights).
 */
export function FourBHighlight({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const openFromHash = () => {
      if (!isWhyHash()) return;
      setOpen(true);
      requestAnimationFrame(() => {
        document.getElementById("why")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  const collapse = () => {
    setOpen(false);
    if (isWhyHash()) {
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  };

  return (
    <div id="why" className={cn("scroll-mt-24", className)}>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="four-b-extension"
            key="four-b-extension"
            role="region"
            aria-label="The 4B’s"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <WhyElysium embedded />
            <div className="bg-forest pb-10 text-center sm:pb-12">
              <button
                type="button"
                onClick={collapse}
                className="eyebrow inline-flex items-center gap-2 rounded-[10px] border border-ivory/35 px-5 py-3 text-ivory/80 transition-colors hover:border-ivory hover:text-ivory"
              >
                <BrandStar className="h-2.5 w-2.5 rotate-45" />
                Close the 4B’s
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
