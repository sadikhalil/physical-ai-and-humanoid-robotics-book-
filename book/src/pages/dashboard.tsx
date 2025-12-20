import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

function Dashboard() {
  return (
    <Layout title="Dashboard" description="User dashboard for Physical AI & Humanoid Robotics book.">
      <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', minHeight: '60vh' }}>
        <h1>Welcome to your Dashboard!</h1>
        <p>You have successfully logged in or signed up.</p>
        <div style={{ marginTop: '2rem' }}>
          <Link
            className="button button--primary button--lg"
            to="/Part 1 - Foundations/introduction">
            Start Reading the Book
          </Link>
        </div>
      </main>
    </Layout>
  );
}

export default Dashboard;