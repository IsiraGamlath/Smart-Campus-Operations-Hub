import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTicketById, updateTicket } from "../services/ticketService";

const statusLabels = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed"
};

const statusActions = {
  OPEN: [
    { value: "IN_PROGRESS", label: "Start Work" },
    { value: "RESOLVED", label: "Resolve" },
    { value: "CLOSED", label: "Close" }
  ],
  IN_PROGRESS: [
    { value: "RESOLVED", label: "Resolve" },
    { value: "CLOSED", label: "Close" }
  ],
  RESOLVED: [
    { value: "OPEN", label: "Reopen" },
    { value: "CLOSED", label: "Close" }
  ],
  CLOSED: [
    { value: "OPEN", label: "Reopen" }]
};

function TicketDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchTicket = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getTicketById(id);
      setTicket(response.data);
    } catch {
      setError("Unable to load ticket details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const handleStatusUpdate = async (status) => {
    if (!ticket) return;
    setSaving(true);
    setError("");

    try {
      const response = await updateTicket(id, { ...ticket, status });
      setTicket(response.data);
    } catch {
      setError("Unable to update ticket status.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddComment = async () => {
    if (!ticket || !commentText.trim()) return;

    const nextComments = [...(ticket.comments || []), commentText.trim()];
    const updatedTicket = { ...ticket, comments: nextComments };

    setSaving(true);
    setError("");

    try {
      await updateTicket(id, updatedTicket);
      setTicket(updatedTicket);
      setCommentText("");
    } catch {
      setError("Unable to save comment. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="empty-state">Loading ticket details...</div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="page-container">
        <div className="empty-state">Ticket not found.</div>
      </div>
    );
  }

  const comments = ticket.comments || [];
  const actions = statusActions[ticket.status] || [];

  return (
    <main className="page-container ticket-detail-page">
      <div className="section-header">
        <div>
          <p className="eyebrow">Ticket details</p>
          <h1>{ticket.title}</h1>
          <p className="page-description">Review incident information, progress updates, and comments.</p>
        </div>
        <button className="secondary-button" type="button" onClick={() => navigate(-1)}>
          Back to queue
        </button>
      </div>

      {error && <div className="toast-message error">{error}</div>}

      <section className="detail-card">
        <div className="detail-header">
          <div>
            <p className="section-subtitle">Summary</p>
            <p className="detail-label">
              <strong>Priority:</strong> {ticket.priority}
            </p>
            <p className="detail-label">
              <strong>Status:</strong> {statusLabels[ticket.status] || ticket.status}
            </p>
          </div>
          <div className="ticket-actions detail-actions">
            {actions.map((action) => (
              <button
                key={action.value}
                type="button"
                className="primary-button"
                onClick={() => handleStatusUpdate(action.value)}
                disabled={saving}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="detail-row">
          <div>
            <h2>Description</h2>
            <p className="ticket-description">{ticket.description}</p>
          </div>

          <div className="detail-panel">
            <h3>Image preview</h3>
            <div className="image-grid">
              <div className="image-placeholder">No image</div>
              <div className="image-placeholder">No image</div>
              <div className="image-placeholder">No image</div>
            </div>
          </div>
        </div>

        <div className="detail-row comments-panel">
          <div className="comments-section">
            <div className="section-header">
              <div>
                <h2>Comments</h2>
                <p className="section-subtitle">Capture updates and collaborator notes as work progresses.</p>
              </div>
            </div>

            {comments.length === 0 ? (
              <div className="empty-state">No comments yet.</div>
            ) : (
              <div className="comment-list">
                {comments.map((comment, index) => (
                  <div key={`${comment}-${index}`} className="comment-item">
                    <span>💬</span>
                    <p>{comment}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="comment-input-group">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a new comment..."
                rows={3}
              />
              <button
                type="button"
                className="primary-button"
                onClick={handleAddComment}
                disabled={saving || !commentText.trim()}
              >
                Add comment
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default TicketDetails;