import { RouteObject } from 'react-router-dom';

import FriendsPage from './pages/FriendsPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

const routes: RouteObject[] = [
  {
    children: [
      { path: '/', element: <MainPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/friends', element: <FriendsPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
];

export default routes;
