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
      if(window.location.hash === '#/home' || window.location.hash === '') {
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
    // TODO ERROR ATTRIBUTES
    else {
      footer.style.visibility = 'hidden';
    }
  }
}

export default App;
