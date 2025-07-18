import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// ✅ Create Auth Context
const AuthContext = createContext();
export default AuthContext;

// ✅ AuthProvider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch authenticated user on load if token exists
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
          headers: { Authorization: `Token ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        console.warn("⚠️ User not logged in or token invalid:", err.response?.data || err.message);
        setUser(null);
      }
    };

    if (token) {
      fetchUser();
    }
  }, [token]);

  // ✅ Login with email + password
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/auth/token/login/', {
        email, // or use username depending on Djoser config
        password,
      });

      const authToken = res.data.auth_token;
      localStorage.setItem('token', authToken);
      setToken(authToken);

      // Fetch profile after login
      const profileRes = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
        headers: { Authorization: `Token ${authToken}` },
      });
      setUser(profileRes.data);

      return true;
    } catch (err) {
      console.error("❌ Login failed:", err.response?.data || err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ useAuth Hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
