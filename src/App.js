import React from "react";
import { BrowserRouter as Router, Route, Switch, BrowserRouter, Routes } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
   </BrowserRouter>
  );
}

export default App;
