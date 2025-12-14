// src/components/UserProfile.tsx
import React, { useState, useEffect } from 'react';

const UserProfile: React.FC = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const updateProfileState = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      setUserName(localStorage.getItem('userName'));
      setUserEmail(localStorage.getItem('userEmail'));
    };

    // Update state initially
    updateProfileState();

    // Listen for changes in localStorage
    window.addEventListener('storage', updateProfileState);

    return () => {
      window.removeEventListener('storage', updateProfileState);
    };
  }, []);

  if (!isLoggedIn || !userName || !userEmail) {
    return null; // Hide if not logged in or data is missing
  }

  return (
    <div style={{
      padding: '10px',
      margin: '10px 0',
      border: '1px solid var(--ifm-color-emphasis-300)',
      borderRadius: '5px',
      backgroundColor: 'var(--ifm-background-color)',
      color: 'var(--ifm-font-color-base)',
      fontSize: '0.9em',
      maxWidth: '300px' // Example styling
    }}>
      <strong>User Profile:</strong>
      <p style={{ margin: '5px 0 0 0' }}>Name: {userName}</p>
      <p style={{ margin: '0' }}>Email: {userEmail}</p>
    </div>
  );
};

export default UserProfile;
