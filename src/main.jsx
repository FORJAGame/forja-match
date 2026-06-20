import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App.jsx";
import { preloadForjaAssets, registerAssetCache } from "./services/assetCache";

if (import.meta.env.PROD) {
  registerAssetCache();
} else {
  preloadForjaAssets();
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
