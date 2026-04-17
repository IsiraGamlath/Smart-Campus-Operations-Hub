const API_BASE_URL = 'http://localhost:8082/api/resources';

const throwIfNotOk = (response, message) => {
  if (!response.ok) {
    throw new Error(message + ' (HTTP ' + response.status + ')');
  }
};

export const fetchResourcesApi = async () => {
  const response = await fetch(API_BASE_URL);
  throwIfNotOk(response, 'Failed to fetch resources');

  const data = await response.json();
  return Array.isArray(data) ? data : [];
};

export const createResourceApi = async (payload) => {
  const response = await fetch(API_BASE_URL, {
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
    method: 'DELETE',
  });

  throwIfNotOk(response, 'Failed to delete resource');
  return response;
};
