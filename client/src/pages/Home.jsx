
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-box">
        <h1>Welcome to 💰 Expense Tracker</h1>
        <p>Track, manage, and analyze your expenses easily and effectively.</p>
        <p>Organize your finances with visual insights, category breakdowns, and simple reports.</p>
        <div className="cta-buttons">
            <Link to="/login">Login</Link>
            <Link to="/about">Login</Link>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
