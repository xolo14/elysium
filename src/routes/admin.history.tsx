import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";

import { AdminShell, AdminBookingList } from "@/components/admin/AdminBookingList";
import { getAdminBookings, getAdminSession } from "@/fns/admin";

export const Route = createFileRoute("/admin/history")({
  loader: async () => {
    if (import.meta.env.VITE_STATIC_HOSTING === "true") {
      const deskUrl = `${import.meta.env.BASE_URL || "/"}desk/`.replace(/([^:]\/)\/+/g, "$1");
      throw redirect({ href: deskUrl, reloadDocument: true });
    }
    const session = await getAdminSession();
    if (!session.authenticated) {
      throw redirect({ to: "/admin/login" });
    }
    return getAdminBookings({ data: { view: "history" } });
  },
  component: AdminHistoryPage,
});

function AdminHistoryPage() {
  const router = useRouter();
  const bookings = Route.useLoaderData();

  return (
    <AdminShell
      title="Stay history"
      subtitle="Completed check-outs and cancelled reservations."
      activeTab="history"
    >
      <AdminBookingList bookings={bookings} mode="history" onUpdated={() => router.invalidate()} />
    </AdminShell>
  );
}
