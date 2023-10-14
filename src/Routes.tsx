import { RouteObject } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RecordPage from './pages/RecordPage';

const routes: RouteObject[] = [
  {
    children: [
      { path: '/', element: <RecordPage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
];

export default routes;
