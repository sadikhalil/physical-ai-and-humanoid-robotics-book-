import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import { useEffect } from 'react'; // Import useEffect
import { useHistory } from '@docusaurus/router'; // Import useHistory

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
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
            to="/signup">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  const history = useHistory(); // Initialize useHistory

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn !== 'true') {
      history.push('/login'); // Redirect to login page if not logged in
    }
  }, [history]);

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
