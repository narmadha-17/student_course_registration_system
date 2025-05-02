import React from "react";
import ReactDOM from "react-dom/client"; // Use React 18's new API
import App from "./App"; // Ensure correct App import
import "./styles/tailwind.css"; // Import global styles


const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root container not found! Check index.html");
} else {
  const root = ReactDOM.createRoot(rootElement); // Create root
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
