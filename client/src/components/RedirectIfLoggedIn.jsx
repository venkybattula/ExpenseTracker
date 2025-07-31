// src/components/RedirectIfLoggedIn.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectIfLoggedIn = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/add-expense" replace /> : children;
};

export default RedirectIfLoggedIn;
