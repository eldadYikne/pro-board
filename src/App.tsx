import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import ConfirmedPlace from "./components/ConfirmedPlace";
import { BrowserRouter, Route, Link, Routes } from "react-router-dom";
import Map from "./components/Map";
import mongoose from "mongoose";

function App() {
  let cached = (global as any).mongoose;
  const MONGODB_URI =
    "mongodb+srv://reutyikne:iY9LJ5G5sD8xl5Ts@cluster0.cuxuy5g.mongodb.net/test";
  if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
  }
  useEffect(() => {
    async function fetchData() {
      await dbConnect();
    }
    fetchData();
  }, []);
  async function dbConnect() {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
    mongoose.set("strictQuery", false);
    await mongoose.connect(cached.conn);

    return cached.conn;
  }

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
