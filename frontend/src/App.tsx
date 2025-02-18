import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./components/Login";
import Calculator from "./components/Calculator";
import ThemeToggle from "./components/ThemeToggle";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const App: React.FC = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<{ name: string; picture: string } | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogin = (jwtToken: string, userData: { name: string; picture: string }) => {
    setToken(jwtToken);
    localStorage.setItem("token", jwtToken);
    setUser(userData);
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <div className={`min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 transition-all`}>
        <ThemeToggle theme={theme} setTheme={setTheme} />
        <div className="flex flex-col md:flex-row items-center justify-center min-h-screen">
          <Login onLogin={handleLogin} loggedIn={!!token} user={user} />
          <Calculator token={token} user={user} onLogout={handleLogout} />
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default App;