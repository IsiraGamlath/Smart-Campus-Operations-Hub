function ResourceRow({
  resource,
  styles,
  onEdit,
  onDelete,
  deletingResourceId,
  submitting,
  getResourceId,
}) {
  const resourceId = getResourceId(resource);

  const editDisabled = !resourceId || submitting || Boolean(deletingResourceId);
  const deleteDisabled = !resourceId || submitting || deletingResourceId === resourceId;

  return (
    <tr>
      <td style={styles.td}>{resource.name || '-'}</td>
      <td style={styles.td}>{resource.type || '-'}</td>
      <td style={styles.td}>{resource.capacity ?? '-'}</td>
      <td style={styles.td}>{resource.location || '-'}</td>
      <td style={styles.td}>{resource.availabilityStart || '-'}</td>
      <td style={styles.td}>{resource.availabilityEnd || '-'}</td>
      <td style={styles.td}>{resource.status || '-'}</td>
      <td style={styles.td}>{resource.description || '-'}</td>
      <td style={styles.td}>
        <div style={styles.actionsCell}>
          <button
            type="button"
            onClick={() => onEdit(resource)}
            style={editDisabled ? styles.rowButtonDisabled : styles.editButton}
            disabled={editDisabled}
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(resourceId)}
            style={deleteDisabled ? styles.rowButtonDisabled : styles.deleteButton}
            disabled={deleteDisabled}
          >
            {deletingResourceId === resourceId ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default ResourceRow;
