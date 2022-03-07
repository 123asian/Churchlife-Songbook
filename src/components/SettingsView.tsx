import { IonButton, IonContent, IonItem, IonLabel, IonList, IonIcon, IonToggle } from "@ionic/react";
import { moon } from "ionicons/icons";
import React, { useState } from "react";
import "./Components.css";
import FeedbackForm from "./FeedbackForm";

/**
 * Settings Page.
 */
const SettingsView: React.FC = () => {
  const [chosenSetting, setChosenSetting] = useState<string>("");

  const toggleDarkModeHandler = () => {
    document.body.classList.toggle("dark");
    const localColorScheme = window.localStorage.getItem('colors')

    if (localColorScheme === 'dark') {
      window.localStorage.setItem('colors', 'light');
    } else {
      window.localStorage.setItem('colors', 'dark');
    }
  };

  return (
    <IonContent>
      {/* To add another settings item, add another IonItem with an IonLabel. */}
      {/* TODO: Add Font Size as an option. */}
      {chosenSetting === "" ? (
        <IonList>
          <IonItem id="settingsTitle">
            <IonLabel>Settings</IonLabel>
          </IonItem>
          <IonItem>
            <IonButton onClick={() => setChosenSetting("feedback")}>Submit Feedback</IonButton>
          </IonItem>
          <IonItem>
            <IonIcon slot="start" icon={moon} />
            <IonLabel>Dark Mode</IonLabel>
            <IonToggle
              slot="end"
              name="darkMode"
              onIonChange={toggleDarkModeHandler}
            />
          </IonItem>
        </IonList>
      ) : null}

      {chosenSetting === "feedback" ? <FeedbackForm /> : null}

      {chosenSetting !== "" ? (
        <IonButton color="light" expand="full" id="backToSettingsButton" onClick={() => setChosenSetting("")}>
          Return to Settings
        </IonButton>
      ) : null}
    </IonContent>
  );
};

export default SettingsView;
