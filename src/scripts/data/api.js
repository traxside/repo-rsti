import CONFIG from '../config';

const ENDPOINTS = {
  ENDPOINT: `${CONFIG.BASE_URL}/your/endpoint/here`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}

export async function getKey() {
  return '123456';
}

export async function login(email, password) {

  try {
    const response = true;

    console.log(`Login berhasil dengan email: ${email}, dan password: ${password}`);
    return response;
  }
  catch (error) {
    console.error(error);
  }
}