import CONFIG from '../config.js';

const ENDPOINTS = {
  USER_SIGNUP: `${CONFIG.BASE_URL}/user/signup`,
  USER_LOGIN: `${CONFIG.BASE_URL}/user/login`,
  RESERVATION: `${CONFIG.BASE_URL}/reservation`,
  GET_KEY: `${CONFIG.BASE_URL}/get/key`,
  LIST_PROPERTIES: `${CONFIG.BASE_URL}/list/properties`,
};

// Helper function to handle API responses
async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }

  return data;
}

// Helper function to make API requests with proper headers
async function makeRequest(url, options = {}) {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  return handleResponse(response);
}

/**
 * User signup
 * @param {string} username - User's username
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response object
 */
export async function signup(username, email, password) {
  try {
    const response = await makeRequest(ENDPOINTS.USER_SIGNUP, {
      method: 'POST',
      body: JSON.stringify({
        user_name: username,
        email: email,
        password: password,
      }),
    });

    console.log(`Signup successful for username: ${username}`);
    return response;
  } catch (error) {
    console.error('Signup error:', error.message);
    throw error;
  }
}

/**
 * User login
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response object with messages
 */
export async function login(username, password) {
  try {
    const response = await makeRequest(ENDPOINTS.USER_LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        user_name: username,
        password: password,
      }),
    });

    if (response.status === "Login Success") {
      console.log(`Login successful for username: ${username}`);
      return response;
    } else {
      throw new Error(response.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

/**
 * Create a reservation
 * @param {number} userId - User ID
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @param {string} status - Reservation status
 * @returns {Promise<Object>} Response object
 */
export async function createReservation(userId, startDate, endDate, status) {
  try {
    const response = await makeRequest(ENDPOINTS.RESERVATION, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
        status: status,
      }),
    });

    console.log('Reservation created successfully');
    return response;
  } catch (error) {
    console.error('Reservation creation error:', error.message);
    throw error;
  }
}

/**
 * Get the current system key
 * @returns {Promise<Object>} Response object with key
 */
export async function getKey() {
  try {
    const response = await makeRequest(ENDPOINTS.GET_KEY, {
      method: 'GET',
    });

    if (response.status === "Success") {
      console.log('Key retrieved successfully');
      return response.key;
    } else {
      throw new Error(response.error || 'Failed to get key');
    }
  } catch (error) {
    console.error('Get key error:', error.message);
    throw error;
  }
}

/**
 * Get list of all properties
 * @returns {Promise<Array>} Array of properties
 */
export async function getProperties() {
  try {
    const response = await makeRequest(ENDPOINTS.LIST_PROPERTIES, {
      method: 'GET',
    });

    if (response.status === "Success") {
      console.log('Properties retrieved successfully');
      return response.list;
    } else {
      throw new Error(response.error || 'Failed to get properties');
    }
  } catch (error) {
    console.error('Get properties error:', error.message);
    throw error;
  }
}

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid format
 */
export function validateDateFormat(dateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return false;
  }

  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Legacy function for backward compatibility
export async function getData() {
  console.warn('getData() is deprecated. Use specific API functions instead.');
  return await getProperties();
}