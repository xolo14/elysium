import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { lazy, Suspense } from "react";
import { HotelProvider, useHotel } from "@/context/hotel";

import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { HotelSelector } from "@/components/sections/HotelSelector";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { pageMeta, SITE_EMAIL } from "@/lib/site";

const ValueStay = lazy(() =>
  import("@/components/sections/ValueStay").then((m) => ({ default: m.ValueStay })),
);
const WhatMakesUs = lazy(() =>
  import("@/components/sections/WhatMakesUs").then((m) => ({ default: m.WhatMakesUs })),
);
const FourBHighlight = lazy(() =>
  import("@/components/sections/FourBHighlight").then((m) => ({ default: m.FourBHighlight })),
);
const Amenities = lazy(() =>
  import("@/components/sections/Amenities").then((m) => ({ default: m.Amenities })),
);
const SocialProof = lazy(() =>
  import("@/components/sections/SocialProof").then((m) => ({ default: m.SocialProof })),
);
const MediaLogos = lazy(() =>
  import("@/components/sections/MediaLogos").then((m) => ({ default: m.MediaLogos })),
);
const FaqBand = lazy(() =>
  import("@/components/sections/FaqBand").then((m) => ({ default: m.FaqBand })),
);
const Partnerships = lazy(() =>
  import("@/components/sections/Partnerships").then((m) => ({ default: m.Partnerships })),
);
const Footer = lazy(() =>
  import("@/components/sections/Footer").then((m) => ({ default: m.Footer })),
);

const title = "Elysium Hotels Hyderabad — Studio & Premier Suites";
const description =
  "Serviced suites in Hyderabad: Elysium Studio Suites, Madhapur and Elysium Premier Suites, Hitec City. Kitchenettes, complimentary breakfast and direct booking.";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageMeta({ title, description, path: "/" }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Hotel",
          name: "Elysium Hotels",
          description,
          telephone: "+91 98887 65776",
          email: SITE_EMAIL,
          url: "https://elysiumhotel.grootdigitals.com/",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Plot no. 744, Road No. 40, Ayyappa Society, Madhapur",
            addressLocality: "Hyderabad",
            addressRegion: "Telangana",
            postalCode: "500081",
            addressCountry: "IN",
          },
          amenityFeature: [
            { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi" },
            { "@type": "LocationFeatureSpecification", name: "Complimentary breakfast" },
            { "@type": "LocationFeatureSpecification", name: "Kitchenette" },
          ],
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
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
        <Suspense fallback={<div className="section-pad" aria-hidden="true" />}>
          <WhatMakesUs />
          <FourBHighlight />
          <ValueStay />
          <Amenities />
          <SocialProof />
          <MediaLogos />
          <FaqBand />
          <Partnerships />
          <Footer />
        </Suspense>
      </main>
      <WhatsAppFloat />
    </HotelProvider>
  );
}
