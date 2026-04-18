const API_BASE_URL = 'http://localhost:8080/api/resources';

const throwIfNotOk = (response, message) => {
  if (!response.ok) {
    throw new Error(message + ' (HTTP ' + response.status + ')');
  }
};

const defaultFetchOptions = {
  credentials: 'include',
};

const fetchResourceList = async (url, errorMessage) => {
  const response = await fetch(url, defaultFetchOptions);
  throwIfNotOk(response, errorMessage);

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const fetchResourcesApi = async () => {
  return fetchResourceList(API_BASE_URL, 'Failed to fetch resources');
};

export const fetchResourcesByNameApi = async (name) => {
  return fetchResourceList(
    API_BASE_URL + '/search/name/' + encodeURIComponent(name),
    'Failed to search resources by name',
  );
};

export const fetchResourcesByTypeApi = async (type) => {
  return fetchResourceList(
    API_BASE_URL + '/search/type/' + encodeURIComponent(type),
    'Failed to filter resources by type',
  );
};

export const fetchResourcesByLocationApi = async (location) => {
  return fetchResourceList(
    API_BASE_URL + '/search/location/' + encodeURIComponent(location),
    'Failed to filter resources by location',
  );
};

export const fetchResourcesByStatusApi = async (status) => {
  return fetchResourceList(
    API_BASE_URL + '/status/' + encodeURIComponent(status),
    'Failed to filter resources by status',
  );
};

export const fetchResourcesByMinimumCapacityApi = async (capacity) => {
  return fetchResourceList(
    API_BASE_URL + '/capacity/' + encodeURIComponent(capacity),
    'Failed to filter resources by minimum capacity',
  );
};

export const fetchResourcesByDateApi = async (bookingDate) => {
  return fetchResourceList(
    API_BASE_URL + '/date/' + encodeURIComponent(bookingDate),
    'Failed to filter resources by date',
  );
};

export const createResourceApi = async (payload) => {
  const response = await fetch(API_BASE_URL, {
    ...defaultFetchOptions,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  throwIfNotOk(response, 'Failed to add resource');
  return response;
};

export const updateResourceApi = async (resourceId, payload) => {
  const response = await fetch(API_BASE_URL + '/' + resourceId, {
    ...defaultFetchOptions,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  throwIfNotOk(response, 'Failed to update resource');
  return response;
};

export const deleteResourceApi = async (resourceId) => {
  const response = await fetch(API_BASE_URL + '/' + resourceId, {
    ...defaultFetchOptions,
    method: 'DELETE',
  });

  throwIfNotOk(response, 'Failed to delete resource');
  return response;
};
