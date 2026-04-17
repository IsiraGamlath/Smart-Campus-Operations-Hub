import { useEffect, useState } from 'react';
import ResourceForm from './ResourceForm.jsx';
import ResourceTable from './ResourceTable.jsx';
import {
  createResourceApi,
  deleteResourceApi,
  fetchResourcesApi,
  fetchResourcesByLocationApi,
  fetchResourcesByMinimumCapacityApi,
  fetchResourcesByNameApi,
  fetchResourcesByStatusApi,
  fetchResourcesByTypeApi,
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

const initialFilterData = {
  name: '',
  type: '',
  location: '',
  status: '',
  minCapacity: '',
};

const typeOptions = [
  'Lecture Hall',
  'Lab',
  'Library',
  'Conference Room',
  'Study Area',
];

const locationOptions = [
  'Main Building',
  'New Building',
  'Business Management Building',
  'Engineering Building',
];

const availabilityStartOptions = [
  '08:30',
  '09:30',
  '10:30',
  '11:30',
  '12:30',
  '13:30',
  '14:30',
  '15:30',
  '16:30',
];

const availabilityEndOptions = [
  '12:30',
  '13:30',
  '14:30',
  '15:30',
  '16:30',
  '17:30',
];

const statusOptions = [
  'Available',
  'Reserved',
  'Under Maintenance',
  'Unavailable',
  'Closed',
];

const nonBookableStatuses = new Set(['reserved', 'under maintenance', 'unavailable', 'closed']);

const parseTimeToMinutes = (timeValue) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeValue);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return (hours * 60) + minutes;
};

function App() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [addFormData, setAddFormData] = useState(initialFormData);
  const [addFormErrors, setAddFormErrors] = useState({});
  const [addTouchedFields, setAddTouchedFields] = useState({});
  const [addHasSubmitted, setAddHasSubmitted] = useState(false);
  const [addSubmitting, setAddSubmitting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingResourceId, setEditingResourceId] = useState('');
  const [editFormData, setEditFormData] = useState(initialFormData);
  const [editFormErrors, setEditFormErrors] = useState({});
  const [editTouchedFields, setEditTouchedFields] = useState({});
  const [editHasSubmitted, setEditHasSubmitted] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [pendingDeleteResource, setPendingDeleteResource] = useState(null);
  const [deletingResourceId, setDeletingResourceId] = useState('');

  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const [filterData, setFilterData] = useState(initialFilterData);
  const [filtering, setFiltering] = useState(false);

  const getResourceId = (resource) => resource?.id || resource?._id || '';

  const normalizeStatus = (status) => (status || '').trim().toLowerCase();

  const isBookable = (status) => {
    const normalizedStatus = normalizeStatus(status);

    if (!normalizedStatus) {
      return false;
    }

    return !nonBookableStatuses.has(normalizedStatus);
  };

  const getResourceKey = (resource) => {
    const resourceId = getResourceId(resource);

    if (resourceId) {
      return 'id:' + resourceId;
    }

    return [
      resource?.name || '',
      resource?.type || '',
      resource?.location || '',
      resource?.capacity ?? '',
      resource?.availabilityStart || '',
      resource?.availabilityEnd || '',
      resource?.status || '',
      resource?.description || '',
    ].join('|').toLowerCase();
  };

  const intersectResourceGroups = (resourceGroups) => {
    if (resourceGroups.length === 0) {
      return [];
    }

    let intersection = resourceGroups[0];

    for (let index = 1; index < resourceGroups.length; index += 1) {
      const groupKeys = new Set(resourceGroups[index].map((resource) => getResourceKey(resource)));
      intersection = intersection.filter((resource) => groupKeys.has(getResourceKey(resource)));
    }

    return intersection;
  };

  const validateField = (fieldName, fieldValue, currentData) => {
    const value = typeof fieldValue === 'string' ? fieldValue : String(fieldValue ?? '');
    const trimmedValue = value.trim();

    switch (fieldName) {
      case 'name':
        if (trimmedValue.length < 3) {
          return 'Resource name must be at least 3 characters';
        }
        return '';

      case 'type':
        if (!trimmedValue) {
          return 'Please select a resource type';
        }
        return '';

      case 'capacity':
        if (!trimmedValue || Number.isNaN(Number(trimmedValue)) || Number(trimmedValue) < 2) {
          return 'Capacity must be at least 2';
        }
        return '';

      case 'location':
        if (!trimmedValue) {
          return 'Please select a location';
        }
        return '';

      case 'availabilityStart':
        if (!trimmedValue) {
          return 'Please select the availability start time';
        }
        return '';

      case 'availabilityEnd': {
        const startValue = (currentData.availabilityStart || '').trim();
        const endValue = trimmedValue;

        if (!endValue) {
          return 'Availability end time must be later than availability start time';
        }

        const startMinutes = parseTimeToMinutes(startValue);
        const endMinutes = parseTimeToMinutes(endValue);

        if (startMinutes === null || endMinutes === null || endMinutes <= startMinutes) {
          return 'Availability end time must be later than availability start time';
        }

        return '';
      }

      case 'status':
        if (!trimmedValue) {
          return 'Please select a status';
        }
        return '';

      case 'description':
        if (trimmedValue && value.length > 250) {
          return 'Description must be less than 250 characters';
        }
        return '';

      default:
        return '';
    }
  };

  const validateForm = (currentData) => {
    const nextErrors = {};

    Object.keys(initialFormData).forEach((fieldName) => {
      const fieldError = validateField(fieldName, currentData[fieldName], currentData);

      if (fieldError) {
        nextErrors[fieldName] = fieldError;
      }
    });

    return nextErrors;
  };

  const getNextErrorsOnChange = (
    prevErrors,
    fieldName,
    fieldValue,
    nextData,
    touchedFields,
    hasSubmitted,
  ) => {
    const nextErrors = { ...prevErrors };
    const shouldValidateCurrentField = hasSubmitted || touchedFields[fieldName];

    if (shouldValidateCurrentField) {
      const currentFieldError = validateField(fieldName, fieldValue, nextData);

      if (currentFieldError) {
        nextErrors[fieldName] = currentFieldError;
      } else {
        delete nextErrors[fieldName];
      }
    }

    if (fieldName === 'availabilityStart' || fieldName === 'availabilityEnd') {
      const shouldValidateStart = hasSubmitted || touchedFields.availabilityStart;
      const shouldValidateEnd = hasSubmitted || touchedFields.availabilityEnd;

      if (shouldValidateStart) {
        const startFieldError = validateField('availabilityStart', nextData.availabilityStart, nextData);

        if (startFieldError) {
          nextErrors.availabilityStart = startFieldError;
        } else {
          delete nextErrors.availabilityStart;
        }
      }

      if (shouldValidateEnd) {
        const endFieldError = validateField('availabilityEnd', nextData.availabilityEnd, nextData);

        if (endFieldError) {
          nextErrors.availabilityEnd = endFieldError;
        } else {
          delete nextErrors.availabilityEnd;
        }
      }
    }

    return nextErrors;
  };

  const getNextErrorsOnBlur = (
    prevErrors,
    fieldName,
    formData,
    touchedFields,
    hasSubmitted,
  ) => {
    const nextErrors = { ...prevErrors };
    const currentFieldError = validateField(fieldName, formData[fieldName], formData);

    if (currentFieldError) {
      nextErrors[fieldName] = currentFieldError;
    } else {
      delete nextErrors[fieldName];
    }

    if (fieldName === 'availabilityStart' && (touchedFields.availabilityEnd || hasSubmitted)) {
      const endFieldError = validateField('availabilityEnd', formData.availabilityEnd, formData);

      if (endFieldError) {
        nextErrors.availabilityEnd = endFieldError;
      } else {
        delete nextErrors.availabilityEnd;
      }
    }

    return nextErrors;
  };

  const resetAddForm = () => {
    setAddFormData(initialFormData);
    setAddFormErrors({});
    setAddTouchedFields({});
    setAddHasSubmitted(false);
  };

  const resetEditForm = () => {
    setEditFormData(initialFormData);
    setEditFormErrors({});
    setEditTouchedFields({});
    setEditHasSubmitted(false);
    setEditingResourceId('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    resetEditForm();
    setSubmitError('');
  };

  useEffect(() => {
    if (!submitMessage) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setSubmitMessage('');
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [submitMessage]);

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

  const handleAddInputChange = (event) => {
    const { name, value } = event.target;
    const nextData = {
      ...addFormData,
      [name]: value,
    };

    setAddFormData(nextData);

    setAddFormErrors((prevErrors) => getNextErrorsOnChange(
      prevErrors,
      name,
      value,
      nextData,
      addTouchedFields,
      addHasSubmitted,
    ));
  };

  const handleAddFieldBlur = (event) => {
    const { name } = event.target;
    const nextTouchedFields = {
      ...addTouchedFields,
      [name]: true,
    };

    setAddTouchedFields(nextTouchedFields);

    setAddFormErrors((prevErrors) => getNextErrorsOnBlur(
      prevErrors,
      name,
      addFormData,
      nextTouchedFields,
      addHasSubmitted,
    ));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitError('');
    setAddHasSubmitted(true);

    const validationErrors = validateForm(addFormData);
    setAddFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setAddSubmitting(true);

    const payload = {
      ...addFormData,
      capacity: Number(addFormData.capacity),
    };

    try {
      await createResourceApi(payload);
      resetAddForm();
      await fetchResources(false);
      setSubmitMessage('Resource created successfully.');
    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred while adding the resource.');
    } finally {
      setAddSubmitting(false);
    }
  };

  const openEditModal = (resource) => {
    const resourceId = getResourceId(resource);

    if (!resourceId) {
      setSubmitMessage('');
      setSubmitError('Cannot edit this resource because no id was found.');
      return;
    }

    setEditingResourceId(resourceId);
    setEditFormData({
      name: resource.name || '',
      type: resource.type || '',
      capacity: resource.capacity ?? '',
      location: resource.location || '',
      availabilityStart: resource.availabilityStart || '',
      availabilityEnd: resource.availabilityEnd || '',
      status: resource.status || '',
      description: resource.description || '',
    });
    setEditFormErrors({});
    setEditTouchedFields({});
    setEditHasSubmitted(false);
    setSubmitMessage('');
    setSubmitError('');
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    const nextData = {
      ...editFormData,
      [name]: value,
    };

    setEditFormData(nextData);

    setEditFormErrors((prevErrors) => getNextErrorsOnChange(
      prevErrors,
      name,
      value,
      nextData,
      editTouchedFields,
      editHasSubmitted,
    ));
  };

  const handleEditFieldBlur = (event) => {
    const { name } = event.target;
    const nextTouchedFields = {
      ...editTouchedFields,
      [name]: true,
    };

    setEditTouchedFields(nextTouchedFields);

    setEditFormErrors((prevErrors) => getNextErrorsOnBlur(
      prevErrors,
      name,
      editFormData,
      nextTouchedFields,
      editHasSubmitted,
    ));
  };

  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    setSubmitMessage('');
    setSubmitError('');
    setEditHasSubmitted(true);

    const validationErrors = validateForm(editFormData);
    setEditFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (!editingResourceId) {
      setSubmitError('Cannot update this resource because no id was found.');
      return;
    }

    setEditSubmitting(true);

    const payload = {
      ...editFormData,
      capacity: Number(editFormData.capacity),
    };

    try {
      await updateResourceApi(editingResourceId, payload);
      setIsEditModalOpen(false);
      resetEditForm();
      await fetchResources(false);
      setSubmitMessage('Resource updated successfully.');
    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred while updating the resource.');
    } finally {
      setEditSubmitting(false);
    }
  };

  const openDeleteModal = (resource) => {
    setPendingDeleteResource(resource);
  };

  const closeDeleteModal = () => {
    setPendingDeleteResource(null);
  };

  const confirmDeleteResource = async () => {
    const resourceId = getResourceId(pendingDeleteResource);

    if (!resourceId) {
      setSubmitMessage('');
      setSubmitError('Cannot delete this resource because no id was found.');
      setPendingDeleteResource(null);
      return;
    }

    setSubmitMessage('');
    setSubmitError('');
    setDeletingResourceId(resourceId);

    try {
      await deleteResourceApi(resourceId);

      if (isEditModalOpen && editingResourceId === resourceId) {
        closeEditModal();
      }

      setPendingDeleteResource(null);
      await fetchResources(false);
      setSubmitMessage('Resource deleted successfully.');
    } catch (err) {
      setSubmitError(err.message || 'An unexpected error occurred while deleting the resource.');
    } finally {
      setDeletingResourceId('');
    }
  };

  const handleBookResource = (resource) => {
    if (!isBookable(resource.status)) {
      return;
    }

    const resourceName = (resource.name || 'Selected resource').trim();
    setSubmitError('');
    setSubmitMessage(resourceName + ' is available for booking.');
  };

  const handleFilterInputChange = (event) => {
    const { name, value } = event.target;
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');

    const name = filterData.name.trim();
    const type = filterData.type.trim();
    const location = filterData.location.trim();
    const status = filterData.status.trim();
    const minCapacityValue = filterData.minCapacity.trim();

    if (minCapacityValue !== '' && (!Number.isInteger(Number(minCapacityValue)) || Number(minCapacityValue) < 0)) {
      setError('Minimum capacity must be a whole number greater than or equal to 0.');
      return;
    }

    const hasAnyFilter = name || type || location || status || minCapacityValue !== '';

    if (!hasAnyFilter) {
      await fetchResources();
      return;
    }

    setLoading(true);
    setFiltering(true);

    try {
      const resourceGroups = [];

      if (name) {
        resourceGroups.push(await fetchResourcesByNameApi(name));
      }

      if (type) {
        resourceGroups.push(await fetchResourcesByTypeApi(type));
      }

      if (location) {
        resourceGroups.push(await fetchResourcesByLocationApi(location));
      }

      if (status) {
        resourceGroups.push(await fetchResourcesByStatusApi(status));
      }

      if (minCapacityValue !== '') {
        resourceGroups.push(await fetchResourcesByMinimumCapacityApi(Number(minCapacityValue)));
      }

      setResources(intersectResourceGroups(resourceGroups));
    } catch (err) {
      setError(err.message || 'An unexpected error occurred while filtering resources.');
    } finally {
      setLoading(false);
      setFiltering(false);
    }
  };

  const handleResetFilters = async () => {
    setFilterData(initialFilterData);
    setError('');
    await fetchResources();
  };

  const actionBusy = addSubmitting || editSubmitting || filtering;

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Facilities &amp; Assets Catalogue
          </h1>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Module A - Facilities &amp; Assets Catalogue: View and monitor campus resources such as
            rooms, labs, and shared spaces.
          </p>
        </div>

        {submitMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {submitMessage}
          </div>
        )}

        {submitError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <section className="mb-6 rounded-2xl bg-white p-6 shadow-md">
          <ResourceForm
            mode="add"
            formData={addFormData}
            formErrors={addFormErrors}
            touchedFields={addTouchedFields}
            hasSubmitted={addHasSubmitted}
            onInputChange={handleAddInputChange}
            onFieldBlur={handleAddFieldBlur}
            onSubmit={handleAddSubmit}
            submitting={addSubmitting}
            typeOptions={typeOptions}
            locationOptions={locationOptions}
            availabilityStartOptions={availabilityStartOptions}
            availabilityEndOptions={availabilityEndOptions}
            statusOptions={statusOptions}
          />
        </section>

        <section className="mb-6 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-lg font-semibold text-slate-900">Search &amp; Filter Resources</h2>

          <form className="mt-4" onSubmit={handleSearch}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex flex-col gap-1">
                <label htmlFor="filterName" className="text-sm font-medium text-slate-700">Search by Name</label>
                <input
                  id="filterName"
                  name="name"
                  type="text"
                  value={filterData.name}
                  onChange={handleFilterInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="e.g., Computer Lab"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="filterType" className="text-sm font-medium text-slate-700">Filter by Type</label>
                <select
                  id="filterType"
                  name="type"
                  value={filterData.type}
                  onChange={handleFilterInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">All types</option>
                  {typeOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="filterLocation" className="text-sm font-medium text-slate-700">Filter by Location</label>
                <select
                  id="filterLocation"
                  name="location"
                  value={filterData.location}
                  onChange={handleFilterInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">All locations</option>
                  {locationOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="filterStatus" className="text-sm font-medium text-slate-700">Filter by Status</label>
                <select
                  id="filterStatus"
                  name="status"
                  value={filterData.status}
                  onChange={handleFilterInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">All statuses</option>
                  {statusOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="filterMinCapacity" className="text-sm font-medium text-slate-700">Minimum Capacity</label>
                <input
                  id="filterMinCapacity"
                  name="minCapacity"
                  type="number"
                  min="0"
                  value={filterData.minCapacity}
                  onChange={handleFilterInputChange}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="e.g., 40"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className={
                  filtering
                    ? 'inline-flex items-center rounded-xl bg-blue-300 px-4 py-2 text-sm font-semibold text-white shadow-sm cursor-not-allowed transition duration-200'
                    : 'inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                }
                disabled={filtering}
              >
                {filtering ? 'Searching...' : 'Search'}
              </button>

              <button
                type="button"
                className="inline-flex items-center rounded-xl bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={handleResetFilters}
                disabled={filtering}
              >
                Reset
              </button>
            </div>
          </form>
        </section>

        <section className="mb-6">
          <ResourceTable
            resources={resources}
            loading={loading}
            error={error}
            onEdit={openEditModal}
            onRequestDelete={openDeleteModal}
            onBook={handleBookResource}
            getResourceId={getResourceId}
            isBookable={isBookable}
            deletingResourceId={deletingResourceId}
            actionBusy={actionBusy}
          />
        </section>
      </div>

      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <ResourceForm
              mode="edit"
              formData={editFormData}
              formErrors={editFormErrors}
              touchedFields={editTouchedFields}
              hasSubmitted={editHasSubmitted}
              onInputChange={handleEditInputChange}
              onFieldBlur={handleEditFieldBlur}
              onSubmit={handleUpdateSubmit}
              onCancel={closeEditModal}
              submitting={editSubmitting}
              typeOptions={typeOptions}
              locationOptions={locationOptions}
              availabilityStartOptions={availabilityStartOptions}
              availabilityEndOptions={availabilityEndOptions}
              statusOptions={statusOptions}
            />
          </div>
        </div>
      )}

      {pendingDeleteResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900">Confirm Deletion</h3>
            <p className="mt-3 text-sm text-slate-700">
              Are you sure you want to delete this resource?
            </p>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="inline-flex items-center rounded-xl bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={Boolean(deletingResourceId)}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDeleteResource}
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
      )}
    </div>
  );
}

export default App;