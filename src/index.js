import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import history from "./utils/history";
import "./index.css";
import "daterangepicker";
import "daterangepicker/daterangepicker.css";
import App from "./App";
import { Provider as AuthProvider } from "../src/context/AuthContext";
import { Provider as CampaignProvider } from "../src/context/CampaignContext";
import { Provider as AdvertiserProvider } from "../src/context/AdvertiserContext";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <AdvertiserProvider>
        <CampaignProvider>
          <Router history={history}>
            <App />
          </Router>
        </CampaignProvider>
      </AdvertiserProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
