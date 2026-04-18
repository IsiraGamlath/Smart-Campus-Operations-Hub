import { parseTimeToMinutes } from './resourceHelpers';

const parseDateInputValue = (dateValue) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const parsedDate = new Date(year, month - 1, day);

  if (
    parsedDate.getFullYear() !== year
    || parsedDate.getMonth() !== month - 1
    || parsedDate.getDate() !== day
  ) {
    return null;
  }

  parsedDate.setHours(0, 0, 0, 0);
  return parsedDate;
};

export const initialFormData = {
  name: '',
  type: '',
  capacity: '',
  location: '',
  bookingDate: '',
  availabilityStart: '',
  availabilityEnd: '',
  status: '',
  description: '',
};

export const initialFilterData = {
  name: '',
  type: '',
  location: '',
  bookingDate: '',
  status: '',
  minCapacity: '',
};

export const validateField = (fieldName, fieldValue, currentData) => {
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

    case 'bookingDate': {
      if (!trimmedValue) {
        return 'Please select a date';
      }

      const selectedDate = parseDateInputValue(trimmedValue);

      if (!selectedDate) {
        return 'Please select a valid date';
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return 'Date cannot be in the past';
      }

      const maxAllowedDate = new Date(today);
      maxAllowedDate.setDate(maxAllowedDate.getDate() + 30);

      if (selectedDate > maxAllowedDate) {
        return 'Date cannot be more than 30 days from today';
      }

      return '';
    }

    case 'availabilityStart':
      if (!trimmedValue) {
        return 'Please select the availability start time';
      }
      return '';

    case 'availabilityEnd': {
      const startValue = (currentData.availabilityStart || '').trim();
      const endValue = trimmedValue;

      if (!endValue) {
        return 'Please select the availability end time';
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

export const validateForm = (currentData) => {
  const nextErrors = {};

  Object.keys(initialFormData).forEach((fieldName) => {
    const fieldError = validateField(fieldName, currentData[fieldName], currentData);

    if (fieldError) {
      nextErrors[fieldName] = fieldError;
    }
  });

  return nextErrors;
};

export const getNextErrorsOnChange = (
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
    const hasEndValue = (nextData.availabilityEnd || '').trim() !== '';
    const shouldValidateEnd = hasSubmitted
      || touchedFields.availabilityEnd
      || (fieldName === 'availabilityStart' && hasEndValue);

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

export const getNextErrorsOnBlur = (
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
