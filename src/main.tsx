import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { PorodomoProvider } from "./features/porodomo/context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PorodomoProvider>
      <App />
    </PorodomoProvider>
  </React.StrictMode>,
);
