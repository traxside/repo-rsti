import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { getCurrentUser } from '../data/api';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // Check authentication for protected routes
    await this._checkAuthentication(url);

    this._updateNavigation();

    this.#content.innerHTML = await page.render();
    await page.afterRender();
  }

  async _checkAuthentication(url) {
    const protectedRoutes = ['/home', '/profile', '/reservationslist', '/reservation/:id', '/getkeylist'];
    const publicRoutes = ['/login', '/signup'];

    const currentUser = await getCurrentUser();

    // If user is logged in and trying to access login/signup, redirect to home
    if (currentUser && publicRoutes.includes(url)) {
      window.location.hash = '#/home';
      return;
    }

    // If user is not logged in and trying to access protected routes, redirect to login
    if (!currentUser && protectedRoutes.includes(url)) {
      window.location.hash = '#/login';
      return;
    }
  }

  _updateNavigation() {

    // FOR home
    if(window.location.hash === '' || window.location.hash === '/' ){
      window.location.hash = '#/home';
    }

    // FOR footer
    const footer = document.querySelector('footer');
    if(window.location.hash === '#/home' || window.location.hash === '#/profile') {
      footer.style.visibility = 'visible';
      const reserve = document.querySelector('#reserve');
      const profile = document.querySelector('#profile');

      if(reserve && profile) {
        if(window.location.hash === '#/home' || window.location.hash === '') {
          reserve.style.backgroundColor = '#DF71AA';
          reserve.style.color = '#292345';
          const hotelIcon = reserve.querySelector('#icon-hotel');
          if(hotelIcon) hotelIcon.setAttribute('src', 'images/hotel_dark.png');

          profile.style.backgroundColor = '#292345';
          profile.style.color = 'white';
          const profileIcon = profile.querySelector('#icon-profile');
          if(profileIcon) profileIcon.setAttribute('src', 'images/profile_light.png');
        }
        else if(window.location.hash === '#/profile') {
          reserve.style.backgroundColor = '#292345';
          reserve.style.color = 'white';
          const hotelIcon = reserve.querySelector('#icon-hotel');
          if(hotelIcon) hotelIcon.setAttribute('src', 'images/hotel_light.png');

          profile.style.backgroundColor = '#DF71AA';
          profile.style.color = '#292345';
          const profileIcon = profile.querySelector('#icon-profile');
          if(profileIcon) profileIcon.setAttribute('src', 'images/profile_dark.png');
        }
      }
    }
    else {
      if(footer) footer.style.visibility = 'hidden';
    }

  }
}

export default App;