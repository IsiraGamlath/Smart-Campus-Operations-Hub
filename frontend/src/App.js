import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
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
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

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
        {renderBody()}
      </div>
    </div>
  );
}

export default App;
