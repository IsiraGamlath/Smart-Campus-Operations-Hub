import axios from "axios";

export const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// ROBUST DEBUG LOGGING
api.interceptors.request.use((config) => {
  console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`, config.data || "");
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API Success] ${response.config.method.toUpperCase()} ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error(`[API Error]`, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getTickets = () => api.get("/tickets");

export const getMyTickets = () => api.get("/tickets/me");

export const getTicketById = (id) => api.get(`/tickets/${id}`);

// NEW COMMENT ENDPOINTS (To match /api/comments)
export const getComments = (ticketId) => api.get(`/comments/${ticketId}`);

export const createComment = (ticketId, text) => 
  api.post("/comments", { ticketId, text });

// CREATE TICKET (FormData + Multipart)
export const createTicket = (formData) => api.post("/tickets", formData, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data);

export const deleteTicket = (id) => api.delete(`/tickets/${id}`);

export const deleteComment = (id, commentId) =>
  api.delete(`/tickets/${id}/comments/${commentId}`);

export const deleteImage = (id, url) =>
  api.delete(`/tickets/${id}/image`, {
    params: { url },
  });

export const uploadTicketImages = (ticketId, selectedFile) => {
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("ticketId", ticketId);

  return api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default api;