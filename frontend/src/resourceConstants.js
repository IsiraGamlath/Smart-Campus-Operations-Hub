export const typeOptions = [
  'Lecture Hall',
  'Lab',
  'Library',
  'Conference Room',
  'Study Area',
];

export const locationOptions = [
  'Main Building',
  'New Building',
  'Business Management Building',
  'Engineering Building',
];

export const availabilityStartOptions = [
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

export const availabilityEndOptions = [
  '12:30',
  '13:30',
  '14:30',
  '15:30',
  '16:30',
  '17:30',
];

export const statusOptions = [
  'Available',
  'Reserved',
  'Under Maintenance',
  'Unavailable',
  'Closed',
];

export const nonBookableStatuses = new Set(['reserved', 'under maintenance', 'unavailable', 'closed']);
