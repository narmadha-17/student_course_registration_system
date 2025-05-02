import React, { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const storedRole = localStorage.getItem("role");
    
    if (storedAuth && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    }
  }, []);
  const login = (userRole) => {
    setIsAuthenticated(true);
    setRole(userRole);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("role", userRole);
  };
  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    localStorage.removeItem("authToken"); 
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("role");
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);