import { useRoutes } from 'react-router-dom';

import { DropsProvider } from './lib/DropsContext';
import { EventsAreasProvider } from './lib/EventsAreasContext';
import routes from './Routes';
import TopBar from './TopBar';

function App() {
  const routing = useRoutes(routes);

  return (
    <>
      <EventsAreasProvider>
        <DropsProvider>
          <>
            <TopBar />
            {routing}
          </>
        </DropsProvider>
      </EventsAreasProvider>
    </>
  );
}

export default App;
