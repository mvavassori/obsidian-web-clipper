import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import OptionsApp from "./OptionsApp";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <OptionsApp />
  </React.StrictMode>
);

reportWebVitals();
