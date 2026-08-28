import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { HotelProvider, useHotel } from "@/context/hotel";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { ValueStay } from "@/components/sections/ValueStay";
import { HotelSelector } from "@/components/sections/HotelSelector";
import { WhatMakesUs } from "@/components/sections/WhatMakesUs";
import { FourBHighlight } from "@/components/sections/FourBHighlight";
import { Amenities } from "@/components/sections/Amenities";
import { SocialProof } from "@/components/sections/SocialProof";
import { MediaLogos } from "@/components/sections/MediaLogos";
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

function Index() {
  return (
    <HotelProvider>
      <SwitchVeil />
      <Nav />
      <main className="relative">
        <Hero />
        <HotelSelector />
        <WhatMakesUs />
        <FourBHighlight />
        <ValueStay />
        <Amenities />
        <SocialProof />
        <MediaLogos />
        <Partnerships />
      </main>
      <Footer />
    </HotelProvider>
  );
}
