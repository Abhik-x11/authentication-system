import React from 'react';
import { calculatePasswordStrength } from '../utils/passwordStrength';
import './PasswordStrengthMeter.css';

/**
 * PasswordStrengthMeter Component
 * Fulfills Assignment 7 requirement: "Display Password strength"
 */
export default function PasswordStrengthMeter({ password }) {
  if (!password) {
    return (
      <div className="pwd-strength-container empty">
        <span className="pwd-prompt-text">Password strength will update as you type</span>
      </div>
    );
  }

  const strength = calculatePasswordStrength(password);

  return (
    <div className="pwd-strength-container">
      {/* Top Header: Label & Score */}
      <div className="pwd-strength-header">
        <span className="pwd-strength-title">Password Strength:</span>
        <span 
          className="pwd-strength-label"
          style={{ color: strength.color }}
        >
          {strength.label} ({strength.percentage}%)
        </span>
      </div>

      {/* 4-Segment Progress Bar */}
      <div className="pwd-segments-bar">
        {[1, 2, 3, 4].map((segmentIndex) => {
          const isActive = strength.score >= segmentIndex;
          return (
            <div
              key={segmentIndex}
              className={`pwd-segment ${isActive ? 'active' : ''}`}
              style={{
                backgroundColor: isActive ? strength.color : 'rgba(255, 255, 255, 0.1)'
              }}
            />
          );
        })}
      </div>

      {/* Helpful feedback tip */}
      <div className="pwd-feedback-text" style={{ color: strength.color }}>
        {strength.feedback}
      </div>

      {/* Visual Checklist */}
      <div className="pwd-checklist">
        <div className={`check-item ${strength.criteria.minLength ? 'valid' : 'pending'}`}>
          <span className="check-icon">{strength.criteria.minLength ? '✓' : '○'}</span>
          <span>8+ characters</span>
        </div>
        <div className={`check-item ${strength.criteria.hasUppercase ? 'valid' : 'pending'}`}>
          <span className="check-icon">{strength.criteria.hasUppercase ? '✓' : '○'}</span>
          <span>Uppercase (A-Z)</span>
        </div>
        <div className={`check-item ${strength.criteria.hasLowercase ? 'valid' : 'pending'}`}>
          <span className="check-icon">{strength.criteria.hasLowercase ? '✓' : '○'}</span>
          <span>Lowercase (a-z)</span>
        </div>
        <div className={`check-item ${strength.criteria.hasNumber ? 'valid' : 'pending'}`}>
          <span className="check-icon">{strength.criteria.hasNumber ? '✓' : '○'}</span>
          <span>Number (0-9)</span>
        </div>
        <div className={`check-item ${strength.criteria.hasSpecial ? 'valid' : 'pending'}`}>
          <span className="check-icon">{strength.criteria.hasSpecial ? '✓' : '○'}</span>
          <span>Special symbol (!@#$)</span>
        </div>
      </div>
    </div>
  );
}
