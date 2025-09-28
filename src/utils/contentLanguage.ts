/**
 * Content language utilities for mode-specific messaging
 */

export const getStatusMessage = (
  type: 'feeding' | 'sleep' | 'general',
  metric: string | number,
  isDarkMode: boolean
) => {
  if (isDarkMode) {
    // Dark Mode: hard metrics, direct language
    switch (type) {
      case 'feeding':
        return `Feeds every ${metric}h`;
      case 'sleep':
        return `Median wake window ${metric}`;
      default:
        return `${metric}`;
    }
  } else {
    // Light Mode: softer, reassuring language
    switch (type) {
      case 'feeding':
        return `Looking consistent with feeding every ${metric}h`;
      case 'sleep':
        return `On track with wake windows around ${metric}`;
      default:
        return `Looking good - ${metric}`;
    }
  }
};

export const getConfidenceMessage = (
  confidence: 'high' | 'medium' | 'low',
  isDarkMode: boolean
) => {
  if (isDarkMode) {
    return `${confidence.toUpperCase()} confidence`;
  } else {
    switch (confidence) {
      case 'high':
        return 'Very consistent';
      case 'medium':
        return 'On track';
      case 'low':
        return 'Building pattern';
      default:
        return 'Tracking';
    }
  }
};

export const getErrorMessage = (
  severity: 'warning' | 'error',
  message: string,
  isDarkMode: boolean
) => {
  if (isDarkMode) {
    return message; // Direct message
  } else {
    // Softer language for light mode
    if (severity === 'warning') {
      return `Just a heads up: ${message.toLowerCase()}`;
    }
    return `Let's check: ${message.toLowerCase()}`;
  }
};