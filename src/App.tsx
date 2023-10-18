import { useRoutes } from 'react-router-dom';

import { DropsProvider } from './lib/DropsContext';
import { EventsAreasProvider } from './lib/EventsAreasContext';
import { FriendsProvider } from './lib/FriendsContext';
import routes from './Routes';
import TopBar from './TopBar';

function App() {
  const routing = useRoutes(routes);

  return (
    <>
      <EventsAreasProvider>
        <DropsProvider>
          <FriendsProvider>
            <>
              <TopBar />
              {routing}
            </>
          </FriendsProvider>
        </DropsProvider>
      </EventsAreasProvider>
    </>
  );
}

export default App;
