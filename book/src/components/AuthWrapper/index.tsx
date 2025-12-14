import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from '@docusaurus/router'; // For redirection and location
import UserProfileIcon from '@site/src/components/UserProfileIcon'; // Import the UserProfileIcon

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const history = useHistory();
  const location = useLocation(); // Get current location
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add isLoggedIn state

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedInStatus); // Update state

    if (!loggedInStatus) {
      history.push('/login'); // Redirect to login page if not logged in
    }
  }, [history]);

  useEffect(() => {
    // Save the last visited page whenever the route changes
    localStorage.setItem('lastVisitedPage', location.pathname);
  }, [location]); // Re-run effect when location changes

  return (
    <>
      {isLoggedIn && <UserProfileIcon />} {/* Conditionally render UserProfileIcon */}
      {children}
    </>
  );
};

export default AuthWrapper;
