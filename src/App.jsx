import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position={isMobile ? "bottom-center" : "top-right"}
          containerClassName={isMobile ? "app-toaster-mobile" : ""}
          toastOptions={{
            className: isMobile ? "app-toast-mobile" : "",
            duration: 4000,
            style: isMobile
              ? {
                  borderRadius: "24px",
                  background: "#202124",
                  color: "#f8f9fa",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  padding: "10px 20px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  letterSpacing: "0.01em",
                }
              : {
                  borderRadius: "12px",
                  background: "var(--bg-card)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-subtle)",
                  padding: "12px 16px",
                },
            success: isMobile
              ? {
                  iconTheme: {
                    primary: "#81c995",
                    secondary: "#202124",
                  },
                }
              : {},
            error: isMobile
              ? {
                  iconTheme: {
                    primary: "#f28b82",
                    secondary: "#202124",
                  },
                }
              : {},
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
