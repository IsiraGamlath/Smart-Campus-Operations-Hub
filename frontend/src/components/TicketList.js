import PropTypes from "prop-types";
import { Link } from "react-router-dom";

function TicketList({ tickets, onStatusTransition, onDelete, onEdit }) {

  const renderStatusLabel = (status) => {
    switch (status) {
      case "OPEN":
        return "Open";
      case "IN_PROGRESS":
        return "In Progress";
      case "RESOLVED":
        return "Resolved";
      case "CLOSED":
        return "Closed";
      default:
        return status;
    }
  };

  return (
    <section className="ticket-list-section">
      <div className="section-header">
        <div>
          <h2>Incident Queue</h2>
          <p className="section-subtitle">
            Review current tickets and manage incidents efficiently.
          </p>
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="empty-state">
          No tickets have been created yet.
        </div>
      ) : (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <article key={ticket.id} className="ticket-row">

              <div className="ticket-summary">
                <div>

                  {/* 🔥 CLICKABLE TITLE */}
                  <h3>
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="ticket-link"
                    >
                      {ticket.title}
                    </Link>
                  </h3>

                  {/* 🔥 DESCRIPTION */}
                  <p className="ticket-description">
                    {ticket.description}
                  </p>

                  {/* 🔥 EXTRA INFO (NEW) */}
                  <div style={{ marginTop: "6px", fontSize: "0.9rem", color: "#64748b" }}>
                    📍 {ticket.location || "N/A"} | 🏷️ {ticket.category || "N/A"}
                  </div>

                </div>

                <div className="ticket-meta">

                  {/* STATUS */}
                  <span
                    className={`status-badge status-${ticket.status.toLowerCase()}`}
                  >
                    {renderStatusLabel(ticket.status)}
                  </span>

                  {/* PRIORITY */}
                  <span className="priority-badge">
                    {ticket.priority}
                  </span>

                </div>
              </div>

              {/* 🔥 ASSIGNED TECHNICIAN */}
              {ticket.assignedTo && (
                <div style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                  👨‍🔧 Assigned to: <strong>{ticket.assignedTo}</strong>
                </div>
              )}

              <div className="ticket-actions">

                {/* STATUS BUTTON */}
                <button
                  className="primary-button"
                  type="button"
                  onClick={() => onStatusTransition(ticket)}
                  disabled={ticket.status !== "OPEN"}
                >
                  {ticket.status === "OPEN"
                    ? "Start Work"
                    : "In Progress"}
                </button>

                {/* EDIT */}
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => onEdit(ticket)}
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  className="danger-button"
                  type="button"
                  onClick={() => onDelete(ticket.id)}
                >
                  Delete
                </button>

              </div>

            </article>
          ))}
        </div>
      )}
    </section>
  );
}

TicketList.propTypes = {
  tickets: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      priority: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      location: PropTypes.string,
      category: PropTypes.string,
      assignedTo: PropTypes.string
    })
  ).isRequired,
  onStatusTransition: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
};

export default TicketList;