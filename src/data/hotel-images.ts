import type { Hotel } from "@/data/hotels";

export type GalleryImage = {
  src: string;
  caption: string;
};

export type GalleryAlbum = {
  title: string;
  images: GalleryImage[];
};

const madhapurAlbums: GalleryAlbum[] = [
  {
    title: "Exterior & Arrival",
    images: [
      { src: "/images/image-6.png", caption: "Arrival, after dark" },
      { src: "/images/image-7.png", caption: "Neighbourhood context" },
      { src: "/images/hero-suite-living.png", caption: "Suite living" },
    ],
  },
  {
    title: "Suites & Rooms",
    images: [
      { src: "/images/image-9.png", caption: "Deluxe Studio" },
      { src: "/images/image-11.png", caption: "Studio Suite with kitchenette" },
      { src: "/images/image-10.png", caption: "One Bedroom Suite living" },
      { src: "/images/image-12.png", caption: "Family Studio dining" },
    ],
  },
  {
    title: "Dining & Events",
    images: [
      { src: "/images/image-12.png", caption: "O Sorriso dining" },
      { src: "/images/image-25.png", caption: "Private dining room" },
    ],
  },
];

const hitecAlbums: GalleryAlbum[] = [
  {
    title: "Exterior & Arrival",
    images: [
      { src: "/images/image-26.png", caption: "Premier Suites, Hitec City" },
      { src: "/images/image-13.png", caption: "Building facade" },
    ],
  },
  {
    title: "Suites & Rooms",
    images: [
      { src: "/images/image-9.png", caption: "Suite bedroom" },
      { src: "/images/image-14.png", caption: "Arched media wall lounge" },
      { src: "/images/image-15.png", caption: "Full kitchen and dining" },
      { src: "/images/image-10.png", caption: "Suite entrance lounge" },
    ],
  },
  {
    title: "Dining & Events",
    images: [
      { src: "/images/image-12.png", caption: "O Sorriso dining" },
      { src: "/images/image-25.png", caption: "Private dining room" },
    ],
  },
];

const albumsByHotel: Record<Hotel["id"], GalleryAlbum[]> = {
  madhapur: madhapurAlbums,
  hitec: hitecAlbums,
};

function uniqueImages(images: GalleryImage[]) {
  const seen = new Set<string>();
  return images.filter((image) => {
    if (seen.has(image.src)) return false;
    seen.add(image.src);
    return true;
  });
}

export function getHotelGalleryAlbums(hotelId: Hotel["id"]): GalleryAlbum[] {
  return albumsByHotel[hotelId].map((album) => ({
    ...album,
    images: uniqueImages(album.images),
  }));
}

export function getHotelCarouselImages(hotel: Hotel): GalleryImage[] {
  const fromAlbums = getHotelGalleryAlbums(hotel.id).flatMap((album) => album.images);
  const ordered = uniqueImages([{ src: hotel.hero, caption: hotel.name }, ...fromAlbums]);
  return ordered;
}

export function getHotelGalleryHref(hotel: Hotel) {
  return `/hotels/${hotel.slug}/gallery` as const;
}
