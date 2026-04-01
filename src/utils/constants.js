// NoBroker Frontend Constants — Kavi's file

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://no-broker-1tni.onrender.com/api';

export const PROPERTY_TYPES = {
  RENT: 'RENT',
  SALE: 'SALE',
};

export const PROPERTY_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DELETED: 'DELETED',
};

export const BOOKING_TYPES = {
  VISIT: 'VISIT',
  INTEREST: 'INTEREST',
};

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
};

export const AUTH_PROVIDERS = {
  LOCAL: 'LOCAL',
  GOOGLE: 'GOOGLE',
};

// Google OAuth Client ID — replace with your actual client ID
export const GOOGLE_CLIENT_ID = '836557111295-a984mb35lr1516fjj4hv6964pu8sa81c.apps.googleusercontent.com';

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 12;

// Price range defaults
export const PRICE_RANGES = {
  RENT: { min: 0, max: 500000, step: 1000 },
  SALE: { min: 0, max: 100000000, step: 100000 },
};

// Indian cities for filter
export const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Hyderabad',
  'Pune',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Coimbatore',
  'Kochi',
  'Chandigarh',
  'Noida',
  'Gurgaon',
];

// Bedroom options
export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];

// Password validation regex
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

export const PASSWORD_RULES =
  'Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special character (@#$%^&+=!)';
