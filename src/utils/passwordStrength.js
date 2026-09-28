/**
 * Password Strength Calculation Utility
 * Fulfills Assignment 7 requirement: "Display Password strength"
 */

export function calculatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return {
      score: 0,
      percentage: 0,
      label: 'None',
      level: 'none',
      color: '#64748b',
      feedback: 'Enter a password to evaluate strength',
      criteria: {
        minLength: false,
        hasLowercase: false,
        hasUppercase: false,
        hasNumber: false,
        hasSpecial: false
      }
    };
  }

  const criteria = {
    minLength: password.length >= 8,
    hasLowercase: /[a-z]/.test(password),
    hasUppercase: /[A-Z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password)
  };

  let score = 0;
  if (password.length >= 6) score += 1;
  if (criteria.minLength) score += 1;
  if (criteria.hasLowercase && criteria.hasUppercase) score += 1;
  if (criteria.hasNumber) score += 1;
  if (criteria.hasSpecial) score += 1;

  // Additional bonus for longer passwords
  if (password.length >= 12 && score >= 4) {
    score = 5;
  }

  // Normalize score between 1 and 4 for display levels
  if (score <= 1) {
    return {
      score: 1,
      percentage: 25,
      label: 'Weak',
      level: 'weak',
      color: '#ef4444',
      feedback: 'Weak: Add numbers, uppercase letters & special characters',
      criteria
    };
  } else if (score === 2) {
    return {
      score: 2,
      percentage: 50,
      label: 'Fair',
      level: 'fair',
      color: '#f97316',
      feedback: 'Fair: Try using symbols or make it longer than 8 characters',
      criteria
    };
  } else if (score === 3 || score === 4) {
    return {
      score: 3,
      percentage: 75,
      label: 'Good',
      level: 'good',
      color: '#eab308',
      feedback: 'Good: Strong password, almost optimal',
      criteria
    };
  } else {
    return {
      score: 4,
      percentage: 100,
      label: 'Strong',
      level: 'strong',
      color: '#10b981',
      feedback: 'Excellent: Highly secure password combination',
      criteria
    };
  }
}
