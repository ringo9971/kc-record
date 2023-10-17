import { useRoutes } from 'react-router-dom';

import { DropsProvider } from './lib/DropsContext';
import routes from './Routes';
import TopBar from './TopBar';

function App() {
  const routing = useRoutes(routes);

  return (
    <>
      <DropsProvider>
        <>
          <TopBar />
          {routing}
        </>
      </DropsProvider>
    </>
  );
}

export default App;
