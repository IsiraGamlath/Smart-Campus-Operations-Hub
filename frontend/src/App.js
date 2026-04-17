import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Components
import Layout from "./components/layout/Layout";

// Pages
import Dashboard from "./pages/Dashboard";
import CreateTicket from "./pages/CreateTicket";
import TicketDetails from "./pages/TicketDetails";

// Mock User for UI logic
const mockUser = {
  id: "user1",
  role: "ADMIN"
};

function AppContent() {
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1e293b',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      />
      
      <Routes>
        <Route path="/" element={<Layout user={mockUser}><Dashboard /></Layout>} />
        <Route path="/tickets" element={<Layout user={mockUser}><Dashboard /></Layout>} />
        <Route path="/create" element={<Layout user={mockUser}><CreateTicket /></Layout>} />
        <Route path="/tickets/:id" element={<Layout user={mockUser}><TicketDetails /></Layout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;