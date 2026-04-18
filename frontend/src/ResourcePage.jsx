import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DeleteResourceModal from './DeleteResourceModal.jsx';
import EditResourceModal from './EditResourceModal.jsx';
import ResourceFilter from './ResourceFilter.jsx';
import ResourceForm from './ResourceForm.jsx';
import ResourceTable from './ResourceTable.jsx';
import {
  availabilityEndOptions,
  availabilityStartOptions,
  locationOptions,
  statusOptions,
  typeOptions,
} from './resourceConstants';
import {
  getResourceId,
  intersectResourceGroups,
  isBookable,
} from './resourceHelpers';
import {
  getNextErrorsOnBlur,
  getNextErrorsOnChange,
  initialFilterData,
  initialFormData,
  validateForm,
} from './resourceValidation';
import {
  createResourceApi,
  deleteResourceApi,
  fetchResourcesByDateApi,
  fetchResourcesApi,
  fetchResourcesByLocationApi,
  fetchResourcesByMinimumCapacityApi,
  fetchResourcesByNameApi,
  fetchResourcesByStatusApi,
  fetchResourcesByTypeApi,
  updateResourceApi,
} from './resourceService';

function ResourcePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

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
      bookingDate: resource.bookingDate || '',
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
    const resourceId = getResourceId(resource);
    if (!resourceId || !isBookable(resource.status)) {
      return;
    }

    navigate('/bookings?resourceId=' + encodeURIComponent(resourceId));
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
    const bookingDate = filterData.bookingDate.trim();
    const status = filterData.status.trim();
    const minCapacityValue = filterData.minCapacity.trim();

    if (minCapacityValue !== '' && (!Number.isInteger(Number(minCapacityValue)) || Number(minCapacityValue) < 0)) {
      setError('Minimum capacity must be a whole number greater than or equal to 0.');
      return;
    }

    const hasAnyFilter = name || type || location || bookingDate || status || minCapacityValue !== '';

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

      if (bookingDate) {
        resourceGroups.push(await fetchResourcesByDateApi(bookingDate));
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

        {isAdmin && (
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
        )}

        <ResourceFilter
          filterData={filterData}
          filtering={filtering}
          onFilterInputChange={handleFilterInputChange}
          onSearch={handleSearch}
          onReset={handleResetFilters}
          typeOptions={typeOptions}
          locationOptions={locationOptions}
          statusOptions={statusOptions}
        />

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
            showBookAction={!isAdmin}
            showManageActions={isAdmin}
          />
        </section>
      </div>

      {isAdmin && (
        <>
          <EditResourceModal
            isOpen={isEditModalOpen}
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

          <DeleteResourceModal
            isOpen={Boolean(pendingDeleteResource)}
            onCancel={closeDeleteModal}
            onConfirm={confirmDeleteResource}
            deletingResourceId={deletingResourceId}
          />
        </>
      )}
    </div>
  );
}

export default ResourcePage;
