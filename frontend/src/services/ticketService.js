import axios from 'axios';

const MOCK_USER = {
  id: "user1",
  role: "ADMIN"
};

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    userId: MOCK_USER.id,
    role: MOCK_USER.role
  },
});

export const getTickets = (params) => api.get('/tickets', { params });

export const getTicketById = (id) => api.get(`/tickets/${id}`);

export const createTicket = (ticketData) => api.post('/tickets', ticketData);

export const updateTicket = (id, ticketData) => api.put(`/tickets/${id}`, ticketData);

export const deleteTicket = (id) => api.delete(`/tickets/${id}`);

export const uploadTicketImages = (ticketId, files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('files', files[i]);
  }
  return api.post(`/tickets/${ticketId}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addComment = (ticketId, text) => 
  api.post(`/tickets/${ticketId}/comments`, { text });

export const deleteImage = (ticketId, url) =>
  api.delete(`/tickets/${ticketId}/image`, { params: { url } });

export default api;