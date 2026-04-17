import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8081/api/tickets";

function CreateTicket() {
  const [form, setForm] = useState({
    resource: "",
    category: "",
    description: "",
    priority: "MEDIUM",
    contact: ""
  });

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  // handle text inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // handle image upload (max 3)
  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    setImages([...images, ...files]);

    // preview
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview([...preview, ...previews]);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      data.append(key, form[key]);
    });

    images.forEach((img) => {
      data.append("images", img);
    });

    try {
      await axios.post(API_URL, data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Ticket Created Successfully 🎉");

      setForm({
        resource: "",
        category: "",
        description: "",
        priority: "MEDIUM",
        contact: ""
      });

      setImages([]);
      setPreview([]);
    } catch (err) {
      console.error(err);
      alert("Error creating ticket");
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "600px", margin: "auto" }}>
      <h2>Create Incident Ticket</h2>

      <form onSubmit={handleSubmit}>
        {/* Resource */}
        <label>Resource / Location</label>
        <select name="resource" value={form.resource} onChange={handleChange} required>
          <option value="">Select</option>
          <option>Lab 1</option>
          <option>Lab 2</option>
          <option>Projector</option>
          <option>Lecture Hall</option>
        </select>

        {/* Category */}
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select</option>
          <option>Electrical</option>
          <option>Network</option>
          <option>Hardware</option>
        </select>

        {/* Description */}
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue"
          required
        />

        {/* Priority */}
        <label>Priority</label>
        <select name="priority" value={form.priority} onChange={handleChange}>
          <option>LOW</option>
          <option>MEDIUM</option>
          <option>HIGH</option>
        </select>

        {/* Contact */}
        <label>Contact Details</label>
        <input
          type="text"
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Phone or Email"
          required
        />

        {/* Image Upload */}
        <label>Upload Images (max 3)</label>
        <input type="file" multiple accept="image/*" onChange={handleImage} />

        {/* Preview */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {preview.map((img, index) => (
            <img key={index} src={img} alt="preview" width="80" />
          ))}
        </div>

        <br />

        <button type="submit">Submit Ticket</button>
      </form>
    </div>
  );
}

export default CreateTicket;