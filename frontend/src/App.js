import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import TicketPage from "./pages/TicketPage";
import TicketDetails from "./pages/TicketDetails";
import CreateTicket from "./pages/CreateTicket";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<TicketPage />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
