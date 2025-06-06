export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function isserviceWorkerAvailable() {
  return 'serviceWorker' in navigator;
}

export async function registerServiceWorker() {
  if (!isserviceWorkerAvailable()) {
    console.log('Service worker not available');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.bundle.js');
    console.log('Service worker registered', registration);
  }
  catch (err) {
    console.log('Service worker not available : ', err);
  }
}
