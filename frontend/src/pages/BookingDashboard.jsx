import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookingForm from "../components/BookingForm";
import BookingTable from "../components/BookingTable";
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
    if (!isAdmin) {
      setBookings([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
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
          <BookingForm
            onBookingCreated={handleBookingCreated}
            onUnauthorized={handleUnauthorized}
            preselectedResourceId={preselectedResourceId}
          />
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
  );
}

export default BookingDashboard;
