import { createFileRoute, redirect } from "@tanstack/react-router";
import { useRouter } from "@tanstack/react-router";

import { AdminShell, AdminBookingList } from "@/components/admin/AdminBookingList";
import { getAdminBookings, getAdminSession } from "@/fns/admin";

export const Route = createFileRoute("/admin/")({
  loader: async () => {
    if (import.meta.env.VITE_STATIC_HOSTING === "true") {
      const deskUrl = `${import.meta.env.BASE_URL || "/"}desk/`.replace(/([^:]\/)\/+/g, "$1");
      throw redirect({ href: deskUrl, reloadDocument: true });
    }
    const session = await getAdminSession();
    if (!session.authenticated) {
      throw redirect({ to: "/admin/login" });
    }
    return getAdminBookings({ data: { view: "active" } });
  },
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const router = useRouter();
  const bookings = Route.useLoaderData();

  const refresh = async () => {
    await router.invalidate();
  };

  return (
    <AdminShell
      title="Reservations"
      subtitle="New booking requests and guests currently in house."
      activeTab="reservations"
    >
      <AdminBookingList bookings={bookings} mode="active" onUpdated={refresh} />
    </AdminShell>
  );
}
