
import React, { useState } from 'react';
import axios from 'axios';
import './Register.css'; // Make sure this CSS has the updated styles

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!emailRegex.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!passwordRegex.test(form.password)) {
      setError('Password must contain at least 8 characters, including uppercase, lowercase, number, and special character');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const { name, email, password } = form;
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      setSuccess(res.data.message || 'Registration successful!');
      setForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-card">
        <h2>Create Account</h2>
        <p>Join and manage your expenses smartly</p>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">📧</span>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit">Sign Up</button>
        </form>

        {success && <p style={{ color: 'green' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p className="login-redirect">
          Already have an account? <a href="/Login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
