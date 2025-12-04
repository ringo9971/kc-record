import { useRoutes } from 'react-router-dom';

import useFirebase from './hooks/useFirebase';
import { useUser } from './hooks/useUser';
import { ApiClientProvider } from './lib/ApiClientProvider';
import { DropsProvider } from './lib/DropsProvider';
import { EventsAreasProvider } from './lib/EventsAreasProvider';
import { FriendsProvider } from './lib/FriendsProvider';
import { MasterProvider } from './lib/MasterProvider';
import { RareProvider } from './lib/RareProvider';
import { ResourcesProvider } from './lib/ResourceProvider';
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
