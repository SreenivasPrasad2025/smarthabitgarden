import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { access_token } = response.data;


      // Store token
      localStorage.setItem("access_token", access_token);

      // Fetch user info
      const userResponse = await api.get("/auth/me");
      const userData = userResponse.data;

      // Store user data
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || "Login failed";
      return { success: false, error: message };
    }
  };

  const signup = async (email, password, full_name) => {
    try {
      await api.post("/auth/signup", { email, password, full_name });

      // Auto-login after signup
      return await login(email, password);
    } catch (error) {
      const message = error.response?.data?.detail || "Signup failed";
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const forgotPassword = async (email) => {
    try {
      await api.post("/auth/forgot-password", { email });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to send reset email";
      return { success: false, error: message };
    }
  };

  const resetPassword = async (token, new_password) => {
    try {
      await api.post("/auth/reset-password", { token, new_password });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.detail || "Failed to reset password";
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
