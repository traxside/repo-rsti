import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from "../pages/login/login";
import ProfilePage from '../pages/profile/profile-page';
import SignUpPage from '../pages/signup/signup';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/profile': new ProfilePage(),
  '/signup': new SignUpPage(),
};

export default routes;
