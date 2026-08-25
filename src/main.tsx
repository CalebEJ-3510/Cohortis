import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";
import { getRouter } from "./router";

const router = getRouter();

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found. Check your index.html.");
}

ReactDOM.createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
