import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        token: action.payload.token,
        isAuthenticated: true
      };
    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false
      };
    case 'LOAD_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    token: null,
    isAuthenticated: false
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        dispatch({ type: 'LOAD_USER', payload: decoded });
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('token', userData.token);
    dispatch({ type: 'LOGIN', payload: userData });
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

