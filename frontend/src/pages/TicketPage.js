import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createTicket,
  deleteTicket,
  getTickets,
  updateTicket
} from "../services/ticketService";
import TicketForm from "../components/TicketForm";
import TicketList from "../components/TicketList";
import UserNavbar from "../components/UserNavbar";

function TicketPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getTickets();
      console.log("Loaded tickets:", response.data);
      setTickets(response.data || []);
    } catch (error) {
      console.error("Error loading tickets:", error);
      setTickets([]);
      setError("Unable to load tickets. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSave = async (ticket) => {
    setError("");

    try {
      let response;
      if (selectedTicket) {
        response = await updateTicket(selectedTicket.id, ticket);
        showMessage("Ticket updated successfully.");
      } else {
        response = await createTicket(ticket);
        showMessage("Ticket created successfully.");
      }

      setSelectedTicket(null);
      await loadTickets();
      return response;
    } catch (error) {
      console.error("Error saving ticket:", error);
      setError("Unable to save ticket. Please try again.");
    }
  };

  const handleDelete = async (ticketId) => {
    setError("");

    try {
      await deleteTicket(ticketId);
      showMessage("Ticket removed successfully.");
      await loadTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
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
      showMessage(`Ticket "${ticket.title || 'Updated'}" is now In Progress.`);
      await loadTickets();
    } catch (error) {
      console.error("Error updating status:", error);
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
        const titleA = a.title || "";
        const titleB = b.title || "";
        return titleA.localeCompare(titleB);
      }
      if (a.status === "OPEN") return -1;
      if (b.status === "OPEN") return 1;
      return (a.status || "").localeCompare(b.status || "");
    });
  }, [tickets]);

  let ticketListSection = null;

  if (loading) {
    ticketListSection = (
      <section className="ticket-list-section">
        <div className="loading-state">Loading tickets...</div>
      </section>
    );
  } else if (error) {
    ticketListSection = (
      <section className="ticket-list-section">
        <div className="empty-state">{error}</div>
      </section>
    );
  } else {
    ticketListSection = (
      <TicketList
        tickets={sortedTickets}
        onStatusTransition={handleStatusTransition}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#fafafa' }}>
      <UserNavbar />
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

          {ticketListSection}
        </div>
      </main>
    </div>
  );
}

export default TicketPage;
