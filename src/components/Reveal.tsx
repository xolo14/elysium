import { motion, type Transition } from "motion/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const ease: Transition["ease"] = [0.16, 1, 0.3, 1];

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
};

/** Soft upward fade — never leaves content stuck invisible */
export function Reveal({ children, className, delay = 0, y = 28, once = true }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0.001, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.08, margin: "0px 0px -5% 0px" }}
      transition={{ duration: 0.85, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Line-by-line editorial paragraph animation. */
export function RevealLines({
  lines,
  className,
  lineClassName,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
}) {
  return (
    <div className={className}>
      {lines.map((line, i) => (
        <div key={line} className="overflow-hidden">
          <motion.p
            initial={{ y: "40%", opacity: 0.2 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, delay: i * 0.1, ease }}
            className={cn("py-1", lineClassName)}
          >
            {line}
          </motion.p>
        </div>
      ))}
    </div>
  );
}

/**
 * Image with a gentle settle — image is always visible (no clip-path hide).
 * Previous clip wipe left many photos looking “missing” when in-view never fired.
 */
export function MaskImage({
  src,
  alt,
  className,
  imgClassName,
  ratio,
  priority,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  ratio?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-secondary", className)}
      style={ratio ? { aspectRatio: ratio } : undefined}
    >
      <motion.img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        initial={{ scale: 1.06, opacity: 0.85 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.2, ease }}
        className={cn("h-full w-full object-cover", imgClassName)}
        onError={(e) => {
          const el = e.currentTarget;
          if (!el.dataset.fallback) {
            el.dataset.fallback = "1";
            el.src = "/images/hero-suite-living.png";
          }
        }}
      />
    </div>
  );
}
