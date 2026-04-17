import React, { useEffect, useState } from 'react';

function App() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const statusBadge = (status) => {
    const colors = {
      APPROVED: { bg: '#dcfce7', text: '#166534' },
      PENDING: { bg: '#fef9c3', text: '#854d0e' },
      REJECTED: { bg: '#fee2e2', text: '#991b1b' },
      CANCELLED: { bg: '#e2e8f0', text: '#334155' }
    };

    const style = colors[status] || { bg: '#e2e8f0', text: '#334155' };

    return (
      <span
        className="inline-block rounded-full px-2.5 py-1 text-xs font-semibold"
        style={{ backgroundColor: style.bg, color: style.text }}
      >
        {status || 'N/A'}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-white px-5 py-10 text-slate-800">
      <div className="mx-auto w-full max-w-5xl rounded-2xl bg-white p-7 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <h1 className="m-0 text-3xl font-bold text-slate-900">Smart Campus Booking System</h1>
        <p className="mb-6 mt-2 text-base text-slate-600">All Bookings</p>

        {loading ? (
          <p className="m-0 text-slate-600">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="m-0 text-slate-600">No bookings found</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">User</th>
                  <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">Resource</th>
                  <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">Date</th>
                  <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">Time</th>
                  <th className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id || index}>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-800">{booking.userId || '-'}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-800">{booking.resourceId || '-'}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-800">{booking.date || '-'}</td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-800">
                      {booking.startTime && booking.endTime
                        ? `${booking.startTime} - ${booking.endTime}`
                        : '-'}
                    </td>
                    <td className="border-b border-slate-100 px-4 py-3 text-slate-800">{statusBadge(booking.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
