import {
  IonContent,
  IonPage,
  IonItem,
  IonButton,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonModal,
  IonSearchbar,
  IonIcon,
} from "@ionic/react";
import "./HomePage.css";
import { arrowBackCircleOutline, settingsOutline } from "ionicons/icons";
import { PageViewMode, SongViewMode } from "../utils/SongUtils";
import LyricView from "../components/LyricView";
import MusicView from "../components/MusicView";
import React, { useState } from "react";
import SearchView from "../components/SearchView";
import SettingsView from "../components/SettingsView";

/**
 * Home Page Component.
 *
 * Use 'useState' for dynamic variables.
 * When the variable changes, the places where it's being used are automatically re-rendered.
 */
const HomePage: React.FC = () => {
  // the song number selected by the user
  const [songNumber, setSongNumber] = useState<number>(0);

  // the search string inputted by the user
  const [searchString, setSearchString] = useState<string>();

  // search view or song view
  const [pageViewMode, setPageViewMode] = useState<PageViewMode>(PageViewMode.Search);

  // when in song view, use music view or lyrics view
  const [songViewMode, setSongViewMode] = useState<SongViewMode>(SongViewMode.Music);

  // whether or not to show settings modal
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          {/* [eric] we can probably come up with a better name, right? */}
          <IonTitle>Hymnal App</IonTitle>

          <IonButtons slot="start">{GetBackButton()}</IonButtons>

          <IonButtons slot="primary">
            {/* TODO: Put this Image/Lyric mode button into settings page. 
            This might require some react magic to get state from a child component */}
            {GetViewerModeButton()}
            <IonButton onClick={() => setShowSettingsModal(true)}>
              <IonIcon icon={settingsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Settings Menu Popup  */}
        <IonModal id="settingsModal" isOpen={showSettingsModal} onDidDismiss={() => setShowSettingsModal(false)}>
          <SettingsView />
          <IonButton id="returnToHymnalButton" onClick={() => setShowSettingsModal(false)}>
            Back to Hymnal
          </IonButton>
        </IonModal>

        {GetSearchBar()}

        <IonContent>{GetViewer()}</IonContent>
      </IonContent>
    </IonPage>
  );

  function GetSearchBar() {
    if (pageViewMode !== PageViewMode.Song) {
      return (
        <IonItem>
          <IonSearchbar
            type="search"
            value={searchString}
            placeholder="Search for a song"
            onIonChange={(e) => setSearchString(e.detail.value!.toString())}
          ></IonSearchbar>
        </IonItem>
      );
    }
  }

  function GetViewer() {
    if (pageViewMode === PageViewMode.Search) {
      return <SearchView searchString={searchString} setSongNumber={setSongNumber} setPageViewMode={setPageViewMode} />;
    }

    if (songViewMode === SongViewMode.Music) {
      return <MusicView songNumber={songNumber} />;
    } else {
      return <LyricView songNumber={songNumber} />;
    }
  }

  function ChangeViewerMode() {
    if (songViewMode === SongViewMode.Music) {
      setSongViewMode(SongViewMode.Lyrics);
    } else {
      setSongViewMode(SongViewMode.Music);
    }
  }

  function GetViewerModeButton() {
    if (pageViewMode === PageViewMode.Song) {
      return <IonButton onClick={() => ChangeViewerMode()}>{SongViewMode[songViewMode] + " View"}</IonButton>;
    }
  }

  function GetBackButton() {
    if (pageViewMode === PageViewMode.Song) {
      return (
        <IonButton onClick={() => setPageViewMode(PageViewMode.Search)}>
          <IonIcon icon={arrowBackCircleOutline}></IonIcon>
        </IonButton>
      );
    }
  }
};

export default HomePage;
