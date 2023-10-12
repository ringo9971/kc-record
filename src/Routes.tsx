import { RouteObject } from 'react-router-dom';

import RecordPage from './pages/RecordPage';

const routes: RouteObject[] = [
  {
    children: [{ path: '/', element: <RecordPage /> }],
  },
];

export default routes;
