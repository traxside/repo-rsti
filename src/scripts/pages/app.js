import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    // this.#navigationDrawer = navigationDrawer;
    //
    // this._setupDrawer();
  }

  // _setupDrawer() {
  //   this.#drawerButton.addEventListener('click', () => {
  //     this.#navigationDrawer.classList.toggle('open');
  //   });

  //   document.body.addEventListener('click', (event) => {
  //     if (!this.#navigationDrawer.contains(event.target) && !this.#drawerButton.contains(event.target)) {
  //       this.#navigationDrawer.classList.remove('open');
  //     }
  //
  //     this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
  //       if (link.contains(event.target)) {
  //         this.#navigationDrawer.classList.remove('open');
  //       }
  //     })
  //   });
  // }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    this._updateNavigation();

    this.#content.innerHTML = await page.render();
    await page.afterRender();
  }

  _updateNavigation() {
    const footer = document.querySelector('footer');
    footer.style.visibility = 'visible';
    if(window.location.hash === '#/login') {
      footer.style.visibility = 'hidden';
    }
    // TODO ERROR ATTRIBUTES
    else {
      const reserve = document.querySelector('#reserve');
      const profile = document.querySelector('#profile');
      if(window.location.hash === '#/home' || window.location.hash === '/#') {
        reserve.style.backgroundColor = '#DF71AA';
        reserve.style.color = '#292345';
        reserve.querySelector('#icon-hotel').setAttribute('src', 'images/hotel_dark.png'); //THIS AND OTHER .attributes
        profile.style.backgroundColor = '#292345';
        profile.style.color = 'white';
        profile.querySelector('#icon-profile').setAttribute('src', 'images/profile_light.png');
      }
      else if(window.location.hash === '#/profile') {
        reserve.style.backgroundColor = '#292345';
        reserve.style.color = 'white';
        reserve.querySelector('#icon-hotel').setAttribute('src', 'images/hotel_light.png');
        profile.style.backgroundColor = '#DF71AA';
        profile.style.color = '#292345';
        profile.querySelector('#icon-profile').setAttribute('src', 'images/profile_dark.png');
      }
    }
  }
}

export default App;
