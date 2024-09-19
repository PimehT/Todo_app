import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileIcon from '../assets/user-solid.svg';
import { FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../Context/authContext';
import ResponseModal from '../Modal/ResponseModal';
import './ProfileDropdown.scss';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { logout, deleteUser } = useAuth();
  const navigate = useNavigate();

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    setIsOpen(false);
    setShowConfirmDialog(true);
  };

  const confirmDeleteAccount = () => {
    setShowConfirmDialog(false);
    deleteUser();
    navigate('/');
  };

  const onClose = () => {
    setShowConfirmDialog(false);
    setIsOpen(false);
  };

  return (
    <div className="profile-dropdown">
      <div className="icon profile-icon" onClick={toggleDropdown}>
        <img src={ProfileIcon} alt="profile icon" />
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={handleLogout} style={{ color: '#a6a6a6' }}>Sign Out
            <FaSignOutAlt style={{
              marginLeft: '5px',
              verticalAlign: 'middle',
              color: '#a6a6a6',
            }} /></button>
          <button
            style={{
              color: 'red',
            }}
            onClick={handleDeleteAccount}>
              Delete Account</button>
        </div>
      )}
      {showConfirmDialog && (
        <ResponseModal
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone."
          onConfirm={confirmDeleteAccount}
          onClose={onClose}
        />
      )}
    </div>
  );
};

export default ProfileDropdown;
