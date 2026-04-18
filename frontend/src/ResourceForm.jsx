function ResourceForm({
  mode,
  formData,
  formErrors,
  touchedFields,
  hasSubmitted,
  onInputChange,
  onFieldBlur,
  onSubmit,
  onCancel,
  submitting,
  typeOptions,
  locationOptions,
  availabilityStartOptions,
  availabilityEndOptions,
  statusOptions,
}) {
  const isEditMode = mode === 'edit';

  const getFieldError = (fieldName) => {
    if (!hasSubmitted && !touchedFields[fieldName]) {
      return '';
    }

    return formErrors[fieldName] || '';
  };

  const getInputClass = (fieldName) => {
    const baseClasses = 'w-full border rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-400 focus:outline-none';
    const invalidClasses = 'border-red-500';
    const validClasses = 'border-slate-300';

    return baseClasses + ' ' + (getFieldError(fieldName) ? invalidClasses : validClasses);
  };

  const getTextareaClass = (fieldName) => getInputClass(fieldName) + ' resize-none';

  const formatDateInputValue = (dateValue) => {
    const year = dateValue.getFullYear();
    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
    const day = String(dateValue.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  };

  const today = new Date();
  const minBookingDate = formatDateInputValue(today);
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);
  const maxBookingDate = formatDateInputValue(maxDate);

  return (
    <>
      <h2 className="text-lg font-semibold text-slate-900">
        {isEditMode ? 'Edit Resource' : 'Add New Resource'}
      </h2>

      <form className="mt-4" onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-sm font-medium text-slate-700">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getInputClass('name')}
              aria-invalid={Boolean(getFieldError('name'))}
              placeholder="Enter resource name"
            />
            {getFieldError('name') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('name')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="type" className="text-sm font-medium text-slate-700">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getInputClass('type')}
              aria-invalid={Boolean(getFieldError('type'))}
            >
              <option value="">Select type</option>
              {typeOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {getFieldError('type') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('type')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="capacity" className="text-sm font-medium text-slate-700">Capacity</label>
            <input
              id="capacity"
              name="capacity"
              type="number"
              min="2"
              value={formData.capacity}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getInputClass('capacity')}
              aria-invalid={Boolean(getFieldError('capacity'))}
              placeholder="Enter capacity"
            />
            {getFieldError('capacity') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('capacity')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="location" className="text-sm font-medium text-slate-700">Location</label>
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getInputClass('location')}
              aria-invalid={Boolean(getFieldError('location'))}
            >
              <option value="">Select location</option>
              {locationOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {getFieldError('location') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('location')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="bookingDate" className="text-sm font-medium text-slate-700">Date</label>
            <input
              id="bookingDate"
              name="bookingDate"
              type="date"
              min={minBookingDate}
              max={maxBookingDate}
              value={formData.bookingDate || ''}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getInputClass('bookingDate')}
              aria-invalid={Boolean(getFieldError('bookingDate'))}
            />
            {getFieldError('bookingDate') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('bookingDate')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="availabilityStart" className="text-sm font-medium text-slate-700">Availability Start</label>
            <input
              id="availabilityStart"
              name="availabilityStart"
              type="time"
              step="1800"
              value={formData.availabilityStart}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getInputClass('availabilityStart')}
              aria-invalid={Boolean(getFieldError('availabilityStart'))}
            />
            {getFieldError('availabilityStart') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('availabilityStart')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="availabilityEnd" className="text-sm font-medium text-slate-700">Availability End</label>
            <input
              id="availabilityEnd"
              name="availabilityEnd"
              type="time"
              step="1800"
              value={formData.availabilityEnd}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getInputClass('availabilityEnd')}
              aria-invalid={Boolean(getFieldError('availabilityEnd'))}
            />
            {getFieldError('availabilityEnd') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('availabilityEnd')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-sm font-medium text-slate-700">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getInputClass('status')}
              aria-invalid={Boolean(getFieldError('status'))}
            >
              <option value="">Select status</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {getFieldError('status') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('status')}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 md:col-span-3">
            <label htmlFor="description" className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onInputChange}
              onBlur={onFieldBlur}
              className={getTextareaClass('description')}
              aria-invalid={Boolean(getFieldError('description'))}
              placeholder="Optional description (max 250 characters)"
              rows={4}
            />
            {getFieldError('description') && (
              <p className="mt-1 text-xs text-red-600">{getFieldError('description')}</p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className={
              submitting
                ? 'inline-flex items-center rounded-xl bg-blue-300 px-4 py-2 text-sm font-semibold text-white shadow-sm cursor-not-allowed transition duration-200'
                : (
                  isEditMode
                    ? 'inline-flex items-center rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400'
                    : 'inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400'
                )
            }
            disabled={submitting}
          >
            {submitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Resource' : 'Add Resource')}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center rounded-xl bg-gray-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              disabled={submitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </>
  );
}

export default ResourceForm;