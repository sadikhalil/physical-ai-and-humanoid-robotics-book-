import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link'; // Assuming Link is useful for a profile page

const UserProfileIcon= () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    // Check immediately and add an event listener for storage changes
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  if (!isLoggedIn) {
    return null;
  }

  // Placeholder for a user profile icon
  return (
    <Link to="/profile" className="navbar__item navbar__link">
      <span style={{ marginLeft: '5px' }}>👤</span> {/* Generic profile icon */}
      {/* You could add more complex UI here, like a dropdown with user info */}
    </Link>
  );
};

export default UserProfileIcon;
