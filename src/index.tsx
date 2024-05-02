import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB0_l-bYxRBeKGR_t_jujHRRzQacqQcRXk",
  authDomain: "calaniot-159d1.firebaseapp.com",
  databaseURL: "https://calaniot-159d1-default-rtdb.firebaseio.com",
  projectId: "calaniot-159d1",
  storageBucket: "calaniot-159d1.appspot.com",
  messagingSenderId: "136983399478",
  appId: "1:136983399478:web:b331a7943d3c795ea01c97",
  measurementId: "G-RQP15RZNBH",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
