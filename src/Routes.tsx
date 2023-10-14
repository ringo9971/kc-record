import { RouteObject } from 'react-router-dom';

import RecordPage from './pages/RecordPage';
import LoginPage from './pages/LoginPage';

const routes: RouteObject[] = [
  {
    children: [
      { path: '/', element: <RecordPage /> },
      { path: '/login', element: <LoginPage /> },
    ],
  },
];

export default routes;
