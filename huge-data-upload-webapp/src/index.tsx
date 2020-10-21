import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

declare global {
  interface Window {
    webkitRequestFileSystem: any;
    TEMPORARY: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
