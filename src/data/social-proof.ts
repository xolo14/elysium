export type SocialProofTile =
  | {
      kind: "award";
      title: string;
      subtitle: string;
      source: string;
      layout: string;
    }
  | {
      kind: "quote";
      quote: string;
      source: string;
      tone: "light" | "accent" | "forest";
      layout: string;
    }
  | {
      kind: "stat";
      value: string;
      label: string;
      layout: string;
    }
  | {
      kind: "image";
      src: string;
      alt: string;
      layout: string;
    };

export type SocialProofFeature = {
  label: string;
  note: string;
  href?: string;
};

export const socialProofFeatures: SocialProofFeature[] = [
  { label: "Direct rates", note: "Book with us — taxes included" },
  { label: "Long-stay ready", note: "Kitchenettes & weekly service" },
  { label: "Family-run", note: "Same front desk from check-in" },
  { label: "Business stays", note: "Invoices & corporate billing" },
  { label: "Guest rated", note: "4.7★+ across both houses" },
  { label: "Prime locations", note: "Madhapur & Hitec City" },
  { label: "Breakfast in", note: "O Sorriso buffet every morning" },
  { label: "24-hour desk", note: "Always staffed, always local" },
  { label: "GST invoices", note: "Corporate-ready at checkout" },
  { label: "Free Wi-Fi", note: "High-speed in every suite" },
  { label: "Airport transfer", note: "Arranged on request" },
  { label: "Free cancel", note: "Up to 24 hours before arrival" },
  { label: "The 4B’s", note: "Bed · Breakfast · Bathroom · Balcony", href: "#why" },
];

/** Tiles for the RTL marquee — awards, stats, quotes, moments */
export const socialProofTiles: SocialProofTile[] = [
  {
    kind: "award",
    title: "Voted a top place to stay for business in Hyderabad",
    subtitle: "Guest satisfaction across both houses",
    source: "Elysium Guest Choice",
    layout: "col-span-2 row-span-2",
  },
  {
    kind: "image",
    src: "/images/image-12.png",
    alt: "All-day dining at O Sorriso",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "image",
    src: "/images/hitec-city/room/room-05.png",
    alt: "Premier suite interior at Hitec City",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "quote",
    quote: "Hard to find a better alternative for long stays near Hitec City.",
    source: "Guest reviews",
    tone: "light",
    layout: "col-span-2 sm:col-span-1 row-span-2",
  },
  {
    kind: "stat",
    value: "4.7★",
    label: "Average rating across both properties",
    layout: "col-span-1 row-span-1",
  },
  {
    kind: "award",
    title: "Best for relocating teams & project stays",
    subtitle: "Flexible check-in and suite handovers",
    source: "Corporate travel",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "image",
    src: "/images/image-10.png",
    alt: "Studio living space at Madhapur",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "quote",
    quote: "Clean rooms, well designed — perfect for a six-week project stay.",
    source: "Google Reviews",
    tone: "forest",
    layout: "col-span-2 sm:col-span-1 row-span-2",
  },
  {
    kind: "stat",
    value: "2",
    label: "Houses in Hyderabad’s tech corridor",
    layout: "col-span-1 row-span-1",
  },
  {
    kind: "award",
    title: "Breakfast included on every direct booking",
    subtitle: "O Sorriso buffet, 7:00–10:30 am",
    source: "House promise",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "image",
    src: "/images/hitec-city/facade/facade-02.png",
    alt: "Elysium Premier Suites facade",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "quote",
    quote: "Setting a new benchmark for corporate travel in Madhapur.",
    source: "Direct guests",
    tone: "light",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "stat",
    value: "24h",
    label: "Front desk that answers — every hour",
    layout: "col-span-1 row-span-1",
  },
  {
    kind: "image",
    src: "/images/hitec-city/dining-area/dining-03.png",
    alt: "Dining area at Hitec City",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "award",
    title: "Kitchenettes for real long stays",
    subtitle: "Cook when you want, dine downstairs when you don’t",
    source: "Long-stay living",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "quote",
    quote: "Breakfast, kitchen, quiet rooms — everything we needed for a month near Hitec.",
    source: "Booking.com guests",
    tone: "forest",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "image",
    src: "/images/hitec-city/reception/reception-01.png",
    alt: "Reception and lobby",
    layout: "col-span-1 row-span-2",
  },
  {
    kind: "stat",
    value: "7+",
    label: "Nights for long-stay rates",
    layout: "col-span-1 row-span-1",
  },
];
