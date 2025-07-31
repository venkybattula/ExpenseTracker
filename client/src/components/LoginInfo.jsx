// src/components/LoginInfo.jsx
import React, { useEffect, useState } from 'react';
import './LoginInfo.css'; // optional styling

const LoginInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return null; // or a loader

  return (
    <div className="login-info-box">
      <h3>👤 Logged In User</h3>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default LoginInfo;
