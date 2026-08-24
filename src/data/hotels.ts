const bedroom = "/images/image-9.png";
const studioLiving = "/images/image-10.png";
const studioRoom = "/images/image-11.png";
const dining = "/images/image-12.png";
const premierFacade = "/images/image-13.png";
const premierLiving = "/images/image-14.png";
const premierKitchen = "/images/image-15.png";
const entrance = "/images/image-6.png";
const aerial = "/images/image-7.png";
const banquet = "/images/image-25.png";
const premierEntrance = "/images/image-26.png";
const heroLivingUrl = "/images/hero-suite-living.png";


export type Suite = {
  name: string;
  index: string;
  image: string;
  size: string;
  capacity: string;
  view: string;
  rate: string;
  amenities: string[];
  detail: string;
};

export type WhyPoint = {
  index: string;
  title: string;
  copy: string;
  metric: string;
  metricLabel: string;
};

export type TrustPoint = { value: string; label: string };

export type VirtualTour = {
  title: string;
  subtitle: string;
  url: string;
  /** Optional preview still while the 360 player loads */
  poster?: string;
};

export type Hotel = {
  id: "madhapur" | "hitec";
  slug: string;
  name: string;
  place: string;
  region: string;
  badge: string;
  established: string;
  tagline: string;
  summary: string;
  hero: string;
  rating: string;
  fromRate: string;
  offers: string[];
  story: { image: string; chapter: string; lines: string[] };
  suites: Suite[];
  amenities: { label: string; note: string }[];
  experiences: { title: string; kicker: string; copy: string; image: string }[];
  gallery: { image: string; caption: string; span: string }[];
  why: WhyPoint[];
  trust: TrustPoint[];
  about: { image: string; lines: string[] };
  testimonials: { quote: string; name: string; origin: string; stay: string }[];
  contact: { address: string[]; phone: string; email: string };
  coords: string;
  mapQuery: string;
  /** Optional 360° tours (Panoee / similar). */
  virtualTours?: VirtualTour[];
};

const sharedExperiences = (hotelDining: string) => [
  {
    title: "O Sorriso Dining",
    kicker: "Experience I",
    copy: "All-day multi-cuisine dining with a complimentary breakfast buffet, in-room service and a live counter each evening.",
    image: hotelDining,
  },
  {
    title: "Long Stay Living",
    kicker: "Experience II",
    copy: "Fully equipped kitchenettes, weekly housekeeping, laundry and corporate billing for guests staying a month or longer.",
    image: premierKitchen,
  },
  {
    title: "Business Travel",
    kicker: "Experience III",
    copy: "High-speed Wi-Fi, work desks in every suite, a meeting room on request and airport pickup from Shamshabad.",
    image: premierLiving,
  },
];

const contactStudio = {
  address: [
    "Elysium Studio Suites",
    "SA Society, Plot no. 744, Survey of India Ayyappa Society,",
    "Chanda Naik Nagar, Madhapur, Hyderabad, Telangana - 500081",
  ],
  phone: "+91 98887 65776",
  email: "elysium.hyd@gmail.com",
};

const contactPremier = {
  address: [
    "Elysium Premier Suites",
    "Survey No. 11, Plot No. 236, 19 to 11/21, Road Number 35,",
    "Ayyappa Society, Khanammet, Madhapur, Hyderabad, Telangana - 500081",
  ],
  phone: "+91 98887 65554",
  email: "elysium.hyd@gmail.com",
};


export const hotels: Hotel[] = [
  {
    id: "madhapur",
    slug: "madhapur",
    name: "Elysium Studio Suites",
    place: "Madhapur",
    region: "Madhapur, Hyderabad",
    badge: "Studio Suites",
    established: "2026",
    tagline: "Serviced studio living in the heart of Madhapur",
    summary:
      "Serviced studio suites minutes from Hitec City, built for long stays: kitchenettes, work desks, daily housekeeping and a quiet address inside Ayyappa Society.",
    hero: heroLivingUrl,
    rating: "4.7",
    fromRate: "₹4,200",
    offers: [
      "Complimentary breakfast buffet",
      "Free high-speed Wi-Fi",
      "Long-stay rates from 7 nights",
    ],
    story: {
      image: entrance,
      chapter: "Madhapur",
      lines: [
        "A residential lane in Ayyappa Society, two turns from the Madhapur main road and the Hitec City corridor.",
        "Every suite is serviced daily and equipped for guests who stay weeks rather than nights.",
        "Quiet floors, secure entry, covered parking and a 24-hour front desk.",
      ],
    },
    suites: [
      {
        name: "Deluxe Studio",
        index: "01",
        image: bedroom,
        size: "280 sq ft",
        capacity: "2 guests",
        view: "City",
        rate: "₹4,200 / night",
        amenities: ["King bed", "Work desk", "Smart TV", "Free Wi-Fi"],
        detail:
          "A calm, compact studio with a king bed, upholstered headboard, work desk and full air-conditioning.",
      },
      {
        name: "Studio Suite",
        index: "02",
        image: studioRoom,
        size: "420 sq ft",
        capacity: "3 guests",
        view: "City",
        rate: "₹5,400 / night",
        amenities: ["Kitchenette", "King bed", "Dining nook", "Smart TV"],
        detail:
          "An open-plan suite with a private kitchenette, refrigerator and dining nook — made for stays of a week or more.",
      },
      {
        name: "One Bedroom Suite",
        index: "03",
        image: studioLiving,
        size: "610 sq ft",
        capacity: "4 guests",
        view: "City",
        rate: "₹7,600 / night",
        amenities: ["Separate living room", "Sofa seating", "Kitchenette", "Two TVs"],
        detail:
          "A separate bedroom and living room with sofa seating, dining table and kitchenette for families or two colleagues.",
      },
      {
        name: "Family Studio",
        index: "04",
        image: dining,
        size: "560 sq ft",
        capacity: "4 guests",
        view: "City",
        rate: "₹6,800 / night",
        amenities: ["Twin + king beds", "Kitchenette", "Dining for four", "Smart TV"],
        detail:
          "A wider studio laid out for families: a king bed, twin beds, kitchenette and a dining table for four, with breakfast at O Sorriso downstairs.",
      },
      {
        name: "Long Stay Apartment",
        index: "05",
        image: entrance,
        size: "700 sq ft",
        capacity: "4 guests",
        view: "City / balcony",
        rate: "₹8,900 / night",
        amenities: ["Washer", "Full kitchen", "Separate living room", "Balcony"],
        detail:
          "Our monthly-stay apartment: full kitchen, washing machine, separate living room and balcony, with discounted rates from 14 nights.",
      },
    ],

    amenities: [
      { label: "Complimentary Breakfast", note: "O Sorriso, 7–10:30 am" },
      { label: "High-Speed Wi-Fi", note: "Free, all areas" },
      { label: "Kitchenette", note: "Select suites" },
      { label: "Daily Housekeeping", note: "Included" },
      { label: "Laundry Service", note: "Same day" },
      { label: "24-Hour Front Desk", note: "Always staffed" },
      { label: "Power Backup", note: "Full building" },
      { label: "Covered Parking", note: "Complimentary" },
      { label: "Airport Transfer", note: "On request" },
    ],
    experiences: sharedExperiences(dining),
    gallery: [
      { image: bedroom, caption: "Deluxe Studio", span: "row-span-2" },
      { image: studioLiving, caption: "One Bedroom Suite living", span: "" },
      { image: studioRoom, caption: "Studio Suite with kitchenette", span: "" },
      { image: banquet, caption: "Private dining room", span: "row-span-2" },
      { image: dining, caption: "O Sorriso dining", span: "" },
      { image: entrance, caption: "Arrival, after dark", span: "" },
      { image: aerial, caption: "Neighbourhood context", span: "" },
      { image: heroLivingUrl, caption: "Suite living", span: "" },
    ],
    why: [
      {
        index: "01",
        title: "Serviced, not just cleaned",
        copy: "Housekeeping every day, fresh linen on a fixed cycle and a maintenance team in the building — so a four-week stay feels like week one throughout.",
        metric: "Daily",
        metricLabel: "Housekeeping",
      },
      {
        index: "02",
        title: "A real kitchen, not a kettle",
        copy: "Kitchenettes with induction, refrigerator and utensils in select suites, plus a full kitchen in the long-stay apartment. Cook when you want to, eat downstairs when you don't.",
        metric: "In-suite",
        metricLabel: "Kitchenette",
      },
      {
        index: "03",
        title: "Front desk that answers",
        copy: "Staffed 24 hours, every hour. Airport cabs, late check-in, laundry, a doctor at 2 am — one number, answered by someone in the building.",
        metric: "24/7",
        metricLabel: "Front desk",
      },
      {
        index: "04",
        title: "Direct rates, no surprises",
        copy: "Book with us and the rate you see includes taxes, breakfast and Wi-Fi. No resort fee, no card charge, free cancellation up to 24 hours before arrival.",
        metric: "0%",
        metricLabel: "Booking fee",
      },
      {
        index: "05",
        title: "Built for the long stay",
        copy: "Discounted weekly and monthly rates, GST invoices for corporate travel and a private dining room for team meals or family occasions.",
        metric: "7+ nights",
        metricLabel: "Long-stay rates",
      },
    ],
    trust: [
      { value: "4.7", label: "Average guest rating" },
      { value: "1,900+", label: "Guest nights served" },
      { value: "24", label: "Serviced suites" },
      { value: "100%", label: "Power backup" },
    ],
    about: {
      image: banquet,
      lines: [
        "Elysium is a family-run house in Hyderabad, run by the people who built it — not a franchise operating a brand manual.",
        "Every suite is inspected before handover, every rate is quoted with taxes included, and every guest gets the same front desk from arrival to invoice.",
        "We keep two addresses instead of twenty so the standard never drifts.",
      ],
    },

    testimonials: [
      {
        quote:
          "I stayed six weeks on a project in Hitec City. Clean rooms, working kitchenette, and the front desk sorted everything.",
        name: "Rahul Menon",
        origin: "Bengaluru",
        stay: "Studio Suite",
      },
      {
        quote: "Breakfast is genuinely good, and the lane is quiet at night. Easy value for Madhapur.",
        name: "Sneha Reddy",
        origin: "Chennai",
        stay: "Deluxe Studio",
      },
      {
        quote: "We were four adults in the one-bedroom suite and never felt crowded.",
        name: "Arjun Kapoor",
        origin: "Pune",
        stay: "One Bedroom Suite",
      },
    ],
    contact: contactStudio,
    coords: "17.4483° N, 78.3915° E",
    mapQuery: "Elysium Studio Suites, Ayyappa Society, Madhapur, Hyderabad",
  },
  {
    id: "hitec",
    slug: "hitec-city",
    name: "Elysium Premier Suites",
    place: "Hitec City",
    region: "Hitec City, Hyderabad",
    badge: "Premier Suites",
    established: "2026",
    tagline: "Premier suites at the centre of Hitec City",
    summary:
      "Our larger house: premier one and two bedroom suites with full kitchens, arched media walls and balconies, steps from the Hitec City business district.",
    hero: premierEntrance,
    rating: "4.8",
    fromRate: "₹5,600",
    offers: [
      "Complimentary breakfast buffet",
      "Full kitchen in every suite",
      "10% off on stays above 14 nights",
    ],
    story: {
      image: premierFacade,
      chapter: "Hitec City",
      lines: [
        "Eight floors of serviced suites with balconies, built for executives, families and relocating teams.",
        "Full kitchens, separate living rooms and dedicated work corners in every apartment.",
        "Walking distance to the Hitec City offices, with metro and mall access within minutes.",
      ],
    },
    suites: [
      {
        name: "Premier Studio",
        index: "01",
        image: bedroom,
        size: "340 sq ft",
        capacity: "2 guests",
        view: "City / balcony",
        rate: "₹5,600 / night",
        amenities: ["King bed", "Balcony", "Work desk", "Smart TV"],
        detail:
          "A bright studio with balcony access, king bed and a dedicated work desk for short business stays.",
      },
      {
        name: "Premier One Bedroom",
        index: "02",
        image: premierLiving,
        size: "720 sq ft",
        capacity: "4 guests",
        view: "City",
        rate: "₹8,400 / night",
        amenities: ["Arched media wall", "Lounge seating", "Full kitchen", "Two TVs"],
        detail:
          "Separate bedroom plus a lounge with an arched slatted media wall, coffee table and full kitchen alongside.",
      },
      {
        name: "Premier Family Suite",
        index: "03",
        image: premierKitchen,
        size: "980 sq ft",
        capacity: "5 guests",
        view: "City / two balconies",
        rate: "₹11,900 / night",
        amenities: ["Two bedrooms", "Full kitchen", "Dining for four", "Washer"],
        detail:
          "Two bedrooms, a full L-shaped kitchen with chimney and microwave, dining table and washing machine.",
      },
      {
        name: "Executive Corner Suite",
        index: "04",
        image: studioLiving,
        size: "640 sq ft",
        capacity: "3 guests",
        view: "Corner / city",
        rate: "₹9,400 / night",
        amenities: ["Corner windows", "Work corner", "Full kitchen", "Lounge seating"],
        detail:
          "A corner apartment with light on two sides, a dedicated work corner, full kitchen and lounge seating — built for longer business stays.",
      },
      {
        name: "Two Bedroom Residence",
        index: "05",
        image: dining,
        size: "1,180 sq ft",
        capacity: "6 guests",
        view: "City / two balconies",
        rate: "₹14,500 / night",
        amenities: ["Two bedrooms", "Two bathrooms", "Full kitchen", "Washer & dryer"],
        detail:
          "Our largest residence: two bedrooms, two bathrooms, a full kitchen with dining for six and two balconies — suited to relocating families and teams.",
      },
    ],

    virtualTours: [
      {
        title: "Suite with Balcony",
        subtitle: "Walk from the hall through to the balcony in 360°",
        url: "https://tour.panoee.net/suite-with-balcony/1-hall-to-balcony",
        poster: premierLiving,
      },
      {
        title: "Suite Room",
        subtitle: "Living area walkthrough in 360°",
        url: "https://tour.panoee.net/elysium-premier-suites-suite-room/living-area",
        poster: studioLiving,
      },
    ],

    amenities: [
      { label: "Complimentary Breakfast", note: "O Sorriso, 7–10:30 am" },
      { label: "Full Kitchen", note: "All suites" },
      { label: "High-Speed Wi-Fi", note: "Free, all areas" },
      { label: "Meeting Room", note: "Seats 12, on request" },
      { label: "Laundry & Washer", note: "In-suite" },
      { label: "24-Hour Front Desk", note: "Always staffed" },
      { label: "Lift & Power Backup", note: "Full building" },
      { label: "Valet Parking", note: "Basement" },
      { label: "Airport Transfer", note: "On request" },
    ],
    experiences: sharedExperiences(dining),
    gallery: [
      { image: premierEntrance, caption: "Premier Suites, Hitec City", span: "row-span-2" },
      { image: premierLiving, caption: "Arched media wall lounge", span: "" },
      { image: premierKitchen, caption: "Full kitchen and dining", span: "" },
      { image: banquet, caption: "Private dining room", span: "row-span-2" },
      { image: dining, caption: "O Sorriso dining", span: "" },
      { image: studioLiving, caption: "Suite entrance lounge", span: "" },
      { image: premierFacade, caption: "Building facade", span: "" },
      { image: bedroom, caption: "Suite bedroom", span: "" },
    ],
    why: [
      {
        index: "01",
        title: "Apartment-sized suites",
        copy: "One and two bedroom residences with separate living rooms, balconies and dining tables — space to actually live in, not a room with a desk in it.",
        metric: "1,180",
        metricLabel: "Sq ft, largest suite",
      },
      {
        index: "02",
        title: "Full kitchen in every suite",
        copy: "L-shaped kitchens with chimney, microwave, refrigerator and utensils. Washing machine in the larger residences.",
        metric: "All suites",
        metricLabel: "Full kitchen",
      },
      {
        index: "03",
        title: "Made for working travel",
        copy: "Dedicated work corners, high-speed Wi-Fi on backup power and a meeting room for twelve on request — plus GST invoices for corporate accounts.",
        metric: "Seats 12",
        metricLabel: "Meeting room",
      },
      {
        index: "04",
        title: "Direct rates, no surprises",
        copy: "Taxes, breakfast and Wi-Fi included in the rate you see. No resort fee, no card charge, free cancellation up to 24 hours before arrival.",
        metric: "0%",
        metricLabel: "Booking fee",
      },
      {
        index: "05",
        title: "Relocation-ready",
        copy: "10% off stays above 14 nights, monthly billing, valet parking and a private dining room for team meals or family occasions.",
        metric: "14+ nights",
        metricLabel: "Monthly rates",
      },
    ],
    trust: [
      { value: "4.8", label: "Average guest rating" },
      { value: "2,400+", label: "Guest nights served" },
      { value: "36", label: "Premier suites" },
      { value: "100%", label: "Power backup" },
    ],
    about: {
      image: premierEntrance,
      lines: [
        "Elysium is a family-run house in Hyderabad, run by the people who built it — not a franchise operating a brand manual.",
        "Every suite is inspected before handover, every rate is quoted with taxes included, and every guest gets the same front desk from arrival to invoice.",
        "We keep two addresses instead of twenty so the standard never drifts.",
      ],
    },

    testimonials: [
      {
        quote: "The full kitchen made a three-month relocation feel normal. Best serviced suite I've used in Hyderabad.",
        name: "Divya Nair",
        origin: "Kochi",
        stay: "Premier Family Suite",
      },
      {
        quote: "Four minutes to my office in Cyber Towers, and the lounge is a real living room.",
        name: "Karthik Iyer",
        origin: "Mumbai",
        stay: "Premier One Bedroom",
      },
      {
        quote: "Staff answered at 2 am and arranged an airport cab in ten minutes.",
        name: "Peter Hoffmann",
        origin: "Berlin",
        stay: "Premier Studio",
      },
    ],
    contact: contactPremier,
    coords: "17.4504° N, 78.3808° E",
    mapQuery: "Elysium Premier Suites, Hitec City, Hyderabad",
  },
];

export const navItems = [
  { label: "Why Elysium", href: "#why" },
  { label: "Contact", href: "#contact" },
];
