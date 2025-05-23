import HomePage from '../pages/home/home-page';
import AboutPage from '../pages/about/about-page';
import LoginPage from "../pages/login/login";
import ProfilePage from '../pages/profile/profile-page';
import SignUpPage from '../pages/signup/signup';
import ReservationsListPage from '../pages/reservations-list/reservations-list-page';
import ReservationDetailPage from "../pages/reservation-detail/reservation-detail-page";
import GetKeyListPage from '../pages/getkeylist/getkeylist';

const routes = {
  '/': new LoginPage(),
  '/home': new HomePage(),
  '/about': new AboutPage(),
  '/login': new LoginPage(),
  '/profile': new ProfilePage(),
  '/signup': new SignUpPage(),
  '/reservationslist': new ReservationsListPage(),
  '/reservation/:id': new ReservationDetailPage(),
  '/getkeylist/:id': new GetKeyListPage(),
};

export default routes;