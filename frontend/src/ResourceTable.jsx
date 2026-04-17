import ResourceRow from './ResourceRow.jsx';

function ResourceTable({
  resources,
  loading,
  error,
  styles,
  onEdit,
  onDelete,
  deletingResourceId,
  submitting,
  getResourceId,
}) {
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
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((resource, index) => (
            <ResourceRow
              key={getResourceId(resource) || index}
              resource={resource}
              styles={styles}
              onEdit={onEdit}
              onDelete={onDelete}
              deletingResourceId={deletingResourceId}
              submitting={submitting}
              getResourceId={getResourceId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResourceTable;
