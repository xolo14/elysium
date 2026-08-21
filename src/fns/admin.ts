import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const adminLogin = createServerFn({ method: "POST" })
  .validator(z.object({ password: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { adminLoginImpl } = await import("./admin.server");
    return adminLoginImpl(data);
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { adminLogoutImpl } = await import("./admin.server");
  return adminLogoutImpl();
});

export const getAdminSession = createServerFn({ method: "GET" }).handler(async () => {
  const { getAdminSessionImpl } = await import("./admin.server");
  return getAdminSessionImpl();
});

export const getAdminBookings = createServerFn({ method: "GET" })
  .validator(z.object({ view: z.enum(["active", "history"]) }))
  .handler(async ({ data }) => {
    const { getAdminBookingsImpl } = await import("./admin.server");
    return getAdminBookingsImpl(data);
  });

export const adminCheckIn = createServerFn({ method: "POST" })
  .validator(z.object({ bookingId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { adminCheckInImpl } = await import("./admin.server");
    return adminCheckInImpl(data);
  });

export const adminCheckOut = createServerFn({ method: "POST" })
  .validator(z.object({ bookingId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { adminCheckOutImpl } = await import("./admin.server");
    return adminCheckOutImpl(data);
  });

export const adminCancelBooking = createServerFn({ method: "POST" })
  .validator(z.object({ bookingId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const { adminCancelBookingImpl } = await import("./admin.server");
    return adminCancelBookingImpl(data);
  });
