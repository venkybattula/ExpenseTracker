
import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="welcome-box">
        <h1>Welcome to 💰 Expense Tracker</h1>
        <p>Track, manage, and analyze your expenses easily and effectively.</p>
        <p>Organize your finances with visual insights, category breakdowns, and simple reports.</p>
        <div className="cta-buttons">
          <a href="/login">Get Started</a>
          <a href="/about">Learn More</a>
        </div>
      </div>
    </div>
  );
};

export default Home;
