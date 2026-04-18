import StatusBadge from "./StatusBadge";

function BookingTable({ bookings, onApprove, onReject, onCancel }) {
  const renderActions = (booking) => {
    const { id, status } = booking;

    if (status === "PENDING") {
      return (
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-emerald-700"
            onClick={() => onApprove(id)}
          >
            Approve
          </button>
          <button
            type="button"
            className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-rose-700"
            onClick={() => onReject(id)}
          >
            Reject
          </button>
          <button
            type="button"
            className="rounded-md bg-slate-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-slate-700"
            onClick={() => onCancel(id)}
          >
            Cancel
          </button>
        </div>
      );
    }

    if (status === "APPROVED") {
      return (
        <button
          type="button"
          className="rounded-md bg-slate-600 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-slate-700"
          onClick={() => onCancel(id)}
        >
          Cancel
        </button>
      );
    }

    return <span className="text-xs font-medium text-slate-500">No Actions</span>;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
              User
            </th>
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
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {bookings.map((booking) => (
            <tr key={booking.id} className="hover:bg-slate-50">
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">{booking.userId}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">{booking.resourceId}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">{booking.date}</td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-800">
                {booking.startTime} - {booking.endTime}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">
                <StatusBadge status={booking.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm">{renderActions(booking)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookingTable;
