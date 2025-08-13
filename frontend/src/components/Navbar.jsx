import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/">GreenCart Logistics</Link>
      </div>
      
      <button className="hamburger-menu-button" onClick={toggleMenu}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div className={`navbar-nav ${isOpen ? 'nav-active' : ''}`}>
        <ul>
          <li><Link to="/" onClick={toggleMenu}>Dashboard</Link></li>
          <li><Link to="/history" onClick={toggleMenu}>History</Link></li>
          <li><Link to="/simulation" onClick={toggleMenu}>Simulation</Link></li>
          <li><Link to="/drivers" onClick={toggleMenu}>Drivers</Link></li>
          <li><Link to="/routes" onClick={toggleMenu}>Routes</Link></li>
          <li><Link to="/orders" onClick={toggleMenu}>Orders</Link></li>
          <li><Link to="/login" onClick={toggleMenu}>Login</Link></li>
          <li><Link to="/register" onClick={toggleMenu}>Register</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;