import { useEffect, useState } from 'react';
import './App.css';

const initialFormData = {
  name: '',
  type: '',
  capacity: '',
  location: '',
  availabilityStart: '',
  availabilityEnd: '',
  status: '',
  description: '',
};

function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState(initialFormData);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchResources = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError('');

    try {
      const response = await fetch('http://localhost:8082/api/resources');

      if (!response.ok) {
        throw new Error(`Failed to fetch resources (HTTP ${response.status})`);
      }

      const data = await response.json();
      setResources(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while fetching resources.');
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitError('');
    setSubmitting(true);

    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    try {
      const response = await fetch('http://localhost:8082/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to add resource (HTTP ${response.status})`);
      }

      setFormData(initialFormData);
      await fetchResources(false);
      setSubmitMessage('Resource created successfully.');
    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred while adding the resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const styles = {
    page: {
      minHeight: '100vh',
      backgroundColor: '#f7f9fc',
      padding: '32px 20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      color: '#1f2937',
    },
    container: {
      maxWidth: '1100px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      borderRadius: '10px',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
      padding: '24px',
    },
    title: {
      margin: '0 0 8px',
      fontSize: '2rem',
      color: '#0f172a',
    },
    subtitle: {
      margin: '0 0 22px',
      color: '#475569',
      fontSize: '1rem',
      lineHeight: '1.5',
    },
    formSection: {
      marginBottom: '26px',
      border: '1px solid #e5e7eb',
      borderRadius: '10px',
      padding: '16px',
      backgroundColor: '#f8fafc',
    },
    formTitle: {
      margin: '0 0 14px',
      fontSize: '1.15rem',
      color: '#0f172a',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '12px',
    },
    field: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    label: {
      fontSize: '0.85rem',
      fontWeight: '600',
      color: '#334155',
    },
    input: {
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '0.9rem',
      outline: 'none',
      backgroundColor: '#ffffff',
    },
    textarea: {
      border: '1px solid #cbd5e1',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '0.9rem',
      minHeight: '80px',
      resize: 'vertical',
      outline: 'none',
      backgroundColor: '#ffffff',
    },
    fullWidthField: {
      gridColumn: '1 / -1',
    },
    submitRow: {
      marginTop: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flexWrap: 'wrap',
    },
    submitButton: {
      border: 'none',
      backgroundColor: '#0ea5e9',
      color: '#ffffff',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    submitButtonDisabled: {
      border: 'none',
      backgroundColor: '#94a3b8',
      color: '#ffffff',
      padding: '10px 16px',
      borderRadius: '8px',
      cursor: 'not-allowed',
      fontSize: '0.9rem',
      fontWeight: '600',
    },
    successText: {
      color: '#166534',
      fontSize: '0.9rem',
      margin: 0,
    },
    submitErrorText: {
      color: '#b91c1c',
      fontSize: '0.9rem',
      margin: 0,
    },
    statusText: {
      padding: '14px 0',
      fontSize: '1rem',
    },
    errorText: {
      padding: '14px',
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#b91c1c',
      fontSize: '0.95rem',
    },
    tableWrapper: {
      overflowX: 'auto',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '900px',
    },
    th: {
      backgroundColor: '#f1f5f9',
      color: '#0f172a',
      textAlign: 'left',
      padding: '12px 10px',
      fontSize: '0.9rem',
      borderBottom: '1px solid #e5e7eb',
      whiteSpace: 'nowrap',
    },
    td: {
      padding: '12px 10px',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '0.9rem',
      verticalAlign: 'top',
    },
  };

  const renderBody = () => {
    if (loading) {
      return <p style={styles.statusText}>Loading resources...</p>;
    }

    if (error) {
      return <div style={styles.errorText}>{error}</div>;
    }

    if (resources.length === 0) {
      return <p style={styles.statusText}>No resources available at the moment.</p>;
    }

    return (
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Capacity</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Availability Start</th>
              <th style={styles.th}>Availability End</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Description</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource, index) => (
              <tr key={resource.id || index}>
                <td style={styles.td}>{resource.name || '-'}</td>
                <td style={styles.td}>{resource.type || '-'}</td>
                <td style={styles.td}>{resource.capacity ?? '-'}</td>
                <td style={styles.td}>{resource.location || '-'}</td>
                <td style={styles.td}>{resource.availabilityStart || '-'}</td>
                <td style={styles.td}>{resource.availabilityEnd || '-'}</td>
                <td style={styles.td}>{resource.status || '-'}</td>
                <td style={styles.td}>{resource.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Facilities &amp; Assets Catalogue</h1>
        <p style={styles.subtitle}>
          Module A - Facilities &amp; Assets Catalogue: View and monitor campus resources such as rooms,
          labs, and shared spaces.
        </p>

        <section style={styles.formSection}>
          <h2 style={styles.formTitle}>Add New Resource</h2>

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
                {submitting ? 'Adding...' : 'Add Resource'}
              </button>

              {submitMessage && <p style={styles.successText}>{submitMessage}</p>}
              {submitError && <p style={styles.submitErrorText}>{submitError}</p>}
            </div>
          </form>
        </section>

        {renderBody()}
      </div>
    </div>
  );
}

export default App;
