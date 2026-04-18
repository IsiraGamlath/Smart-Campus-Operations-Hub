import axios from "axios";

const API = "http://localhost:8080/api/tickets";

const api = axios.create({
  baseURL: API,
  withCredentials: true,
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
  const fileList = Array.isArray(files) ? files : [files];
  const uploads = fileList.map((file) => {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(`/${id}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  });

  return Promise.all(uploads);
};

// DELETE IMAGE
export const deleteImage = (id, url) =>
  api.delete(`/${id}/image`, {
    params: { url }
  });

export default api;