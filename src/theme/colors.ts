import { commonColors } from './commonColors';
import { IColors } from './theme.types';

/**
 * Light theme colors for FinTrack
 * Based on wireframes color palette
 * Uses commonColors for base colors (white, black)
 */
export const lightThemeColors: IColors = {
  // Accent colors
  accent: {
    dark: '#505160',
    medium: '#68829e',
    light: '#aebd38',
    green: '#598234',
    // Background variants
    darkBg: '#f0f1f3',
    mediumBg: '#e8ecf1',
    lightBg: '#f5f7e8',
    greenBg: '#e8f0e4',
    // Text variants
    darkText: '#2d2f36',
    mediumText: '#3d4a5c',
    lightText: '#6b7a1c',
    greenText: '#3a5622',
    // Hover states
    darkHover: '#3d3f4a',
    mediumHover: '#556a85',
    lightHover: '#8f9a2d',
    greenHover: '#4a6b2a',
  },
  // Category colors - Expenses
  category: {
    groceries: '#4CAF50',
    transport: '#2196F3',
    entertainment: '#9C27B0',
    restaurants: '#FF9800',
    health: '#F44336',
    clothing: '#E91E63',
    home: '#795548',
    communication: '#00BCD4',
    subscriptions: '#673AB7',
    other: '#607D8B',
    // Category backgrounds
    groceriesBg: '#e8f5e9',
    transportBg: '#e3f2fd',
    entertainmentBg: '#f3e5f5',
    restaurantsBg: '#fff3e0',
    healthBg: '#ffebee',
    clothingBg: '#fce4ec',
    homeBg: '#efebe9',
    communicationBg: '#e0f7fa',
    subscriptionsBg: '#ede7f6',
    otherBg: '#eceff1',
    // Income categories
    salary: '#4CAF50',
    freelance: '#2196F3',
    gifts: '#E91E63',
    incomeOther: '#607D8B',
  },
  // Neutral colors
  background: {
    primary: '#f8f9fa',
    secondary: '#ffffff',
    tertiary: '#f0f1f3',
    body: '#e9ecef',
  },
  text: {
    primary: '#1a1c21',
    secondary: '#5a5d66',
    tertiary: '#8a8d95',
  },
  border: {
    color: '#e1e3e8',
    divider: '#e8eaed',
  },
  // Status colors
  status: {
    success: '#598234',
    successBg: '#e8f0e4',
    successBorder: '#598234',
    successText: '#3a5622',
    warning: '#aebd38',
    warningBg: '#f5f7e8',
    warningBorder: '#aebd38',
    warningText: '#6b7a1c',
    warningLight: '#c4d12a',
    error: '#d32f2f',
    errorBg: '#ffebee',
    errorBorder: '#d32f2f',
    errorText: '#b71c1c',
    errorLight: '#f44336',
    errorHover: '#c62828',
    info: '#68829e',
    infoBg: '#e8ecf1',
    infoBorder: '#68829e',
    infoText: '#3d4a5c',
  },
  // Base colors (using commonColors for consistency)
  white: commonColors.white,
  black: commonColors.black,
  shadow: commonColors.shadow,
  // UI elements
  toggleInactive: '#cccccc',
} as const;
