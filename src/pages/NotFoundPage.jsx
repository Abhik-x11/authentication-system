import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '50px 24px',
        maxWidth: '500px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px'
      }}>
        <span style={{ fontSize: '3.5rem' }}>🧭</span>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>404 - Page Not Found</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.5' }}>
          The URL route you followed does not exist within the TaskFlow single-page application.
        </p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '8px' }}>
          &larr; Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
