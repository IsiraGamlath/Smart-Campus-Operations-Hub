import { useEffect, useMemo, useState } from "react";
import {
  createTicket,
  deleteTicket,
  getTickets,
  updateTicket
} from "../services/ticketService";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";

function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTickets = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getTickets();
      setTickets(response.data || []);
    } catch {
      setError("Unable to load tickets. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = async (ticket) => {
    setError("");

    try {
      if (selectedTicket) {
        await updateTicket(selectedTicket.id, ticket);
        showMessage("Ticket updated successfully.");
      } else {
        await createTicket(ticket);
        showMessage("Ticket created successfully.");
      }

      setSelectedTicket(null);
      await loadTickets();
    } catch {
      setError("Unable to save ticket. Please try again.");
    }
  };

  const handleDelete = async (ticketId) => {
    setError("");

    try {
      await deleteTicket(ticketId);
      showMessage("Ticket removed successfully.");
      await loadTickets();
    } catch {
      setError("Could not delete ticket. Please try again.");
    }
  };

  const handleStatusTransition = async (ticket) => {
    if (ticket.status !== "OPEN") return;

    try {
      await updateTicket(ticket.id, {
        ...ticket,
        status: "IN_PROGRESS"
      });
      showMessage(`Ticket "${ticket.title}" is now In Progress.`);
      await loadTickets();
    } catch {
      setError("Could not update ticket status.");
    }
  };

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      if (a.status === b.status) {
        return a.title.localeCompare(b.title);
      }
      if (a.status === "OPEN") return -1;
      if (b.status === "OPEN") return 1;
      return a.status.localeCompare(b.status);
    });
  }, [tickets]);

  return (
    <main className="page-container">
      <div className="page-header">
        <div>
          <p className="eyebrow">Smart Campus Operations Hub</p>
          <h1>Incident Ticket Management</h1>
          <p className="page-description">
            Create tickets, track incident status, and hand off work to operations.
          </p>
        </div>
      </div>

      {message && <div className="toast-message success">{message}</div>}
      {error && <div className="toast-message error">{error}</div>}

      <div className="ticket-grid">
        <TicketForm
          ticket={selectedTicket}
          onSave={handleSave}
          onCancel={() => setSelectedTicket(null)}
        />

        {loading ? (
          <section className="ticket-list-section">
            <div className="loading-state">Loading tickets...</div>
          </section>
        ) : (
          <TicketList
            tickets={sortedTickets}
            onStatusTransition={handleStatusTransition}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>
    </main>
  );
}

export default TicketPage;
