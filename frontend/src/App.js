import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login.js";
import Idea from "./pages/Idea";
import "bootstrap/dist/css/bootstrap.min.css";
import UserContext from "./UserContext";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/idea" element={<Idea />} />
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
