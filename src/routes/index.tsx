import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { HotelProvider, useHotel } from "@/context/hotel";
import { BrandLineCorner } from "@/lib/brand";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { HotelSelector } from "@/components/sections/HotelSelector";
import { SocialProof } from "@/components/sections/SocialProof";
import { Suites } from "@/components/sections/Suites";
import { Amenities } from "@/components/sections/Amenities";
import { Experiences } from "@/components/sections/Experiences";
import { Gallery } from "@/components/sections/Gallery";
import { WhyElysium } from "@/components/sections/WhyElysium";
import { Testimonials } from "@/components/sections/Testimonials";
import { Instagram } from "@/components/sections/Instagram";
import { Partnerships } from "@/components/sections/Partnerships";
import { Footer } from "@/components/sections/Footer";

const title = "Elysium Hotels Hyderabad — Studio & Premier Suites";
const description =
  "Serviced suites in Hyderabad: Elysium Studio Suites, Madhapur and Elysium Premier Suites, Hitec City. Kitchenettes, complimentary breakfast and direct booking.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: "Elysium Hotels",
          description,
          telephone: "+91 96 7629 3369",
          email: "elysium.hyd@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Plot no. 744, Road No. 40, Ayyappa Society, Madhapur",
            addressLocality: "Hyderabad",
            addressRegion: "Telangana",
            postalCode: "500081",
            addressCountry: "IN",
          },
        }),
      },
    ],
  }),
  component: Index,
});

/** Cross-fade veil played while the visitor changes house. */
function SwitchVeil() {
  const { switching } = useHotel();
  return (
    <AnimatePresence>
      {switching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none fixed inset-0 z-[75] bg-forest"
        />
      )}
    </AnimatePresence>
  );
}

function HouseContent() {
  const { hotelId } = useHotel();
  return (
    <motion.div
      key={hotelId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Amenities />
      <Experiences />
      <Gallery />
      <Testimonials />
      <Instagram />
      <Partnerships />
    </motion.div>
  );
}

function Index() {
  return (
    <HotelProvider>
      <SwitchVeil />
      <Nav />
       <main className="relative">
         <BrandLineCorner className="pointer-events-none absolute top-[calc(100svh+5rem)] left-5 z-10 hidden h-36 w-20 text-forest/45 lg:block" />
         <Hero />
         <HotelSelector />
         <SocialProof />
         <WhyElysium />
        <Suites />
        <HouseContent />
      </main>
      <Footer />
    </HotelProvider>
  );
}
