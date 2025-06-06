// CSS imports
import '../styles/styles.css';
import '../styles/bryant.css';

// JS: import Materialize CSS and JS
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize.min.js';

import App from './pages/app';

// UTILS
import { registerServiceWorker } from './utils';

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });
  await app.renderPage();

  await registerServiceWorker();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
  });
});
