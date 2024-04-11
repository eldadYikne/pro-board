import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import ConfirmedPlace from "./components/ConfirmedPlace";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import Map from "./components/Map";
function App() {
  return (
    <div dir="rtl" className="">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<ConfirmedPlace />} />
          <Route path="map" element={<Map />} />
        </Routes>

        {/* <header className="flex bg-red-800 App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
