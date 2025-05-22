import CONFIG from '../config';

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/user/login`,
  SIGNUP: `${CONFIG.BASE_URL}/user/signup`,
  GET_KEY: `${CONFIG.BASE_URL}/get/key`,
  PROPERTIES: `${CONFIG.BASE_URL}/list/properties`,
  RESERVATION: `${CONFIG.BASE_URL}/reservation`,
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

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// export async function login(username, password) {
//   try {
//     const response = await apiRequest(ENDPOINTS.LOGIN, {
//       method: 'POST',
//       body: JSON.stringify({
//         user_name: username,
//         password: password
//       })
//     });
//
//     if (response.status === 'Login Success') {
//       console.log(`Login berhasil dengan username: ${username}`);
//       return {
//         success: true,
//         data: response,
//         messages: response.messages || []
//       };
//     } else {
//       console.log(`Login gagal: ${response.error}`);
//       return {
//         success: false,
//         error: response.error
//       };
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

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

    if (response.status === 'Register Success') {
      console.log(`Signup berhasil dengan username: ${username}, email: ${email}`);
      return {
        success: true,
        data: response
      };
    } else {
      console.log(`Signup gagal: ${response.error}`);
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

    const property = propertiesResult.properties.find(p => p.id == propertyId);

    if (property) {
      console.log(`Property retrieved for ID: ${propertyId}`);
      return property;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Get property error:', error);
    return null;
  }
}

export async function createReservation(propertyId, startDate, endDate, totalPrice, totalDays, status = 'pending') {
  try {
    // Get current user to get user ID
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: 'User not logged in'
      };
    }

    // Note: Your backend expects user_id, but we don't have it stored in session
    // You might need to modify your backend to accept username instead
    // For now, using propertyId as a placeholder - you'll need to adjust this
    const response = await apiRequest(ENDPOINTS.RESERVATION, {
      method: 'POST',
      body: JSON.stringify({
        user_id: propertyId, // This should be actual user ID from your user system
        start_date: startDate, // Format: YYYY-MM-DD
        end_date: endDate,     // Format: YYYY-MM-DD
        status: status,
        // Additional fields that might be useful (not in your current backend)
        property_id: propertyId,
        total_price: totalPrice,
        total_days: totalDays
      })
    });

    if (response.status === 'Success') {
      console.log(`Reservation created successfully for property ID: ${propertyId}`);
      return {
        success: true,
        data: response,
        message: 'Reservation created successfully'
      };
    } else {
      return {
        success: false,
        error: response.error,
        message: response.error
      };
    }
  } catch (error) {
    console.error('Create reservation error:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to create reservation'
    };
  }
}

// User session management functions
export function getCurrentUser() {
  try {
    // Check if user data exists in memory/session
    const userData = window.sessionStorage ?
        JSON.parse(window.sessionStorage.getItem('currentUser') || 'null') :
        window.currentUser || null;

    if (userData && userData.user_name) {
      return {
        username: userData.user_name,
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

export async function login(username, password) {
  try {
    const response = await apiRequest(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: JSON.stringify({
        user_name: username,
        password: password
      })
    });

    if (response.status === 'Login Success') {
      // Store user session data
      const userData = {
        user_name: username,
        messages: response.messages || []
      };

      setCurrentUser(userData);

      console.log(`Login berhasil dengan username: ${username}`);
      return {
        success: true,
        data: response,
        messages: response.messages || []
      };
    } else {
      console.log(`Login gagal: ${response.error}`);
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

// Logout function
export function logout() {
  clearCurrentUser();
  console.log('User logged out successfully');
  // Redirect to login page
  window.location.hash = '#/login';
}

// Legacy function for backward compatibility (deprecated)
export async function getData() {
  console.warn('getData() is deprecated. Use getProperties() instead.');
  return getProperties();
}