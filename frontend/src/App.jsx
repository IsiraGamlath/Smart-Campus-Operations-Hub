import { useEffect, useState } from 'react';
import {
  createResourceApi,
  deleteResourceApi,
  fetchResourcesApi,
  updateResourceApi,
} from './resourceService';

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
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [deletingResourceId, setDeletingResourceId] = useState('');

  const isEditMode = Boolean(editingResourceId);

  const getResourceId = (resource) => resource?.id || resource?._id || '';

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingResourceId(null);
  };

  const fetchResources = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }

    setError('');

    try {
      const data = await fetchResourcesApi();
      setResources(data);
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

  const handleEdit = (resource) => {
    const resourceId = getResourceId(resource);

    if (!resourceId) {
      setSubmitMessage('');
      setSubmitError('Cannot edit this resource because no id was found.');
      return;
    }

    setFormData({
      name: resource.name || '',
      type: resource.type || '',
      capacity: resource.capacity ?? '',
      location: resource.location || '',
      availabilityStart: resource.availabilityStart || '',
      availabilityEnd: resource.availabilityEnd || '',
      status: resource.status || '',
      description: resource.description || '',
    });

    setEditingResourceId(resourceId);
    setSubmitMessage('');
    setSubmitError('');
  };

  const handleDelete = async (resourceId) => {
    if (!resourceId) {
      setSubmitMessage('');
      setSubmitError('Cannot delete this resource because no id was found.');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to delete this resource?');
    if (!confirmed) {
      return;
    }

    setSubmitMessage('');
    setSubmitError('');
    setDeletingResourceId(resourceId);

    try {
      await deleteResourceApi(resourceId);

      if (editingResourceId === resourceId) {
        resetForm();
      }

      await fetchResources(false);
      setSubmitMessage('Resource deleted successfully.');
    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred while deleting the resource.');
    } finally {
      setDeletingResourceId('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitError('');
    setSubmitting(true);

    if (isEditMode && !editingResourceId) {
      setSubmitError('Cannot update this resource because no id was found.');
      setSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    try {
      if (isEditMode) {
        await updateResourceApi(editingResourceId, payload);
      } else {
        await createResourceApi(payload);
      }

      resetForm();
      await fetchResources(false);
      setSubmitMessage(isEditMode ? 'Resource updated successfully.' : 'Resource created successfully.');
    } catch (err) {
      setSubmitError(
        err.message
          || 'An unexpected error occurred while ' + (isEditMode ? 'updating' : 'adding') + ' the resource.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-900">
            Facilities &amp; Assets Catalogue
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            Module A - Facilities &amp; Assets Catalogue: View and monitor campus resources such as
            rooms, labs, and shared spaces.
          </p>

          <section className="mt-6 border border-slate-200 rounded-lg bg-slate-50 p-4 sm:p-5">
            <h2 className="text-lg font-semibold text-slate-900">
              {isEditMode ? 'Edit Resource' : 'Add New Resource'}
            </h2>

            <form className="mt-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="type" className="text-sm font-medium text-slate-700">Type</label>
                  <input
                    id="type"
                    name="type"
                    type="text"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="capacity" className="text-sm font-medium text-slate-700">Capacity</label>
                  <input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="location" className="text-sm font-medium text-slate-700">Location</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="availabilityStart" className="text-sm font-medium text-slate-700">Availability Start</label>
                  <input
                    id="availabilityStart"
                    name="availabilityStart"
                    type="text"
                    value={formData.availabilityStart}
                    onChange={handleInputChange}
                    placeholder="e.g., 08:00"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="availabilityEnd" className="text-sm font-medium text-slate-700">Availability End</label>
                  <input
                    id="availabilityEnd"
                    name="availabilityEnd"
                    type="text"
                    value={formData.availabilityEnd}
                    onChange={handleInputChange}
                    placeholder="e.g., 17:00"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="status" className="text-sm font-medium text-slate-700">Status</label>
                  <input
                    id="status"
                    name="status"
                    type="text"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1 md:col-span-2 xl:col-span-3">
                  <label htmlFor="description" className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 min-h-[96px] resize-y focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3 flex-wrap">
                <button
                  type="submit"
                  className={
                    submitting
                      ? 'inline-flex items-center rounded-md bg-slate-400 px-4 py-2 text-sm font-semibold text-white cursor-not-allowed'
                      : 'inline-flex items-center rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300'
                  }
                  disabled={submitting}
                >
                  {submitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Resource' : 'Add Resource')}
                </button>

                {submitMessage && (
                  <p className="text-sm font-medium text-green-700">{submitMessage}</p>
                )}

                {submitError && (
                  <p className="text-sm font-medium text-red-700">{submitError}</p>
                )}
              </div>
            </form>
          </section>

          <section className="mt-6">
            {loading && <p className="py-3 text-sm text-slate-700">Loading resources...</p>}

            {!loading && error && (
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {!loading && !error && resources.length === 0 && (
              <p className="py-3 text-sm text-slate-700">No resources available at the moment.</p>
            )}

            {!loading && !error && resources.length > 0 && (
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="table w-full min-w-[1020px] border-collapse">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Name</th>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Type</th>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Capacity</th>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Location</th>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Availability Start</th>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Availability End</th>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Status</th>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Description</th>
                      <th className="border-b border-slate-200 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((resource, index) => {
                      const resourceId = getResourceId(resource);
                      const editDisabled = !resourceId || submitting || Boolean(deletingResourceId);
                      const deleteDisabled = !resourceId || submitting || deletingResourceId === resourceId;

                      return (
                        <tr key={resourceId || index} className="border-b border-slate-200 last:border-b-0">
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">{resource.name || '-'}</td>
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">{resource.type || '-'}</td>
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">{resource.capacity ?? '-'}</td>
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">{resource.location || '-'}</td>
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">{resource.availabilityStart || '-'}</td>
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">{resource.availabilityEnd || '-'}</td>
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">{resource.status || '-'}</td>
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">{resource.description || '-'}</td>
                          <td className="px-3 py-3 text-sm text-slate-700 align-top">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(resource)}
                                className={
                                  editDisabled
                                    ? 'rounded-md bg-slate-400 px-3 py-1.5 text-xs font-semibold text-white cursor-not-allowed'
                                    : 'rounded-md bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-300'
                                }
                                disabled={editDisabled}
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDelete(resourceId)}
                                className={
                                  deleteDisabled
                                    ? 'rounded-md bg-slate-400 px-3 py-1.5 text-xs font-semibold text-white cursor-not-allowed'
                                    : 'rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300'
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
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;