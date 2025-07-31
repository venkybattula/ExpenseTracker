
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-box">
        <h1>About 💰 Expense Tracker</h1>
        <p>
          Expense Tracker is a modern web application designed to help individuals manage their finances easily and efficiently.
        </p>
        <p>
          Whether you're budgeting monthly expenses, tracking purchases, or analyzing spending habits, our platform provides powerful tools to stay on top of your finances.
        </p>
        <h2>✨ Key Features:</h2>
        <ul>
          <li>✅ Simple and intuitive interface</li>
          <li>📊 Real-time charts and data visualization</li>
          <li>🧾 Categorized transaction management</li>
          <li>📆 Filter and analyze by date or category</li>
          <li>🔒 Secure authentication and user data</li>
        </ul>
        <p className="footer-note">Start tracking your money today and take control of your financial journey!</p>
      </div>
    </div>
  );
};

export default About;
