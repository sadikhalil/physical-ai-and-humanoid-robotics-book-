import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { useHistory } from '@docusaurus/router'; // Import useHistory for navigation

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [softwareBackground, setSoftwareBackground] = useState('');
  const [hardwareBackground, setHardwareBackground] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // --- Placeholder Registration Logic ---
    // In a real application, you would send this data to a backend server
    // for user registration. For this static site, we'll simulate success.
    if (username && password) { // Only check for username and password
      alert(`Registration successful for ${username}!
Software Background: ${softwareBackground || 'Not provided'}
Hardware Background: ${hardwareBackground || 'Not provided'}
Redirecting to book...`);
      history.push('/docs/Part 1 - Foundations/01-introduction'); // Redirect to the book introduction
    } else {
      setError('Please fill in username and password.'); // Updated error message
    }
  };

  return (
    <Layout title="Sign Up" description="Sign up to access the Physical AI & Humanoid Robotics book.">
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div style={{
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
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
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
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
