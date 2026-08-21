import { useRef, useState } from "react";
import { motion } from "motion/react";
import { useHotel } from "@/context/hotel";
import { BrandLineBurst, BrandLineStar, BrandStar } from "@/lib/brand";
import { Reveal } from "@/components/Reveal";


function AmenityBlock({ label, note, i }: { label: string; note: string; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 14,
      y: ((e.clientY - r.top) / r.height - 0.5) * -14,
    });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateY: tilt.x, rotateX: tilt.y }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      style={{ transformPerspective: 900, animationDelay: `${i * 0.7}s` }}
       className="glass group relative flex min-h-[170px] flex-col justify-between overflow-hidden p-6 sm:min-h-[190px] sm:p-7 lg:animate-drift"
     >
       {i % 2 === 0 ? (
         <BrandLineStar className="pointer-events-none absolute right-5 bottom-5 h-12 w-12 text-accent/60 transition-transform duration-700 group-hover:rotate-12" />
       ) : (
         <BrandLineBurst className="pointer-events-none absolute right-5 bottom-5 h-12 w-12 text-accent/60 transition-transform duration-700 group-hover:-rotate-12" />
       )}
       <BrandStar className="h-3 w-3 text-accent transition-transform duration-1000 group-hover:rotate-90" />
       <div>
        <h3 className="font-display text-2xl lg:text-3xl">{label}</h3>
        <p className="eyebrow mt-3 text-muted-foreground">{note}</p>
      </div>
    </motion.div>
  );
}

export function Amenities() {
  const { hotel } = useHotel();
  return (
    <section id="amenities" className="relative overflow-hidden bg-secondary py-16 lg:py-20">
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10">
        <Reveal className="max-w-2xl">
          
          <h2 className="display-title mt-6">
            Everything, offered quietly
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hotel.amenities.map((a, i) => (
            <Reveal key={`${hotel.id}-${a.label}`} delay={i * 0.05}>
              <AmenityBlock label={a.label} note={a.note} i={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
