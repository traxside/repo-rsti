import CONFIG from '../config';

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/user/login`,
  SIGNUP: `${CONFIG.BASE_URL}/user/signup`,
  GET_KEY: `${CONFIG.BASE_URL}/get/key`,
  PROPERTIES: `${CONFIG.BASE_URL}/list/properties`,
  RESERVATION: `${CONFIG.BASE_URL}/reservation`,
  LIST_RESERVATION: `${CONFIG.BASE_URL}/list/reservation`,
};

// Helper function for API requests
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    // Your backend returns status in the response body, not HTTP status
    // Don't throw error based on response.ok, let each function handle the status
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Authentication Functions
export async function login(username, password) {
  try {
    const response = await apiRequest(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        user_name: username,
        password: password
      })
    });

    console.log('From api :', response);
    if (response.status === 'Success') {
      // Store user session data with more complete information
      const userData = {
        user_name: username,
        user_id: response.user_id, // Store user ID if provided by backend
        email: response.email, // Store email if provided
        messages: response.messages || []
      };

      setCurrentUser(userData);

      console.log(`Login successful for username: ${username}`);
      return {
        success: true,
        data: response,
        messages: response.messages || []
      };
    } else {
      console.log(`Login failed: ${response.error}`);
      return {
        success: false,
        error: response.error
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function signup(username, email, password) {
  try {
    const response = await apiRequest(ENDPOINTS.SIGNUP, {
      method: 'POST',
      body: JSON.stringify({
        user_name: username,
        email: email,
        password: password
      })
    });

    console.log('From api :', response);

    if (response[0].status === 'Success') {
      console.log(`Signup successful for username: ${username}, email: ${email}`);
      return {
        success: true,
        data: response
      };
    } else {
      console.log(`Signup failed: ${response.error}`);
      return {
        success: false,
        error: response.error
      };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export function logout() {
  clearCurrentUser();
  console.log('User logged out successfully');
  // Redirect to login page
  window.location.hash = '#/login';
}

// Property Functions
export async function getProperties() {
  try {
    const response = await apiRequest(ENDPOINTS.PROPERTIES, {
      method: 'GET'
    });

    if (response.status === 'Success') {
      console.log('Properties list retrieved successfully');
      return {
        success: true,
        properties: response.list
      };
    } else {
      return {
        success: false,
        error: response.error
      };
    }
  } catch (error) {
    console.error('Get properties error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getProperty(propertyId) {
  try {
    // Get all properties and filter for the specific one
    const propertiesResult = await getProperties();

    if (!propertiesResult.success) {
      return {
        success: false,
        error: propertiesResult.error
      };
    }

    // Convert propertyId to number for comparison since prop_id is a number
    const numericPropertyId = parseInt(propertyId, 10);

    // Use prop_id instead of id for comparison
    const property = propertiesResult.properties.find(p => p.prop_id === numericPropertyId);

    if (property) {
      console.log(`Property retrieved for ID: ${propertyId}`, property);
      return {
        success: true,
        property: property
      };
    } else {
      console.log(`Property not found for ID: ${propertyId}. Available properties:`,
          propertiesResult.properties.map(p => ({ prop_id: p.prop_id, name: p.name })));
      return {
        success: false,
        error: 'Property not found'
      };
    }
  } catch (error) {
    console.error('Get property error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getKey(propertyId) {
  try {
    const response = await apiRequest(ENDPOINTS.GET_KEY, {
      method: 'POST',
      body: JSON.stringify({
        property_id: propertyId
      })
    });

    if (response.status === 'Success') {
      console.log(`Key retrieved for property ID: ${propertyId}`);
      return {
        success: true,
        key: response.key,
        propertyId: response.property_id
      };
    } else {
      return {
        success: false,
        error: response.error
      };
    }
  } catch (error) {
    console.error('Get key error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Reservation Functions
export async function createReservation(propertyId, username, startDate, endDate, status = 'pending') {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'User not logged in'
      };
    }

    // Use actual user ID if available, otherwise use username as fallback
    const username = currentUser.username;

    const response = await apiRequest(ENDPOINTS.RESERVATION, {
      method: 'POST',
      body: JSON.stringify({
        user_name: username,
        property_id: propertyId, // Include property_id in the main payload
        start_date: startDate, // Format: YYYY-MM-DD
        end_date: endDate,     // Format: YYYY-MM-DD
        status: status
      })
    });

    console.log("Response from API : ", response);
    // Handle your backend's response format
    if (response[0].status === 'Success') {
      console.log(`Reservation created successfully for property ID: ${propertyId}`);
      return {
        success: true,
        data: response,
        message: 'Reservation created successfully'
      };
    } else if (response.status === 'Failed') {
      console.log(`Reservation failed: ${response.error}`);
      return {
        success: false,
        error: response.error || 'Reservation failed',
        message: response.error || 'Try again later'
      };
    }
    // } else {
    //   return {
    //     success: false,
    //     error: response.error || 'Unknown error',
    //     message: response.error || 'Failed to create reservation'
    //   };
    // }
  } catch (error) {
    console.error('Create reservation error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Network error occurred during reservation'
    };
  }
}

export async function getUserReservations() {
  try {
    const user = getCurrentUser();
    console.log("user from API:", user);
    if (!user) {
      throw new Error('User not logged in');
    }

    // Get username from user object
    const username = user.username;
    if (!username) {
      throw new Error('Username not found in user object');
    }

    // Make POST request with username in body
    const response = await apiRequest(`${ENDPOINTS.LIST_RESERVATION}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_name: username
      })
    });

    if (response.status === "Success") {
      console.log('User reservations retrieved from API');
      return response.reservation_list;
    } else if (response.status === 'Failed') {
      // Handle the case where user has no reservations yet
      if (response.error === 'No Data Yet') {
        console.log('User has no reservations yet');
        return []; // Return empty array instead of throwing error
      }
      throw new Error(response.error || 'Failed to fetch reservations');
    }
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    throw error; // Re-throw to let calling code handle it
  }
}

export async function checkoutReservation(reservationId) {
  try {
    console.log(`Attempting to checkout reservation ${reservationId}`);

    // Add loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!reservationId) {
      return {
        success: false,
        error: 'Reservation ID is required',
        message: 'Invalid reservation ID'
      };
    }

    // TODO: Replace with actual API call when endpoint is available
    // const response = await apiRequest(`${ENDPOINTS.RESERVATION}/${reservationId}/checkout`, {
    //   method: 'POST'
    // });

    // Simulate API call with high success rate
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      console.log(`Reservation ${reservationId} checked out successfully`);

      // Store checkout status in session for persistence during prototype
      try {
        const checkoutData = {
          reservationId: reservationId,
          checkoutTime: new Date().toISOString(),
          status: 'completed'
        };

        // Use sessionStorage if available, otherwise memory
        if (window.sessionStorage) {
          const existingCheckouts = JSON.parse(window.sessionStorage.getItem('checkedOutReservations') || '[]');
          existingCheckouts.push(checkoutData);
          window.sessionStorage.setItem('checkedOutReservations', JSON.stringify(existingCheckouts));
        } else {
          window.checkedOutReservations = window.checkedOutReservations || [];
          window.checkedOutReservations.push(checkoutData);
        }
      } catch (storageError) {
        console.log('Could not store checkout data:', storageError);
      }

      return {
        success: true,
        message: 'Checkout completed successfully! Thank you for your stay.',
        checkoutTime: new Date().toISOString(),
        reservationId: reservationId
      };
    } else {
      return {
        success: false,
        error: 'Checkout failed',
        message: 'Unable to process checkout at this time. Please try again.'
      };
    }

  } catch (error) {
    console.error('Checkout reservation error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Network error occurred during checkout'
    };
  }
}

// User Session Management Functions
export function getCurrentUser() {
  try {
    // Check if user data exists in memory/session
    const userData = window.sessionStorage ?
        JSON.parse(window.sessionStorage.getItem('currentUser') || 'null') :
        window.currentUser || null;

    if (userData && userData.user_name) {
      return {
        username: userData.user_name,
        user_id: userData.user_id, // Include user_id if available
        email: userData.email,
        loginTime: userData.loginTime,
        messages: userData.messages || []
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export function setCurrentUser(userData) {
  try {
    const userSession = {
      user_name: userData.user_name || userData.username,
      user_id: userData.user_id, // Store user_id for API calls
      email: userData.email,
      loginTime: new Date().toISOString(),
      messages: userData.messages || []
    };

    // Store in sessionStorage if available, otherwise in memory
    if (window.sessionStorage) {
      window.sessionStorage.setItem('currentUser', JSON.stringify(userSession));
    } else {
      window.currentUser = userSession;
    }

    console.log('User session stored successfully');
    return true;
  } catch (error) {
    console.error('Error setting current user:', error);
    return false;
  }
}

export function clearCurrentUser() {
  try {
    if (window.sessionStorage) {
      window.sessionStorage.removeItem('currentUser');
    } else {
      window.currentUser = null;
    }

    console.log('User session cleared');
    return true;
  } catch (error) {
    console.error('Error clearing current user:', error);
    return false;
  }
}

// Utility Functions
export function isUserLoggedIn() {
  return getCurrentUser() !== null;
}

export function getUserId() {
  const user = getCurrentUser();
  return user ? (user.user_id || user.username) : null;
}

// Legacy function for backward compatibility (deprecated)
export async function getData() {
  console.warn('getData() is deprecated. Use getProperties() instead.');
  return getProperties();
}