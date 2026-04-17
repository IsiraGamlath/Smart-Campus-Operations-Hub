import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

const defaultForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "OPEN"
};

function TicketForm({ ticket, onSave, onCancel }) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ticket) {
      setForm({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || "MEDIUM",
        status: ticket.status || "OPEN"
      });
    } else {
      setForm(defaultForm);
    }
  }, [ticket]);

  const isSubmitDisabled =
    submitting || !form.title.trim() || !form.description.trim();

  const priorityOptions = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);
  const submitLabel = submitting ? "Saving..." : ticket ? "Update Ticket" : "Create Ticket";

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setSubmitting(true);
    setError("");

    try {
      await onSave({ ...form, status: form.status || "OPEN" });
      setForm(defaultForm);
    } catch {
      setError("Could not save ticket. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="ticket-form-card">
      <div className="section-header">
        <div>
          <h2>{ticket ? "Edit Ticket" : "New Incident Ticket"}</h2>
          <p className="section-subtitle">
            Capture issue details and assign a priority for the operations team.
          </p>
        </div>
        {ticket && (
          <button
            type="button"
            className="secondary-button"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={form.title}
            onChange={handleChange("title")}
            placeholder="Enter incident title"
          />
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Describe the issue in detail"
            rows={4}
          />
        </label>

        <label>
          Priority
          <select
            value={form.priority}
            onChange={handleChange("priority")}
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        {ticket && (
          <label>
            Status
            <select value={form.status} onChange={handleChange("status")}>
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
            </select>
          </label>
        )}

        {error && <div className="form-error">{error}</div>}

        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitDisabled}
        >
          {submitLabel}
        </button>
      </form>
    </section>
  );
}

TicketForm.propTypes = {
  ticket: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    priority: PropTypes.string,
    status: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};

export default TicketForm;
