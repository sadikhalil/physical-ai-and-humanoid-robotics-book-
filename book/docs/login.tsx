import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router'; // Import useHistory for navigation

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gmail, setGmail] = useState(''); // New state for Gmail
  const [rememberMe, setRememberMe] = useState(false);

  const [error, setError] = useState<string | string[] | null>(null); // Error can be string or array of strings
  const history = useHistory();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    // Placeholder authentication: hardcoded username and password
    if (username === 'admin' && password === 'password') {
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
      localStorage.setItem('isLoggedIn', 'true'); // Store login status
      alert('Login successful!');

      const lastVisitedPage = localStorage.getItem('lastVisitedPage');
      if (lastVisitedPage) {
        history.push(lastVisitedPage); // Redirect to the last visited page
      } else {
        history.push('/dashboard'); // Default redirect to dashboard
      }
    } else {
      setError('Invalid username or password.');
    }
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }

    // Check if user is already logged in
    const loggedIn = localStorage.getItem('isLoggedIn');
    if (loggedIn === 'true') {
      history.push('/dashboard'); // Redirect to dashboard if already logged in
    }
  }, [history]);

  return (
    <Layout title="Login" description="Login to access the Physical AI & Humanoid Robotics book.">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(252, 242, 242, 0.1)',
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'var(--ifm-background-color)',
        }}>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem' }}>Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="gmail" style={{ display: 'block', marginBottom: '0.5rem' }}>Gmail:</label>
              <input
                type="email" // Use type="email" for better input validation
                id="gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required // Making it required as per user's request to "ask user for gmail"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <label htmlFor="rememberMe">Remember Me</label>
            </div>

            {error && (Array.isArray(error) ? (
              <ul style={{ color: 'red', marginBottom: '1rem', paddingLeft: '20px' }}>
                {error.map((msg, index) => <li key={index}>{msg}</li>)}
              </ul>
            ) : (
              <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
            ))}
            <button
              type="submit"
              className="button button--primary button--lg"
              style={{ width: '100%' }}
            >
              Login
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default LoginPage;
