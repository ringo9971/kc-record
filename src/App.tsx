import { useRoutes } from 'react-router-dom';

import routes from './Routes';
import TopBar from './TopBar';

function App() {
  const routing = useRoutes(routes);

  return (
    <>
      <TopBar />
      {routing}
    </>
  );
}

export default App;
