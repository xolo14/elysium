import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { hotels, type Hotel } from "@/data/hotels";

type HotelContextValue = {
  hotel: Hotel;
  hotels: Hotel[];
  hotelId: Hotel["id"];
  switching: boolean;
  selectHotel: (id: Hotel["id"]) => void;
};

const HotelContext = createContext<HotelContextValue | null>(null);

export function HotelProvider({
  children,
  initialId = "madhapur",
}: {
  children: React.ReactNode;
  initialId?: Hotel["id"];
}) {
  const [hotelId, setHotelId] = useState<Hotel["id"]>(initialId);
  const [switching, setSwitching] = useState(false);

  const selectHotel = useCallback(
    (id: Hotel["id"]) => {
      if (id === hotelId) return;
      setSwitching(true);
      window.setTimeout(() => {
        setHotelId(id);
        window.setTimeout(() => setSwitching(false), 620);
      }, 420);
    },
    [hotelId],
  );

  const value = useMemo(
    () => ({
      hotel: (hotels.find((h) => h.id === hotelId) ?? hotels[0]) as Hotel,
      hotels,
      hotelId,
      switching,
      selectHotel,
    }),
    [hotelId, switching, selectHotel],
  );

  return <HotelContext.Provider value={value}>{children}</HotelContext.Provider>;
}

export function useHotel() {
  const ctx = useContext(HotelContext);
  if (!ctx) throw new Error("useHotel must be used inside HotelProvider");
  return ctx;
}
