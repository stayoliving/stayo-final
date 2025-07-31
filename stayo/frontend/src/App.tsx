import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/homePage/HomePage";
import Header from "./components/common/Header";
import RoomList from "./components/RoomList/RoomList";
import "./App.css";

import Sidebar from "./components/Sidebar/Sidebar";

const App: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  return (
    <Router>
      <Header onOpenSidebar={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-page-container ">
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/about" element={<div>About Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/room-list" element={<RoomList onOpenSidebar={() => setSidebarOpen(true)} />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
