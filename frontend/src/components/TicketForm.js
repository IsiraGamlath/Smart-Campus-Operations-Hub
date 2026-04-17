import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";

const defaultForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "OPEN",
  location: "",
  category: "",
  contact: ""
};

function TicketForm({ ticket, onSave, onCancel }) {
  const [form, setForm] = useState(defaultForm);
  const [files, setFiles] = useState([]); // 🔥 image files
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ticket) {
      setForm({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || "MEDIUM",
        status: ticket.status || "OPEN",
        location: ticket.location || "",
        category: ticket.category || "",
        contact: ticket.contact || ""
      });
    } else {
      setForm(defaultForm);
    }
  }, [ticket]);

  const isSubmitDisabled =
    submitting || !form.title.trim() || !form.description.trim();

  const priorityOptions = useMemo(() => ["LOW", "MEDIUM", "HIGH"], []);

  const submitLabel = useMemo(() => {
    if (submitting) return "Saving...";
    return ticket ? "Update Ticket" : "Create Ticket";
  }, [submitting, ticket]);

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  //  image select
  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 3); // max 3
    setFiles(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    setSubmitting(true);
    setError("");

    try {
      //  send form data
      const savedTicket = await onSave({
        ...form,
        status: form.status || "OPEN"
      });

      //  upload images if files were selected
      if (files.length > 0 && savedTicket?.id) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("images", file);
        });
        await fetch(`/api/tickets/${savedTicket.id}/images`, {
          method: "POST",
          body: formData
        });
      }

      setForm(defaultForm);
      setFiles([]);
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
        
        {/* TITLE */}
        <label htmlFor="title">
          Title
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange("title")}
            placeholder="Enter incident title"
          />
        </label>

        {/* DESCRIPTION */}
        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Describe the issue in detail"
            rows={4}
          />
        </label>

        {/*  LOCATION */}
        <label htmlFor="location">
          Location
          <select
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange("location")}
          >
            <option value="">Select location</option>
            <option value="Lab 1">Lab 1</option>
            <option value="Library">Library</option>
            <option value="Auditorium">Auditorium</option>
          </select>
        </label>

        {/*  CATEGORY */}
        <label htmlFor="category">
          Category
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange("category")}
          >
            <option value="">Select category</option>
            <option value="Electrical">Electrical</option>
            <option value="Network">Network</option>
            <option value="Hardware">Hardware</option>
          </select>
        </label>

        {/*  CONTACT */}
        <label htmlFor="contact">
          Contact
          <input
            id="contact"
            name="contact"
            value={form.contact}
            onChange={handleChange("contact")}
            placeholder="Your contact details"
          />
        </label>

        {/* PRIORITY */}
        <label htmlFor="priority">
          Priority
          <select
            id="priority"
            name="priority"
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

        {/*  IMAGE UPLOAD */}
        <label htmlFor="images">
          Upload Images (max 3)
          <input
            id="images"
            type="file"
            multiple
            onChange={handleFileChange}
          />
        </label>

        {/*  PREVIEW */}
        {files.length > 0 && (
          <div className="image-preview">
            {files.map((file, index) => (
              <p key={index}>{file.name}</p>
            ))}
          </div>
        )}

        {/* STATUS (EDIT MODE ONLY) */}
        {ticket && (
          <label htmlFor="status">
            Status
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange("status")}
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="CLOSED">CLOSED</option>
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
    status: PropTypes.string,
    location: PropTypes.string,
    category: PropTypes.string,
    contact: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};

export default TicketForm;