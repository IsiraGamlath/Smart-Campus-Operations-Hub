import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import BookingTable from "../components/BookingTable";
import StatusBadge from "../components/StatusBadge";
import UserNavbar from "../components/UserNavbar";
import { useAuth } from "../context/AuthContext";

function BookingDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.role === "ADMIN";
  const preselectedResourceId = searchParams.get("resourceId") || "";

  const handleUnauthorized = useCallback(() => {
    navigate("/", { replace: true });
  }, [navigate]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);

    const endpoint = isAdmin
      ? "http://localhost:8080/api/bookings"
      : "http://localhost:8080/api/bookings/me";

    try {
      const response = await fetch(endpoint, {
        credentials: "include",
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized, isAdmin]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleBookingCreated = () => {
    setLoading(true);
    fetchBookings();
  };

  const handleApprove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${id}/approve`, {
        method: "PUT",
        credentials: "include",
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to approve booking");
      }

      setLoading(true);
      fetchBookings();
    } catch (error) {
      console.error("Approve error:", error);
      window.alert("Unable to approve booking. Please try again.");
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Enter rejection reason:");

    if (!reason || !reason.trim()) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${id}/reject`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to reject booking");
      }

      setLoading(true);
      fetchBookings();
    } catch (error) {
      console.error("Reject error:", error);
      window.alert("Unable to reject booking. Please try again.");
    }
  };

  const handleCancel = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/bookings/${id}/cancel`, {
        method: "PUT",
        credentials: "include",
      });

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to cancel booking");
      }

      setLoading(true);
      fetchBookings();
    } catch (error) {
      console.error("Cancel error:", error);
      window.alert("Unable to cancel booking. Please try again.");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <UserNavbar />
      <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-6">
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-slate-900">Smart Campus Booking System</h1>
            <button
              type="button"
              onClick={handleGoBack}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Back
            </button>
          </header>

        {!isAdmin && (
          <>
            <BookingForm
              onBookingCreated={handleBookingCreated}
              onUnauthorized={handleUnauthorized}
              preselectedResourceId={preselectedResourceId}
            />

            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">My Bookings</h2>
                <button
                  type="button"
                  onClick={fetchBookings}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 transition hover:bg-slate-50"
                >
                  Refresh
                </button>
              </div>

              {loading ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Loading your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">No bookings found yet.</p>
                </div>
              ) : (
                <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                          Resource
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                          Purpose
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50">
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {booking.resourceId}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {booking.date}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                            {booking.startTime} - {booking.endTime}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-800">
                            {booking.purpose || "-"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm">
                            <StatusBadge status={booking.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

        {isAdmin && (
          loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-600">No bookings found</p>
            </div>
          ) : (
            <BookingTable
              bookings={bookings}
              onApprove={handleApprove}
              onReject={handleReject}
              onCancel={handleCancel}
            />
          )
        )}
        </div>
      </main>
    </>
  );
}

export default BookingDashboard;
