function StatusBadge({ status }) {
  const colorClasses = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-700",
  };

  const normalizedStatus = typeof status === "string" ? status.toUpperCase() : "";
  const badgeColors = colorClasses[normalizedStatus] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${badgeColors}`}
    >
      {normalizedStatus || "UNKNOWN"}
    </span>
  );
}

export default StatusBadge;
