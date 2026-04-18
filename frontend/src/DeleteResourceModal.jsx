function DeleteResourceModal({
  isOpen,
  onCancel,
  onConfirm,
  deletingResourceId,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-900">Confirm Deletion</h3>
        <p className="mt-3 text-sm text-slate-700">
          Are you sure you want to delete this resource?
        </p>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center rounded-xl bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            disabled={Boolean(deletingResourceId)}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={
              deletingResourceId
                ? 'inline-flex items-center rounded-xl bg-red-300 px-4 py-2 text-sm font-semibold text-white shadow-sm cursor-not-allowed transition duration-200'
                : 'inline-flex items-center rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
            }
            disabled={Boolean(deletingResourceId)}
          >
            {deletingResourceId ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteResourceModal;
