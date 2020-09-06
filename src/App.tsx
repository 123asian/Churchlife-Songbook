import React from 'react';
import {
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ExamplePage from './pages/ExamplePage';

const App: React.FC = () => (
  <IonApp>
    <IonHeader>

      <IonToolbar testing if CI build works>
        <IonTitle>Hymnal App</IonTitle>
just adding some
random stuf

that I think should break the build

      </IonToolbar>
    </IonHeader>

    <IonContent>
      {/* Ion Content goes here */}

      <ExamplePage />

    </IonContent>
  </IonApp>
);

export default App;
