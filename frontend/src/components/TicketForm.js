import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const defaultForm = {
  title: "",
  description: "",
  priority: "MEDIUM",
  status: "OPEN",
  location: "",
  category: "",
  assignedTo: "",
  resolutionNotes: ""
};

function TicketForm({ ticket, onSave, onCancel }) {
  const [form, setForm] = useState(defaultForm);
  const [files, setFiles] = useState([]); 
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setForm({
        title: ticket.title || "",
        description: ticket.description || "",
        priority: ticket.priority || "MEDIUM",
        status: ticket.status || "OPEN",
        location: ticket.location || "",
        category: ticket.category || "",
        assignedTo: ticket.assignedTo || "",
        resolutionNotes: ticket.resolutionNotes || ""
      });
    } else {
      setForm(defaultForm);
    }
  }, [ticket]);

  const isFormValid = () => {
    return (
      form.title.trim() &&
      form.description.trim() &&
      form.location.trim() &&
      form.category.trim() &&
      form.priority.trim()
    );
  };

  const handleChange = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value
    }));
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).slice(0, 3);
    setFiles(selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isFormValid()) {
      toast.error("Please fill in all required fields (Title, Description, Location, Category, Priority)");
      return;
    }

    setSubmitting(true);
    console.log("FORM DATA SUBMITTING:", form);

    try {
      const response = await onSave({
        title: form.title,
        description: form.description,
        priority: form.priority,
        location: form.location,
        category: form.category,
        assignedTo: form.assignedTo,
        resolutionNotes: form.resolutionNotes,
        status: form.status
      });
      console.log("API RESPONSE SUCCESS:", response);
      
      setForm(defaultForm);
      setFiles([]);
    } catch (error) {
       console.error("FORM SUBMISSION ERROR:", error);
       toast.error("Failed to save ticket. Check console for details.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="ticket-form-card">
      <div className="section-header">
        <div>
          <h2>{ticket ? "Edit Ticket" : "New Incident Ticket"}</h2>
        </div>
        {ticket && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>

      <form className="ticket-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input
            value={form.title}
            onChange={handleChange("title")}
            placeholder="e.g. Broken AC in Lab 1"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Detail the issue..."
            rows={4}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Location *</label>
            <select value={form.location} onChange={handleChange("location")}>
              <option value="">Select location</option>
              <option value="Computer Lab 1">Computer Lab 1</option>
              <option value="Lecture Hall A">Lecture Hall A</option>
              <option value="Main Library">Main Library</option>
              <option value="Cafeteria">Cafeteria</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select value={form.category} onChange={handleChange("category")}>
              <option value="">Select category</option>
              <option value="Electrical">Electrical</option>
              <option value="Network">Network</option>
              <option value="Furniture">Furniture</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority *</label>
            <select value={form.priority} onChange={handleChange("priority")}>
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="URGENT">URGENT</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assign Technician (Optional)</label>
            <select value={form.assignedTo} onChange={handleChange("assignedTo")}>
                <option value="">Unassigned</option>
                <option value="Tech Sarath">Tech Sarath</option>
                <option value="Tech Nimal">Tech Nimal</option>
                <option value="Tech Kamal">Tech Kamal</option>
            </select>
          </div>
        </div>

        {ticket && (
          <div className="form-group">
             <label>Status</label>
             <select value={form.status} onChange={handleChange("status")}>
                <option value="OPEN">OPEN</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="RESOLVED">RESOLVED</option>
                <option value="CLOSED">CLOSED</option>
             </select>
          </div>
        )}

        <div className="form-actions pt-4">
          <button
            className="primary-button w-full"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Processing..." : (ticket ? "Update Ticket" : "Create Ticket")}
          </button>
        </div>
      </form>
    </section>
  );
}

TicketForm.propTypes = {
  ticket: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};

export default TicketForm;