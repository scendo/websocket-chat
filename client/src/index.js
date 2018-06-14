import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(
  <App env={process.env.NODE_ENV} apiUrl={process.env.REACT_APP_API_URL} />,
  document.getElementById("root")
);
registerServiceWorker();
