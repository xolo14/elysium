import type { Hotel } from "@/data/hotels";

export type GalleryImage = {
  src: string;
  caption: string;
};

export type GalleryAlbum = {
  title: string;
  images: GalleryImage[];
};

const hitecFacadeImages: GalleryImage[] = [
  { src: "/images/hitec-city/facade/facade-01.png", caption: "Building facade, daytime" },
  { src: "/images/hitec-city/facade/facade-02.png", caption: "Facade at dusk" },
  { src: "/images/hitec-city/facade/facade-03.png", caption: "Illuminated entrance" },
  { src: "/images/hitec-city/facade/facade-04.png", caption: "Facade under the stars" },
  { src: "/images/hitec-city/facade/facade-05.png", caption: "Grand entrance walkway" },
  { src: "/images/hitec-city/facade/facade-06.png", caption: "Night facade, street view" },
  { src: "/images/hitec-city/facade/facade-07.png", caption: "Premier Suites exterior" },
  { src: "/images/hitec-city/facade/facade-08.png", caption: "Building facade, blue hour" },
];

const hitecReceptionImages: GalleryImage[] = [
  { src: "/images/hitec-city/reception/reception-01.png", caption: "Reception desk and lobby" },
  { src: "/images/hitec-city/reception/reception-02.png", caption: "Front desk, wide view" },
  { src: "/images/hitec-city/reception/reception-03.png", caption: "Lobby seating area" },
  { src: "/images/hitec-city/reception/reception-04.png", caption: "Reception and waiting lounge" },
  { src: "/images/hitec-city/reception/reception-05.png", caption: "Front desk detail" },
  { src: "/images/hitec-city/reception/reception-06.png", caption: "Lobby and elevator" },
];

const hitecLobbyStairsImages: GalleryImage[] = [
  { src: "/images/hitec-city/lobby-and-stairs/lobby-stairs-01.png", caption: "Corridor and staircase" },
  { src: "/images/hitec-city/lobby-and-stairs/lobby-stairs-02.png", caption: "Hallway to upper floors" },
  { src: "/images/hitec-city/lobby-and-stairs/lobby-stairs-03.png", caption: "Suite landing and stairs" },
  { src: "/images/hitec-city/lobby-and-stairs/lobby-stairs-04.png", caption: "Elevator lobby" },
  { src: "/images/hitec-city/lobby-and-stairs/lobby-stairs-05.png", caption: "Stairwell and suite entry" },
  { src: "/images/hitec-city/lobby-and-stairs/lobby-stairs-06.png", caption: "Lobby and stair landing" },
];

const hitecDiningAreaImages: GalleryImage[] = [
  { src: "/images/hitec-city/dining-area/dining-01.png", caption: "Dining room and lounge seating" },
  { src: "/images/hitec-city/dining-area/dining-02.png", caption: "Breakfast tables with booth seating" },
  { src: "/images/hitec-city/dining-area/dining-03.png", caption: "Dining area and buffet station" },
  { src: "/images/hitec-city/dining-area/dining-04.png", caption: "Breakfast buffet spread" },
  { src: "/images/hitec-city/dining-area/dining-05.png", caption: "Dining room overview" },
  { src: "/images/hitec-city/dining-area/dining-06.png", caption: "Marble tables and tufted bench" },
  { src: "/images/hitec-city/dining-area/dining-07.png", caption: "Dining area with glass partition" },
  { src: "/images/hitec-city/dining-area/dining-08.png", caption: "Buffet counter and wall art" },
  { src: "/images/hitec-city/dining-area/dining-09.png", caption: "Set tables and booth seating" },
  { src: "/images/hitec-city/dining-area/dining-10.png", caption: "Dining room wide view" },
  { src: "/images/hitec-city/dining-area/dining-11.png", caption: "Breakfast dining and wash area" },
  { src: "/images/hitec-city/dining-area/dining-12.png", caption: "Buffet and dining seating" },
];

const hitecRoomImages: GalleryImage[] = [
  { src: "/images/hitec-city/room/room-01.png", caption: "Suite interior" },
  { src: "/images/hitec-city/room/room-02.png", caption: "Studio suite living space" },
  { src: "/images/hitec-city/room/room-03.png", caption: "Bedroom view" },
  { src: "/images/hitec-city/room/room-04.png", caption: "Suite seating area" },
  { src: "/images/hitec-city/room/room-05.png", caption: "One bedroom suite" },
  { src: "/images/hitec-city/room/room-06.png", caption: "Living and dining nook" },
  { src: "/images/hitec-city/room/room-07.png", caption: "Suite bedroom" },
  { src: "/images/hitec-city/room/room-08.png", caption: "Room workspace" },
  { src: "/images/hitec-city/room/room-09.png", caption: "Suite wardrobe and bed" },
  { src: "/images/hitec-city/room/room-10.png", caption: "Deluxe studio room" },
  { src: "/images/hitec-city/room/room-11.png", caption: "Family studio layout" },
  { src: "/images/hitec-city/room/room-12.png", caption: "Suite living room" },
  { src: "/images/hitec-city/room/room-13.png", caption: "Bedroom with headboard lighting" },
  { src: "/images/hitec-city/room/room-14.png", caption: "Long stay apartment" },
  { src: "/images/hitec-city/room/room-15.png", caption: "Suite entrance and living area" },
  { src: "/images/hitec-city/room/room-16.png", caption: "In-room dining corner" },
  { src: "/images/hitec-city/room/room-17.png", caption: "Studio suite overview" },
  { src: "/images/hitec-city/room/room-18.png", caption: "Living area and bedroom" },
  { src: "/images/hitec-city/room/room-19.png", caption: "Living room and dining nook" },
  { src: "/images/hitec-city/room/room-20.png", caption: "Bedroom with swan towel art" },
  { src: "/images/hitec-city/room/room-21.png", caption: "Bedroom wide view" },
  { src: "/images/hitec-city/room/room-22.png", caption: "Living room seating" },
  { src: "/images/hitec-city/room/room-23.png", caption: "Bedroom with work desk" },
  { src: "/images/hitec-city/room/room-24.png", caption: "Bedroom opening to living area" },
  { src: "/images/hitec-city/room/room-25.png", caption: "King bedroom" },
  { src: "/images/hitec-city/room/room-26.png", caption: "Living area with wall art" },
  { src: "/images/hitec-city/room/room-27.png", caption: "In-suite kitchenette" },
  { src: "/images/hitec-city/room/room-28.png", caption: "Kitchenette sink and cooktop" },
  { src: "/images/hitec-city/room/room-29.png", caption: "Smart TV and entertainment wall" },
  { src: "/images/hitec-city/room/room-30.png", caption: "In-room dining and kitchenette" },
  { src: "/images/hitec-city/room/room-31.png", caption: "Sofa seating area" },
  { src: "/images/hitec-city/room/room-32.png", caption: "Bedroom with desk and wardrobe" },
  { src: "/images/hitec-city/room/room-33.png", caption: "Kitchenette with appliances" },
  { src: "/images/hitec-city/room/room-34.png", caption: "Suite bathroom" },
  { src: "/images/hitec-city/room/room-35.png", caption: "Bathroom vanity" },
  { src: "/images/hitec-city/room/room-36.png", caption: "Shower and bath area" },
  { src: "/images/hitec-city/room/room-37.png", caption: "Ensuite bathroom detail" },
];

const hitecWashroomImages: GalleryImage[] = [
  { src: "/images/hitec-city/washroom/washroom-01.png", caption: "Shower and vanity area" },
  { src: "/images/hitec-city/washroom/washroom-02.png", caption: "Biotique guest amenities" },
  { src: "/images/hitec-city/washroom/washroom-03.png", caption: "Marble washroom with wall-hung toilet" },
];

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
    title: "Facade",
    images: hitecFacadeImages,
  },
  {
    title: "Reception",
    images: hitecReceptionImages,
  },
  {
    title: "Lobby and Stairs",
    images: hitecLobbyStairsImages,
  },
  {
    title: "Dining Area",
    images: hitecDiningAreaImages,
  },
  {
    title: "Room",
    images: hitecRoomImages,
  },
  {
    title: "Washroom",
    images: hitecWashroomImages,
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
  if (hotel.id === "hitec") {
    return uniqueImages(fromAlbums);
  }
  const ordered = uniqueImages([{ src: hotel.hero, caption: hotel.name }, ...fromAlbums]);
  return ordered;
}

export function getHotelGalleryHref(hotel: Hotel) {
  return `/hotels/${hotel.slug}/gallery` as const;
}
