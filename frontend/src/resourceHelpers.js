import { nonBookableStatuses } from './resourceConstants';

export const parseTimeToMinutes = (timeValue) => {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(timeValue);

  if (!match) {
    return null;
  }

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return (hours * 60) + minutes;
};

export const getResourceId = (resource) => resource?.id || resource?._id || '';

export const normalizeStatus = (status) => (status || '').trim().toLowerCase();

export const isBookable = (status) => {
  const normalizedStatus = normalizeStatus(status);

  if (!normalizedStatus) {
    return false;
  }

  return !nonBookableStatuses.has(normalizedStatus);
};

export const getResourceKey = (resource) => {
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

export const intersectResourceGroups = (resourceGroups) => {
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
