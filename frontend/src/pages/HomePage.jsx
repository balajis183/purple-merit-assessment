import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <div className="homepage-content">
        <h1>Welcome to GreenCart Logistics</h1>
        <p>
          The internal tool for managers to simulate delivery operations,
          analyze KPIs, and optimize for profit and efficiency.
        </p>
        <div className="homepage-actions">
          <Link to="/login" className="btn btn-primary">Login</Link>
          <Link to="/register" className="btn btn-secondary">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
