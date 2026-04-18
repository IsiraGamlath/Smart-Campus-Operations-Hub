import axios from "axios";

const API = "http://localhost:8091/api/tickets";

const api = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json"
  }
});

//  GET ALL
export const getTickets = () => api.get("");

//  GET BY ID
export const getTicketById = (id) => api.get(`/${id}`);

//  CREATE
export const createTicket = (data) => api.post("", data);

//  UPDATE
export const updateTicket = (id, data) => api.put(`/${id}`, data);

//  DELETE
export const deleteTicket = (id) => api.delete(`/${id}`);

//  ADD COMMENT
export const addComment = (id, text) =>
  api.post(`/${id}/comments`, { text });

//  DELETE COMMENT
export const deleteComment = (id, commentId) =>
  api.delete(`/${id}/comments/${commentId}`);

//  UPLOAD IMAGES
export const uploadTicketImages = (id, files) => {
  const formData = new FormData();

  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }

  return api.post(`/${id}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

// DELETE IMAGE
export const deleteImage = (id, url) =>
  api.delete(`/${id}/image`, {
    params: { url }
  });

export default api;