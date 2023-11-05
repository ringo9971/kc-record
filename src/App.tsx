import { useRoutes } from 'react-router-dom';

import useFirebase from './hooks/useFirebase';
import { useUser } from './hooks/useUser';
import { ApiClientProvider } from './lib/ApiClientContext';
import { DropsProvider } from './lib/DropsContext';
import { EventsAreasProvider } from './lib/EventsAreasContext';
import { FriendsProvider } from './lib/FriendsContext';
import { MasterProvider } from './lib/MasterContext';
import { RareProvider } from './lib/RareContext';
import { ResourcesProvider } from './lib/ResourceContext';
import routes from './Routes';
import TopBar from './TopBar';

function App() {
  const routing = useRoutes(routes);
  const { user, loading } = useUser();
  const { firestore } = useFirebase();

  return (
    <>
      <ApiClientProvider user={user} firestore={firestore}>
        <ResourcesProvider>
          <EventsAreasProvider>
            <DropsProvider>
              <FriendsProvider>
                <RareProvider>
                  <MasterProvider>
                    <>
                      <TopBar />
                      {!loading && <>{routing}</>}
                    </>
                  </MasterProvider>
                </RareProvider>
              </FriendsProvider>
            </DropsProvider>
          </EventsAreasProvider>
        </ResourcesProvider>
      </ApiClientProvider>
    </>
  );
}

export default App;
