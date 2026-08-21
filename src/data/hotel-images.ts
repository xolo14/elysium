import type { Hotel } from "@/data/hotels";

export type GalleryImage = {
  src: string;
  caption: string;
};

export type GalleryAlbum = {
  title: string;
  images: GalleryImage[];
};

const madhapurFacadeImages: GalleryImage[] = [
  { src: "/images/madhapur/facade/facade-01.png", caption: "Building facade, daytime" },
  { src: "/images/madhapur/facade/facade-02.png", caption: "Facade at dusk" },
  { src: "/images/madhapur/facade/facade-03.png", caption: "Illuminated entrance" },
  { src: "/images/madhapur/facade/facade-04.png", caption: "Facade under the stars" },
  { src: "/images/madhapur/facade/facade-05.png", caption: "Grand entrance walkway" },
  { src: "/images/madhapur/facade/facade-06.png", caption: "Night facade, street view" },
  { src: "/images/madhapur/facade/facade-07.png", caption: "Premier Suites exterior" },
  { src: "/images/madhapur/facade/facade-08.png", caption: "Building facade, blue hour" },
];

const madhapurReceptionImages: GalleryImage[] = [
  { src: "/images/madhapur/reception/reception-01.png", caption: "Reception desk and lobby" },
  { src: "/images/madhapur/reception/reception-02.png", caption: "Front desk, wide view" },
  { src: "/images/madhapur/reception/reception-03.png", caption: "Lobby seating area" },
  { src: "/images/madhapur/reception/reception-04.png", caption: "Reception and waiting lounge" },
  { src: "/images/madhapur/reception/reception-05.png", caption: "Front desk detail" },
  { src: "/images/madhapur/reception/reception-06.png", caption: "Lobby and elevator" },
];

const madhapurLobbyStairsImages: GalleryImage[] = [
  { src: "/images/madhapur/lobby-and-stairs/lobby-stairs-01.png", caption: "Corridor and staircase" },
  { src: "/images/madhapur/lobby-and-stairs/lobby-stairs-02.png", caption: "Hallway to upper floors" },
  { src: "/images/madhapur/lobby-and-stairs/lobby-stairs-03.png", caption: "Suite landing and stairs" },
  { src: "/images/madhapur/lobby-and-stairs/lobby-stairs-04.png", caption: "Elevator lobby" },
  { src: "/images/madhapur/lobby-and-stairs/lobby-stairs-05.png", caption: "Stairwell and suite entry" },
  { src: "/images/madhapur/lobby-and-stairs/lobby-stairs-06.png", caption: "Lobby and stair landing" },
];

const madhapurDiningAreaImages: GalleryImage[] = [
  { src: "/images/madhapur/dining-area/dining-01.png", caption: "Dining room and lounge seating" },
  { src: "/images/madhapur/dining-area/dining-02.png", caption: "Breakfast tables with booth seating" },
  { src: "/images/madhapur/dining-area/dining-03.png", caption: "Dining area and buffet station" },
  { src: "/images/madhapur/dining-area/dining-04.png", caption: "Breakfast buffet spread" },
  { src: "/images/madhapur/dining-area/dining-05.png", caption: "Dining room overview" },
  { src: "/images/madhapur/dining-area/dining-06.png", caption: "Marble tables and tufted bench" },
  { src: "/images/madhapur/dining-area/dining-07.png", caption: "Dining area with glass partition" },
  { src: "/images/madhapur/dining-area/dining-08.png", caption: "Buffet counter and wall art" },
  { src: "/images/madhapur/dining-area/dining-09.png", caption: "Set tables and booth seating" },
  { src: "/images/madhapur/dining-area/dining-10.png", caption: "Dining room wide view" },
  { src: "/images/madhapur/dining-area/dining-11.png", caption: "Breakfast dining and wash area" },
  { src: "/images/madhapur/dining-area/dining-12.png", caption: "Buffet and dining seating" },
];

const madhapurRoomImages: GalleryImage[] = [
  { src: "/images/madhapur/room/room-01.png", caption: "Suite interior" },
  { src: "/images/madhapur/room/room-02.png", caption: "Studio suite living space" },
  { src: "/images/madhapur/room/room-03.png", caption: "Bedroom view" },
  { src: "/images/madhapur/room/room-04.png", caption: "Suite seating area" },
  { src: "/images/madhapur/room/room-05.png", caption: "One bedroom suite" },
  { src: "/images/madhapur/room/room-06.png", caption: "Living and dining nook" },
  { src: "/images/madhapur/room/room-07.png", caption: "Suite bedroom" },
  { src: "/images/madhapur/room/room-08.png", caption: "Room workspace" },
  { src: "/images/madhapur/room/room-09.png", caption: "Suite wardrobe and bed" },
  { src: "/images/madhapur/room/room-10.png", caption: "Deluxe studio room" },
  { src: "/images/madhapur/room/room-11.png", caption: "Family studio layout" },
  { src: "/images/madhapur/room/room-12.png", caption: "Suite living room" },
  { src: "/images/madhapur/room/room-13.png", caption: "Bedroom with headboard lighting" },
  { src: "/images/madhapur/room/room-14.png", caption: "Long stay apartment" },
  { src: "/images/madhapur/room/room-15.png", caption: "Suite entrance and living area" },
  { src: "/images/madhapur/room/room-16.png", caption: "In-room dining corner" },
  { src: "/images/madhapur/room/room-17.png", caption: "Studio suite overview" },
  { src: "/images/madhapur/room/room-18.png", caption: "Living area and bedroom" },
  { src: "/images/madhapur/room/room-19.png", caption: "Living room and dining nook" },
  { src: "/images/madhapur/room/room-20.png", caption: "Bedroom with swan towel art" },
  { src: "/images/madhapur/room/room-21.png", caption: "Bedroom wide view" },
  { src: "/images/madhapur/room/room-22.png", caption: "Living room seating" },
  { src: "/images/madhapur/room/room-23.png", caption: "Bedroom with work desk" },
  { src: "/images/madhapur/room/room-24.png", caption: "Bedroom opening to living area" },
  { src: "/images/madhapur/room/room-25.png", caption: "King bedroom" },
  { src: "/images/madhapur/room/room-26.png", caption: "Living area with wall art" },
  { src: "/images/madhapur/room/room-27.png", caption: "In-suite kitchenette" },
  { src: "/images/madhapur/room/room-28.png", caption: "Kitchenette sink and cooktop" },
  { src: "/images/madhapur/room/room-29.png", caption: "Smart TV and entertainment wall" },
  { src: "/images/madhapur/room/room-30.png", caption: "In-room dining and kitchenette" },
  { src: "/images/madhapur/room/room-31.png", caption: "Sofa seating area" },
  { src: "/images/madhapur/room/room-32.png", caption: "Bedroom with desk and wardrobe" },
  { src: "/images/madhapur/room/room-33.png", caption: "Kitchenette with appliances" },
  { src: "/images/madhapur/room/room-34.png", caption: "Suite bathroom" },
  { src: "/images/madhapur/room/room-35.png", caption: "Bathroom vanity" },
  { src: "/images/madhapur/room/room-36.png", caption: "Shower and bath area" },
  { src: "/images/madhapur/room/room-37.png", caption: "Ensuite bathroom detail" },
];

const madhapurWashroomImages: GalleryImage[] = [
  { src: "/images/madhapur/washroom/washroom-01.png", caption: "Shower and vanity area" },
  { src: "/images/madhapur/washroom/washroom-02.png", caption: "Biotique guest amenities" },
  { src: "/images/madhapur/washroom/washroom-03.png", caption: "Marble washroom with wall-hung toilet" },
];

const madhapurAlbums: GalleryAlbum[] = [
  {
    title: "Facade",
    images: madhapurFacadeImages,
  },
  {
    title: "Reception",
    images: madhapurReceptionImages,
  },
  {
    title: "Lobby and Stairs",
    images: madhapurLobbyStairsImages,
  },
  {
    title: "Dining Area",
    images: madhapurDiningAreaImages,
  },
  {
    title: "Room",
    images: madhapurRoomImages,
  },
  {
    title: "Washroom",
    images: madhapurWashroomImages,
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
  if (hotel.id === "madhapur") {
    return uniqueImages(fromAlbums);
  }
  const ordered = uniqueImages([{ src: hotel.hero, caption: hotel.name }, ...fromAlbums]);
  return ordered;
}

export function getHotelGalleryHref(hotel: Hotel) {
  return `/hotels/${hotel.slug}/gallery` as const;
}
