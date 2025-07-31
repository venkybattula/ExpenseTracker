import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

const ProfileDropdown = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  const toggleDropdown = () => setOpen(!open);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    onLogout();            // clears localStorage
    navigate('/');         // navigate to home after logout
  };

  return (
    <div className="profile-box" ref={dropdownRef}>
      <div className="profile-avatar" onClick={toggleDropdown}>
        {user?.name?.charAt(0).toUpperCase() || 'U'}
      </div>

      {open && (
        <div className="profile-dropdown-modern">
          <div className="profile-header">
            <div className="profile-circle">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
            <div className="profile-info-text">
              <h4>{user?.name || 'User'}</h4>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
