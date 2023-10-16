import { RouteObject } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import RecordPage from './pages/RecordPage';

const routes: RouteObject[] = [
  {
    children: [
      { path: '/', element: <RecordPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },
];

export default routes;
