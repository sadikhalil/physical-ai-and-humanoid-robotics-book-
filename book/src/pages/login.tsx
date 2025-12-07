import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router'; // Import useHistory for navigation

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch('http://localhost:8000/login', { // Assuming backend runs on 8000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        localStorage.setItem('isLoggedIn', 'true'); // Store login status
        alert('Login successful! Redirecting to book...');
        history.push('/docs/Part 1 - Foundations/introduction'); // Redirect to the book introduction
      } else {
        setError(data.detail || 'Login failed.');
      }
    } catch (err) {
      setError('Network error or server unavailable.');
      console.error('Login error:', err);
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
      history.push('/docs/Part 1 - Foundations/introduction');
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
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
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
