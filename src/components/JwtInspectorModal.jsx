import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { decodeSimulatedJWT, isTokenExpired } from '../utils/jwtHelper';
import './JwtInspectorModal.css';

export default function JwtInspectorModal() {
  const { isJwtModalOpen, closeJwtModal, token, storageType, rememberUser } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!isJwtModalOpen) return null;

  const decoded = token ? decodeSimulatedJWT(token) : null;
  const expired = token ? isTokenExpired(token) : false;

  const handleCopyToken = () => {
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTimestamp = (ts) => {
    if (!ts) return 'N/A';
    return new Date(ts * 1000).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
  };

  return (
    <div className="jwt-modal-backdrop" onClick={closeJwtModal}>
      <div className="jwt-modal-card" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="jwt-modal-header">
          <div className="jwt-title-wrap">
            <span className="jwt-icon-pill">🔑 JWT Simulation</span>
            <h2 className="jwt-modal-title">Live JWT Token Inspector</h2>
          </div>
          <button className="jwt-close-btn" onClick={closeJwtModal} title="Close Inspector">
            ✕
          </button>
        </div>

        <p className="jwt-modal-desc">
          Assignment 7 Requirement: Realistic 3-part JSON Web Token (Header.Payload.Signature) generated upon login and persisted according to the <strong>Remember User</strong> preference.
        </p>

        {/* Storage & Expiry Badges */}
        <div className="jwt-meta-bar">
          <div className="jwt-meta-item">
            <span className="jwt-meta-label">Storage Location:</span>
            <span className={`badge ${rememberUser ? 'badge-primary' : 'badge-neutral'}`}>
              💾 {storageType === 'localStorage' ? 'localStorage (Remember User: ON)' : 'sessionStorage (Remember User: OFF)'}
            </span>
          </div>

          <div className="jwt-meta-item">
            <span className="jwt-meta-label">Token Status:</span>
            <span className={`badge ${expired ? 'badge-danger' : 'badge-success'}`}>
              {expired ? '⛔ Expired' : '✅ Active & Verified'}
            </span>
          </div>
        </div>

        {/* Encoded 3-Part Token */}
        <div className="jwt-section">
          <div className="jwt-section-header">
            <span className="jwt-section-title">Raw Encoded Simulated Token</span>
            <button className="btn btn-secondary btn-sm copy-btn" onClick={handleCopyToken}>
              {copied ? '✓ Copied!' : '📋 Copy Token'}
            </button>
          </div>

          {decoded ? (
            <div className="jwt-token-box">
              <span className="jwt-part-header" title="Header: Algorithm & Token Type">{decoded.rawParts.header}</span>
              <span className="jwt-dot">.</span>
              <span className="jwt-part-payload" title="Payload: User Claims & Expiry">{decoded.rawParts.payload}</span>
              <span className="jwt-dot">.</span>
              <span className="jwt-part-signature" title="Signature: HMAC Verification Hash">{decoded.rawParts.signature}</span>
            </div>
          ) : (
            <div className="jwt-empty-notice">No active token found. Please log in first.</div>
          )}

          <div className="jwt-legend">
            <span className="legend-item"><span className="legend-dot dot-header"></span> Header (HS256)</span>
            <span className="legend-item"><span className="legend-dot dot-payload"></span> Payload (Claims &amp; Expiry)</span>
            <span className="legend-item"><span className="legend-dot dot-signature"></span> Simulated Signature</span>
          </div>
        </div>

        {/* Decoded Header and Payload Grids */}
        {decoded && (
          <div className="jwt-decoded-grid">
            {/* Decoded Header */}
            <div className="jwt-decoded-card">
              <div className="card-header-bar header-type">
                <span>HEADER: Algorithm &amp; Token Type</span>
              </div>
              <pre className="jwt-json-code">
                {JSON.stringify(decoded.header, null, 2)}
              </pre>
            </div>

            {/* Decoded Payload */}
            <div className="jwt-decoded-card">
              <div className="card-header-bar payload-type">
                <span>PAYLOAD: User Claims &amp; Timestamps</span>
              </div>
              <pre className="jwt-json-code">
                {JSON.stringify(decoded.payload, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Human Friendly Summary */}
        {decoded?.payload && (
          <div className="jwt-human-summary">
            <div className="summary-col">
              <span className="summary-label">Subject / Username:</span>
              <span className="summary-val">{decoded.payload.sub}</span>
            </div>
            <div className="summary-col">
              <span className="summary-label">Issued At (iat):</span>
              <span className="summary-val">{formatTimestamp(decoded.payload.iat)}</span>
            </div>
            <div className="summary-col">
              <span className="summary-label">Expires (exp):</span>
              <span className="summary-val">{formatTimestamp(decoded.payload.exp)}</span>
            </div>
          </div>
        )}

        <div className="jwt-modal-footer">
          <button className="btn btn-secondary" onClick={closeJwtModal}>
            Close Inspector
          </button>
        </div>

      </div>
    </div>
  );
}
