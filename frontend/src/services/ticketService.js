import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8081";
const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
});

export const getTickets = () => http.get("/api/tickets");
export const getTicketById = (id) => http.get(`/api/tickets/${id}`);
export const createTicket = (ticket) => http.post("/api/tickets", ticket);
export const updateTicket = (id, ticket) => http.put(`/api/tickets/${id}`, ticket);
export const deleteTicket = (id) => http.delete(`/api/tickets/${id}`);
