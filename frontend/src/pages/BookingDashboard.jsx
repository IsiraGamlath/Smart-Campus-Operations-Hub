import React, { useEffect, useState } from "react";
import BookingForm from "../components/BookingForm";
import BookingTable from "../components/BookingTable";

function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/bookings");

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
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleBookingCreated = () => {
    setLoading(true);
    fetchBookings();
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-slate-900">Smart Campus Booking System</h1>
        </header>

        <BookingForm onBookingCreated={handleBookingCreated} />

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">Loading bookings...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-600">No bookings found</p>
          </div>
        ) : (
          <BookingTable bookings={bookings} />
        )}
      </div>
    </main>
  );
}

export default BookingDashboard;
