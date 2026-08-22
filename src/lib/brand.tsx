/**
 * Brand primitives derived strictly from the uploaded Elysium Studio Suites
 * identity files (logo, symbol, corner elements, star, wordmark, patterns).
 * No invented icons or third-party illustrations.
 */
import { cn } from "@/lib/utils";

/* Geometry lifted verbatim from Elysium_Studio_Suites_LOGO_FILES_-06.svg */
const STAR_PATH =
  "M577.72,536.35l36.13,3.65-36.13,3.65c-18.01,1.82-32.25,16.06-34.07,34.07l-3.65,36.13-3.65-36.13c-1.82-18.01-16.06-32.25-34.07-34.07l-36.13-3.65,36.13-3.65c18.01-1.82,32.25-16.06,34.07-34.07l3.65-36.13,3.65,36.13c1.82,18.01,16.06,32.25,34.07,34.07Z";

const CORNER_PATHS = [
  "M682.68,403.66v-6.33h-140.41s7.01,22.36,7.01,22.36c2.81,8.96,11.9,14.37,21.11,12.56,22.19-4.35,60.78-11.66,73.44-12.45,3.1-.19,6.26-.24,9.22.67h.05c3.07.98,5.47,3.38,6.43,6.44v.05c.93,2.95.88,6.12.69,9.22-.79,12.65-8.09,51.25-12.45,73.44-1.81,9.21,3.6,18.31,12.56,21.11l22.36,7.01v-134.08Z",
  "M397.32,403.66v-6.33h6.33s134.08,0,134.08,0l-7.01,22.36c-2.81,8.96-11.9,14.37-21.11,12.56-22.19-4.35-60.78-11.66-73.44-12.45-3.1-.19-6.26-.24-9.22.67h-.05c-3.07.98-5.47,3.38-6.43,6.44v.05c-.93,2.95-.88,6.12-.69,9.22.79,12.65,8.09,51.25,12.45,73.44,1.81,9.21-3.6,18.31-12.56,21.11l-22.36,7.01v-134.08Z",
  "M397.32,676.34v6.33h140.41s-7.01-22.36-7.01-22.36c-2.81-8.96-11.9-14.37-21.11-12.56-22.19,4.35-60.78,11.66-73.44,12.45-3.1.19-6.26.24-9.22-.67h-.05c-3.07-.98-5.47-3.38-6.43-6.44v-.05c-.93-2.95-.88-6.12-.69-9.22.79-12.65,8.09-51.25,12.45-73.44,1.81-9.21-3.6-18.31-12.56-21.11l-22.36-7.01v134.08Z",
  "M682.68,676.34v6.33h-6.33s-134.08,0-134.08,0l7.01-22.36c2.81-8.96,11.9-14.37,21.11-12.56,22.19,4.35,60.78,11.66,73.44,12.45,3.1.19,6.26.24,9.22-.67h.05c3.07-.98,5.47-3.38,6.43-6.44v-.05c.93-2.95.88-6.12.69-9.22-.79-12.65-8.09-51.25-12.45-73.44-1.81-9.21,3.6-18.31,12.56-21.11l22.36-7.01v134.08Z",
];

/* "ELYSIUM" glyph outlines from Elysium_Studio_Suites_LOGO_FILES_-02.svg */
const WORDMARK_PATHS = [
  "M404.61,635.47v14.79h26.23l-2.38,3.13h-31.14v-48.58h34.14l-3,3h-23.85v16.29h25.89l-2.38,3h-23.51v3.68h-.07v4.7h.07Z",
  "M447.54,604.74v45.65h25.08c-1.73,1.95-2.61,2.95-2.66,3h-29.78v-48.65h7.36Z",
  "M505.93,604.61h1.36l-15.88,25.42c-.14.18-.2.39-.2.61v22.76h-7.43l.14-19.15c0-.23-.07-.43-.2-.61l-16.29-26.3-1.7-2.73h8.86l13.9,22.76,12.74-20.37,1.43-2.38h3.27Z",
  "M531.82,626.55c1.73.64,3.29,1.27,4.7,1.91,1.41.64,2.88,1.43,4.43,2.39,1.54.95,2.84,1.95,3.88,3,1.04,1.05,1.91,2.27,2.59,3.68.68,1.41,1.02,2.91,1.02,4.5,0,2.23-.55,4.18-1.64,5.86-1.09,1.68-2.56,3-4.4,3.95-1.84.95-3.83,1.67-5.96,2.15-2.14.48-4.38.71-6.75.71-4.82,0-8.81-1-11.99-3-3.18-2-5.25-4.91-6.2-8.72l4.7-.95c1.45,6.5,6.36,9.74,14.72,9.74,3.04,0,5.63-.84,7.77-2.52,2.13-1.68,3.2-3.84,3.2-6.47,0-.86-.13-1.64-.37-2.32-.25-.68-.7-1.33-1.36-1.94-.66-.61-1.27-1.13-1.84-1.57-.57-.43-1.49-.92-2.76-1.46-1.27-.55-2.32-.98-3.13-1.29-.82-.32-2.09-.77-3.82-1.36-.14-.09-.25-.15-.34-.17-.09-.02-.2-.06-.34-.1-.14-.04-.25-.09-.34-.14-.23-.09-.54-.2-.95-.34-1.41-.5-2.48-.89-3.2-1.16-.73-.27-1.74-.69-3.03-1.26-1.29-.57-2.31-1.09-3.03-1.57-.73-.48-1.56-1.09-2.49-1.84-.93-.75-1.64-1.52-2.11-2.32-.48-.79-.9-1.71-1.26-2.76-.36-1.04-.55-2.18-.55-3.41,0-1.32.35-2.69,1.06-4.12.7-1.43,1.71-2.8,3.03-4.12s3.15-2.41,5.49-3.27c2.34-.86,4.96-1.29,7.87-1.29,8.4,0,14.54,2.98,18.4,8.93l-4.36,1.64c-3.5-5.36-8.13-8.04-13.9-8.04-1.64,0-3.12.19-4.46.58-1.34.39-2.41.87-3.2,1.46-.8.59-1.49,1.26-2.08,2.01-.59.75-.98,1.5-1.16,2.25-.18.75-.32,1.45-.41,2.11-.09.66-.05,1.22.14,1.67.14.59.35,1.14.65,1.64.29.5.59.94.89,1.33.3.39.76.78,1.4,1.19.64.41,1.16.74,1.57.99.41.25,1.1.57,2.08.95.98.39,1.73.68,2.25.89.52.2,1.43.53,2.73.99,1.29.45,2.26.8,2.9,1.02Z",
  "M563.17,604.81h2.73v48.58h-7.43v-48.58h4.7Z",
  "M619.38,604.74l.07,29.23c0,5.45-1.99,10.11-5.96,13.97-3.98,3.86-8.76,5.79-14.34,5.79-3.68,0-7.19-.87-10.53-2.62-3.34-1.75-6.03-4.16-8.07-7.22-2.04-3.07-3.07-6.37-3.07-9.91l-.07-26.51v-1.09c0-.18.01-.38.03-.58.02-.2.03-.39.03-.55v-.51h7.29l.07,29.23c0,4.5,1.32,8.27,3.95,11.31,2.63,3.04,6.09,4.57,10.36,4.57,2.77,0,5.26-.42,7.46-1.26,2.2-.84,4.03-1.98,5.49-3.41,1.45-1.43,2.55-3.11,3.3-5.04.75-1.93,1.12-3.99,1.12-6.17v-26.37l-.07-2.86h2.93Z",
  "M676.21,604.81h6.47v48.58h-6.68v-42.04l-20.44,37.2-21.53-32.84v37.68h-3v-48.58h5.31l21.67,32.98,18.19-32.98Z",
];

type SvgProps = { className?: string; strokeOnly?: boolean };

/** The four-point brand star. Used for cursor, bullets, dividers. */
export function BrandStar({ className, strokeOnly }: SvgProps) {
  return (
    <svg viewBox="465 465 150 150" aria-hidden="true" className={cn("h-4 w-4", className)}>
      <path
        d={STAR_PATH}
        fill={strokeOnly ? "none" : "currentColor"}
        stroke={strokeOnly ? "currentColor" : "none"}
        strokeWidth={strokeOnly ? 4 : 0}
      />
    </svg>
  );
}

/** Full brand symbol: star inside the four corner elements. */
export function BrandSymbol({ className, strokeOnly }: SvgProps) {
  return (
    <svg viewBox="380 380 320 320" aria-hidden="true" className={cn("h-8 w-8", className)}>
      <g
        fill={strokeOnly ? "none" : "currentColor"}
        stroke={strokeOnly ? "currentColor" : "none"}
        strokeWidth={strokeOnly ? 4 : 0}
      >
        <path d={STAR_PATH} />
        {CORNER_PATHS.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </svg>
  );
}

/** A single corner element, rotated per position. */
export function BrandCorner({
  className,
  position = "tl",
}: {
  className?: string;
  position?: "tl" | "tr" | "bl" | "br";
}) {
  const index = { tl: 1, tr: 0, br: 3, bl: 2 }[position];
  return (
    <svg viewBox="390 390 300 300" aria-hidden="true" className={cn("h-10 w-10", className)}>
      <path d={CORNER_PATHS[index]} fill="currentColor" />
    </svg>
  );
}

/** Animated line-drawn wordmark ("ELYSIUM") from the official logo files. */
export function BrandWordmark({
  className,
  animate = false,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="395 600 292 58"
      role="img"
      aria-label="Elysium"
      className={cn("h-4 w-auto", className)}
    >
      <g fill="currentColor">
        {WORDMARK_PATHS.map((d, i) => (
          <path
            key={i}
            d={d}
            style={
              animate
                ? {
                    animation: `brand-glyph-in 900ms cubic-bezier(0.16,1,0.3,1) both`,
                    animationDelay: `${300 + i * 90}ms`,
                  }
                : undefined
            }
          />
        ))}
      </g>
    </svg>
  );
}

/** Full lockup used in nav + footer. */
export function BrandLockup({
  className,
  animate = false,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <BrandSymbol className="h-7 w-7 shrink-0" />
      <span className="flex flex-col gap-[2px]">
        <BrandWordmark className="h-[13px]" animate={animate} />
        <span className="font-sans text-[8px] tracking-[0.42em] uppercase opacity-80">
          Hotels
        </span>
      </span>
    </span>
  );
}

/**
 * Repeating brand patterns built from the uploaded pattern sheet.
 * variant "star" = dense star lattice, "corner" = interlocking corner tile.
 */
export function BrandPattern({
  variant = "star",
  className,
  scale = 120,
  opacity = 0.06,
  id,
}: {
  variant?: "star" | "corner" | "diamond";
  className?: string;
  scale?: number;
  opacity?: number;
  id: string;
}) {
  const tile = 1080;
  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      style={{ opacity }}
    >
      <defs>
        <pattern
          id={id}
          width={scale}
          height={scale}
          patternUnits="userSpaceOnUse"
          viewBox={`0 0 ${tile} ${tile}`}
          patternTransform={variant === "diamond" ? "rotate(45)" : undefined}
        >
          <g fill="currentColor" transform="translate(0,0)">
            {variant === "corner" ? (
              CORNER_PATHS.map((d, i) => <path key={i} d={d} />)
            ) : (
              <path d={STAR_PATH} transform="translate(0 0) scale(1)" />
            )}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Oversized watermark symbol for section backgrounds. */
export function BrandWatermark({ className, strokeOnly = true }: SvgProps) {
  return (
    <BrandSymbol
      strokeOnly={strokeOnly}
      className={cn(
        "pointer-events-none absolute h-[70vmin] w-[70vmin] opacity-[0.045]",
        className,
      )}
    />
  );
}

/** Corner decorations framing a block, from the brand corner elements. */
export function CornerFrame({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", className)}>
      <BrandCorner position="tl" className="absolute -top-px -left-px h-6 w-6" />
      <BrandCorner position="tr" className="absolute -top-px -right-px h-6 w-6" />
      <BrandCorner position="bl" className="absolute -bottom-px -left-px h-6 w-6" />
      <BrandCorner position="br" className="absolute -right-px -bottom-px h-6 w-6" />
    </span>
  );
}

/* ---------------------------------------------------------------------------
 * Secondary motifs from the brand element sheet: the eight-point burst
 * (square with concave sides) and the single chevron / bracket stroke.
 * ------------------------------------------------------------------------- */

const BURST_PATH =
  "M100,8 L112,40 Q116,52 128,48 L160,36 L148,68 Q144,80 156,84 L188,96 L156,108 Q144,112 148,124 L160,156 L128,144 Q116,140 112,152 L100,184 L88,152 Q84,140 72,144 L40,156 L52,124 Q56,112 44,108 L12,96 L44,84 Q56,80 52,68 L40,36 L72,48 Q84,52 88,40 Z";

/** Eight-point brand burst. Solid or outlined. */
export function BrandBurst({ className, strokeOnly }: SvgProps) {
  return (
    <svg viewBox="0 0 200 192" aria-hidden="true" className={cn("h-4 w-4", className)}>
      <path
        d={BURST_PATH}
        fill={strokeOnly ? "none" : "currentColor"}
        stroke={strokeOnly ? "currentColor" : "none"}
        strokeWidth={strokeOnly ? 3 : 0}
      />
    </svg>
  );
}

/** Single chevron stroke, rotatable via `direction`. */
export function BrandChevron({
  className,
  direction = "right",
}: {
  className?: string;
  direction?: "up" | "right" | "down" | "left";
}) {
  const rotate = { up: -90, right: 0, down: 90, left: 180 }[direction];
  return (
    <svg
      viewBox="0 0 100 120"
      aria-hidden="true"
      className={cn("h-3 w-3", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M22 10 Q30 6 36 14 L82 56 Q88 60 82 64 L36 106 Q30 114 22 110 Q14 105 20 96 L60 60 L20 24 Q14 15 22 10 Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** A thin brand rule: hairline broken by a burst — used between sections. */
export function BrandRule({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("flex items-center gap-4 opacity-60", className)}>
      <span className="h-px flex-1 bg-current opacity-30" />
      <BrandBurst className="h-2.5 w-2.5" />
      <span className="h-px flex-1 bg-current opacity-30" />
    </span>
  );
}

/** Thin four-point line motif from the uploaded brand element sheet. */
export function BrandLineStar({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={cn("h-10 w-10", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M100 8 C98 52 96 70 84 82 C72 94 52 98 8 100 C52 102 72 106 84 118 C96 130 98 148 100 192 C102 148 104 130 116 118 C128 106 148 102 192 100 C148 98 128 94 116 82 C104 70 102 52 100 8 Z" />
    </svg>
  );
}

/** Thin eight-point line motif from the uploaded brand element sheet. */
export function BrandLineBurst({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={cn("h-10 w-10", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M88 12 Q100 8 112 12 L119 39 L146 34 Q160 31 171 41 Q177 47 174 59 L169 84 L192 96 Q198 100 192 106 L169 116 L174 143 Q177 155 169 163 Q160 171 146 166 L119 161 L112 188 Q110 196 100 192 Q90 196 88 188 L81 161 L54 166 Q40 171 31 163 Q23 155 26 143 L31 116 L8 106 Q2 100 8 94 L31 84 L26 57 Q23 45 31 37 Q40 29 54 34 L81 39 Z" />
    </svg>
  );
}

/** Angular paired line mark from the uploaded Elysium element sheet. */
export function BrandLineCorner({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 400"
      aria-hidden="true"
      className={cn("h-24 w-12", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.35"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 12 H184 L170 54 C166 68 157 78 143 78 L72 62 C58 59 49 68 51 82 L66 169 C68 183 61 195 48 201 L16 214 Z" />
      <path d="M184 386 H16 L30 344 C34 330 43 320 57 320 L128 336 C142 339 151 330 149 316 L134 229 C132 215 139 203 152 197 L184 184 Z" />
    </svg>
  );
}
