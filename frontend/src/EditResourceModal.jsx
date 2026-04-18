import ResourceForm from './ResourceForm.jsx';

function EditResourceModal({
  isOpen,
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
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <ResourceForm
          mode="edit"
          formData={formData}
          formErrors={formErrors}
          touchedFields={touchedFields}
          hasSubmitted={hasSubmitted}
          onInputChange={onInputChange}
          onFieldBlur={onFieldBlur}
          onSubmit={onSubmit}
          onCancel={onCancel}
          submitting={submitting}
          typeOptions={typeOptions}
          locationOptions={locationOptions}
          availabilityStartOptions={availabilityStartOptions}
          availabilityEndOptions={availabilityEndOptions}
          statusOptions={statusOptions}
        />
      </div>
    </div>
  );
}

export default EditResourceModal;
