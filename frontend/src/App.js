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

  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: '40px 20px',
    boxSizing: 'border-box',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
    color: '#1f2937'
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '1000px',
    backgroundColor: '#ffffff',
    borderRadius: '14px',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
    padding: '28px'
  };

  const titleStyle = {
    margin: 0,
    fontSize: '30px',
    fontWeight: 700,
    color: '#0f172a'
  };

  const subtitleStyle = {
    marginTop: '8px',
    marginBottom: '24px',
    fontSize: '16px',
    color: '#475569'
  };

  const tableWrapperStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  };

  const headerCellStyle = {
    backgroundColor: '#f8fafc',
    color: '#334155',
    textAlign: 'left',
    padding: '14px 16px',
    borderBottom: '1px solid #e2e8f0',
    fontWeight: 600
  };

  const cellStyle = {
    padding: '14px 16px',
    borderBottom: '1px solid #f1f5f9',
    color: '#1e293b'
  };

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
        style={{
          display: 'inline-block',
          padding: '4px 10px',
          borderRadius: '999px',
          fontSize: '12px',
          fontWeight: 600,
          backgroundColor: style.bg,
          color: style.text
        }}
      >
        {status || 'N/A'}
      </span>
    );
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Smart Campus Booking System</h1>
        <p style={subtitleStyle}>All Bookings</p>

        {loading ? (
          <p style={{ margin: 0, color: '#475569' }}>Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p style={{ margin: 0, color: '#475569' }}>No bookings found</p>
        ) : (
          <div style={tableWrapperStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={headerCellStyle}>User</th>
                  <th style={headerCellStyle}>Resource</th>
                  <th style={headerCellStyle}>Date</th>
                  <th style={headerCellStyle}>Time</th>
                  <th style={headerCellStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id || index}>
                    <td style={cellStyle}>{booking.userId || '-'}</td>
                    <td style={cellStyle}>{booking.resourceId || '-'}</td>
                    <td style={cellStyle}>{booking.date || '-'}</td>
                    <td style={cellStyle}>
                      {booking.startTime && booking.endTime
                        ? `${booking.startTime} - ${booking.endTime}`
                        : '-'}
                    </td>
                    <td style={cellStyle}>{statusBadge(booking.status)}</td>
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
