import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./core/style/global.css";

import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/home-page.jsx";
import EventListPage from "./pages/event/event-list-page.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/event" element={<EventListPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
