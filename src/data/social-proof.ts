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
};

export const socialProofFeatures: SocialProofFeature[] = [
  { label: "Direct rates", note: "Book with us — taxes included" },
  { label: "Long-stay ready", note: "Kitchenettes & weekly service" },
  { label: "Family-run", note: "Same front desk from check-in" },
  { label: "Business stays", note: "Invoices & corporate billing" },
  { label: "Guest rated", note: "4.7★+ across both houses" },
  { label: "Prime locations", note: "Madhapur & Hitec City" },
];

export const socialProofTiles: SocialProofTile[] = [
  {
    kind: "award",
    title: "Top rated serviced suites for business travel in Hyderabad",
    subtitle: "Guest satisfaction across both houses",
    source: "Elysium Guest Choice",
    layout: "lg:row-span-3",
  },
  {
    kind: "image",
    src: "/images/image-12.png",
    alt: "All-day dining at O Sorriso",
    layout: "lg:row-span-2",
  },
  {
    kind: "image",
    src: "/images/hitec-city/room/room-05.png",
    alt: "Premier suite interior at Hitec City",
    layout: "lg:row-span-2",
  },
  {
    kind: "quote",
    quote: "Clean rooms, well designed — perfect for a six-week project stay.",
    source: "Google Reviews",
    tone: "light",
    layout: "lg:row-span-2",
  },
  {
    kind: "stat",
    value: "4.7★",
    label: "Average rating across both properties",
    layout: "lg:row-span-1",
  },
  {
    kind: "image",
    src: "/images/image-10.png",
    alt: "Studio living space at Madhapur",
    layout: "lg:row-span-2",
  },
  {
    kind: "quote",
    quote: "Hard to find a better alternative for long stays near Hitec City.",
    source: "Guest reviews",
    tone: "accent",
    layout: "lg:row-span-2",
  },
  {
    kind: "image",
    src: "/images/hitec-city/facade/facade-02.png",
    alt: "Elysium Premier Suites facade",
    layout: "lg:row-span-2",
  },
  {
    kind: "quote",
    quote: "Setting a new benchmark for corporate travel in Madhapur.",
    source: "Direct guests",
    tone: "forest",
    layout: "lg:row-span-2",
  },
  {
    kind: "image",
    src: "/images/hitec-city/dining-area/dining-03.png",
    alt: "Dining area at Hitec City",
    layout: "lg:row-span-2",
  },
  {
    kind: "stat",
    value: "1,900+",
    label: "Guest nights served",
    layout: "lg:row-span-1",
  },
  {
    kind: "image",
    src: "/images/image-14.png",
    alt: "Premier suite living room",
    layout: "lg:row-span-2 max-lg:hidden",
  },
  {
    kind: "award",
    title: "Preferred for relocating teams & project stays",
    subtitle: "Flexible check-in and suite handovers",
    source: "Corporate travel partners",
    layout: "lg:col-span-2 lg:row-span-2",
  },
  {
    kind: "quote",
    quote: "Breakfast, kitchen, quiet rooms — everything we needed for a month near Hitec.",
    source: "Booking.com guests",
    tone: "light",
    layout: "lg:row-span-2",
  },
  {
    kind: "stat",
    value: "2",
    label: "Houses in Hyderabad’s tech corridor",
    layout: "lg:row-span-1",
  },
  {
    kind: "image",
    src: "/images/hitec-city/reception/reception-01.png",
    alt: "Reception and lobby",
    layout: "lg:row-span-2",
  },
];
