import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from "../pages/login/login";
import ProfilePage from '../pages/profile/profile-page';
import SignUpPage from '../pages/signup/signup';
import ReservationsListPage from '../pages/reservationslist/reservationslist';
import ReservationPage from '../pages/reservation-detail/reservation-detail-page';

const routes = {
  '/': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/profile': new ProfilePage(),
  '/signup': new SignUpPage(),
  '/reservationslist': new ReservationsListPage(),
  '/reservation/:id': new ReservationPage(),
};

export default routes;
