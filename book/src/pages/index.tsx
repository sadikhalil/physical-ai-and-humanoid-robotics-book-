import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { useEffect } from 'react';
import { useHistory } from '@docusaurus/router';

import styles from './index.module.css';

// Placeholder function to check login status
const checkLoginStatus = () => {
  // In a real application, you'd check for a valid token in localStorage,
  // or make an API call to validate the session.
  return localStorage.getItem('userToken') ? true : false;
};

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  const history = useHistory(); // Initialize useHistory

  const handleStartReading = () => {
    if (checkLoginStatus()) {
      history.push('/docs/Part 1 - Foundations/introduction'); // Navigate to the book
    } else {
      history.push('/login'); // Redirect to login page
    }
  };

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          Welcome to {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">Your journey into Physical AI and Humanoid Robotics begins here.</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/login"
            style={{ marginRight: '10px' }}>
            Login
          </Link>
          <Link
            className="button button--secondary button--lg"
            to="/signup"
            style={{ marginRight: '10px' }}>
            Sign Up
          </Link>
          {/* New "Start Reading" button */}
          <button
            className="button button--secondary button--lg"
            onClick={handleStartReading}>
            Start Reading
          </button>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  // Removed the useEffect hook that redirected to login automatically
  // const history = useHistory(); // Not needed here anymore for auto-redirect

  return (
    <Layout
      title={`Welcome to ${siteConfig.title}`}
      description="Your journey into Physical AI and Humanoid Robotics begins here.">
      <HomepageHeader />
      <main>
        {/* <HomepageFeatures /> */}
      </main>
    </Layout>
  );
}
