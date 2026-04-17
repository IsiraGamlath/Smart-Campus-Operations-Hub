function getStatusBadge(status) {
  const normalizedStatus = (status || '').trim().toLowerCase();
  const baseClass = 'px-3 py-1 rounded-full text-sm font-medium inline-block border';

  if (normalizedStatus === 'available') {
    return (
      <span className={baseClass + ' bg-green-100 text-green-700 border-green-300'}>
        Available
      </span>
    );
  }

  if (normalizedStatus === 'reserved') {
    return (
      <span className={baseClass + ' bg-yellow-100 text-yellow-700 border-yellow-300'}>
        Reserved
      </span>
    );
  }

  if (normalizedStatus === 'under maintenance') {
    return (
      <span className={baseClass + ' bg-red-100 text-red-700 border-red-300'}>
        Under Maintenance
      </span>
    );
  }

  if (normalizedStatus === 'unavailable') {
    return (
      <span className={baseClass + ' bg-gray-100 text-gray-700 border-gray-300'}>
        Unavailable
      </span>
    );
  }

  if (normalizedStatus === 'closed') {
    return (
      <span className={baseClass + ' bg-slate-200 text-slate-700 border-slate-400'}>
        Closed
      </span>
    );
  }

  return (
    <span className={baseClass + ' bg-slate-100 text-slate-700 border-slate-300'}>
      {status || 'Unknown'}
    </span>
  );
}

function ResourceTable({
  resources,
  loading,
  error,
  onEdit,
  onRequestDelete,
  onBook,
  getResourceId,
  isBookable,
  deletingResourceId,
  actionBusy,
}) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-md">
        <p className="py-6 text-center text-gray-500">Loading resources...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 shadow-md">
        <p className="py-6 text-center italic text-gray-500">No matching resources found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 font-semibold uppercase tracking-wide">
              <th className="px-4 py-3 text-left text-xs">Name</th>
              <th className="px-4 py-3 text-left text-xs">Type</th>
              <th className="px-4 py-3 text-left text-xs">Capacity</th>
              <th className="px-4 py-3 text-left text-xs">Location</th>
              <th className="px-4 py-3 text-left text-xs">Availability Start</th>
              <th className="px-4 py-3 text-left text-xs">Availability End</th>
              <th className="px-4 py-3 text-left text-xs">Status</th>
              <th className="px-4 py-3 text-left text-xs">Description</th>
              <th className="px-4 py-3 text-left text-xs whitespace-nowrap">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {resources.map((resource, index) => {
              const resourceId = getResourceId(resource);
              const bookable = isBookable(resource.status);
              const editDisabled = !resourceId || actionBusy || Boolean(deletingResourceId);
              const deleteDisabled = !resourceId || actionBusy || deletingResourceId === resourceId;
              const bookDisabled = !resourceId || actionBusy || Boolean(deletingResourceId) || !bookable;

              return (
                <tr
                  key={resourceId || index}
                  className={
                    'transition hover:bg-gray-50 ' + (bookable ? '' : 'bg-gray-50/40')
                  }
                >
                  <td className="px-4 py-3 align-top text-sm text-gray-700">{resource.name || '-'}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700">{resource.type || '-'}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700">{resource.capacity ?? '-'}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700">{resource.location || '-'}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700">{resource.availabilityStart || '-'}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700">{resource.availabilityEnd || '-'}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700">
                    {getStatusBadge(resource.status)}
                    {!bookable && (
                      <p className="mt-1 text-xs text-slate-500">Not available for booking</p>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700">{resource.description || '-'}</td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700 whitespace-nowrap">
                    <div className="flex flex-nowrap items-center gap-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onBook(resource)}
                        className={
                          bookDisabled
                            ? 'shrink-0 whitespace-nowrap rounded-xl bg-emerald-300 px-3 py-1.5 text-xs font-semibold text-white shadow-sm cursor-not-allowed transition duration-200'
                            : 'shrink-0 whitespace-nowrap rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        }
                        disabled={bookDisabled}
                        title={bookable ? 'Book this resource' : 'Booking disabled for current status'}
                      >
                        Book
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(resource)}
                        className={
                          editDisabled
                            ? 'shrink-0 whitespace-nowrap rounded-xl bg-blue-300 px-3 py-1.5 text-xs font-semibold text-white shadow-sm cursor-not-allowed transition duration-200'
                            : 'shrink-0 whitespace-nowrap rounded-xl bg-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        }
                        disabled={editDisabled}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onRequestDelete(resource)}
                        className={
                          deleteDisabled
                            ? 'shrink-0 whitespace-nowrap rounded-xl bg-red-300 px-3 py-1.5 text-xs font-semibold text-white shadow-sm cursor-not-allowed transition duration-200'
                            : 'shrink-0 whitespace-nowrap rounded-xl bg-red-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
                        }
                        disabled={deleteDisabled}
                      >
                        {deletingResourceId === resourceId ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResourceTable;