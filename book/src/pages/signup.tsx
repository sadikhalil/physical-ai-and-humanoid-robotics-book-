import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router'; // Import useHistory for navigation

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gmail, setGmail] = useState(''); // New state for Gmail
  const [softwareBackground, setSoftwareBackground] = useState('');
  const [hardwareBackground, setHardwareBackground] = useState('');
  const [error, setError] = useState<string | string[] | null>(null); // Error can be string or array of strings
  const history = useHistory();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/register', { // Assuming backend runs on 8000
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          confirm_password: confirmPassword,
          gmail, // Include gmail in the payload
          software_background: softwareBackground,
          hardware_background: hardwareBackground,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registration successful! Redirecting to dashboard...');
        // Save user profile data on first signup only
        if (localStorage.getItem('hasProfile') !== 'true') {
          localStorage.setItem('userName', username);
          localStorage.setItem('userEmail', gmail);
          localStorage.setItem('hasProfile', 'true');
          localStorage.setItem('isLoggedIn', 'true'); // Ensure isLoggedIn is also set for new users
        }
        history.push('/dashboard'); // Redirect to dashboard
      } else if (response.status === 422) {
        // Handle validation errors from FastAPI
        if (data.detail && Array.isArray(data.detail)) {
          const validationErrors = data.detail.map((err: any) => {
            const field = err.loc && err.loc.length > 1 ? err.loc[1] : 'Unknown field';
            return `${field}: ${err.msg}`;
          });
          setError(validationErrors);
        } else {
          setError(data.detail || 'Validation failed.');
        }
      } else {
        setError(data.detail || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error or server unavailable.');
      console.error('Registration error:', err);
    }
  };

  return (
    <Layout title="Sign Up" description="Sign up to access the Physical AI & Humanoid Robotics book.">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(238, 227, 227, 0.1)',
          maxWidth: '400px',
          width: '100%',
          backgroundColor: 'var(--ifm-background-color)',
        }}>
          <h1>Sign Up</h1>
          <form onSubmit={handleSignup}>
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
                type="email"
                id="gmail"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
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
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="confirmPassword" style={{ display: 'block', marginBottom: '0.5rem' }}>Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                required
              />
            </div>
            {/* New fields for background information */}
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="softwareBackground" style={{ display: 'block', marginBottom: '0.5rem' }}>Software Background (Optional):</label>
              <textarea
                id="softwareBackground"
                value={softwareBackground}
                onChange={(e) => setSoftwareBackground(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                placeholder="e.g., Proficient in Python, C++; experience with ROS, TensorFlow."
                // Removed required attribute
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label htmlFor="hardwareBackground" style={{ display: 'block', marginBottom: '0.5rem' }}>Hardware Background (Optional):</label>
              <textarea
                id="hardwareBackground"
                value={hardwareBackground}
                onChange={(e) => setHardwareBackground(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }}
                placeholder="e.g., Familiar with Arduino, Raspberry Pi; experience assembling robot kits, soldering."
                // Removed required attribute
              />
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
              Sign Up
            </button>
          </form>
          <p style={{ marginTop: '1rem', textAlign: 'center' }}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </main>
    </Layout>
  );
}

export default SignupPage;
