import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { FinancialRecordsProvider } from "./contexts/financial-record-context.tsx";

// Importing the Clerk publishable key from the environment variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Throwing an error if the publishable key is missing
if (!PUBLISHABLE_KEY) {
  throw new Error(
    "Missing Publishable Key. Please set the VITE_CLERK_PUBLISHABLE_KEY environment variable."
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <FinancialRecordsProvider>
        <App />
      </FinancialRecordsProvider>
    </ClerkProvider>
  </React.StrictMode>
);
