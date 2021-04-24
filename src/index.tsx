import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import SocketProvider from "./context/Socket";
import WebRTCProvider from "./context/WebRTC";
import reportWebVitals from "./reportWebVitals";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <SocketProvider>
      <WebRTCProvider>
        <App />
      </WebRTCProvider>
    </SocketProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
