function ResourceForm({
  styles,
  formData,
  setFormData,
  isEditMode,
  submitting,
  onSubmit,
  submitMessage,
  submitError,
}) {
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <section style={styles.formSection}>
      <h2 style={styles.formTitle}>{isEditMode ? 'Edit Resource' : 'Add New Resource'}</h2>

      <form onSubmit={handleSubmit}>
        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label htmlFor="name" style={styles.label}>Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="type" style={styles.label}>Type</label>
            <input
              id="type"
              name="type"
              type="text"
              value={formData.type}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="capacity" style={styles.label}>Capacity</label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min="1"
              value={formData.capacity}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="location" style={styles.label}>Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="availabilityStart" style={styles.label}>Availability Start</label>
            <input
              id="availabilityStart"
              name="availabilityStart"
              type="text"
              value={formData.availabilityStart}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="e.g., 08:00"
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="availabilityEnd" style={styles.label}>Availability End</label>
            <input
              id="availabilityEnd"
              name="availabilityEnd"
              type="text"
              value={formData.availabilityEnd}
              onChange={handleInputChange}
              style={styles.input}
              placeholder="e.g., 17:00"
              required
            />
          </div>

          <div style={styles.field}>
            <label htmlFor="status" style={styles.label}>Status</label>
            <input
              id="status"
              name="status"
              type="text"
              value={formData.status}
              onChange={handleInputChange}
              style={styles.input}
              required
            />
          </div>

          <div style={{ ...styles.field, ...styles.fullWidthField }}>
            <label htmlFor="description" style={styles.label}>Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              style={styles.textarea}
            />
          </div>
        </div>

        <div style={styles.submitRow}>
          <button
            type="submit"
            style={submitting ? styles.submitButtonDisabled : styles.submitButton}
            disabled={submitting}
          >
            {submitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Resource' : 'Add Resource')}
          </button>

          {submitMessage && <p style={styles.successText}>{submitMessage}</p>}
          {submitError && <p style={styles.submitErrorText}>{submitError}</p>}
        </div>
      </form>
    </section>
  );
}

export default ResourceForm;
