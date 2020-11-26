import React, { useState } from "react";
import "./Components.css";
import { makeThreeDigits } from "../utils/SongUtils";
import { IonToggle } from "@ionic/react";
import { isBrowser } from "../utils/PlatformUtils";

const baseUrl = "https://raw.githubusercontent.com/Church-Life-Apps/Resources/master/resources/images/";
const hymnalPart = "shl/SHL_"; // This part can change when red book is added
const imageSuffix = ".png";
const alt = "No Song Found";

const songsWithTwoTunes = [156, 216, 278, 478];

// Props are kind of like the parameters for the constructor of this class.
interface MusicViewProps {
  songNumber: number;
}

/**
 * Song Viewer React Functional Component.
 */
const MusicView: React.FC<MusicViewProps> = (props) => {
  const widthPixels = isBrowser() ? window.innerWidth / 2 : window.innerWidth;
  const [secondTune, setSecondTune] = useState<boolean>(false);
  const [width, setWidth] = useState<number>(widthPixels);
  const [zoomed, setZoomed] = useState<boolean>(false);

  let songHasTwoTunes = songsWithTwoTunes.includes(props.songNumber);

  let secondTuneSuffix = songHasTwoTunes && secondTune ? "-B" : "";

  let url = baseUrl + hymnalPart + makeThreeDigits(props.songNumber) + secondTuneSuffix + imageSuffix;

  // TODO: Add Pinch and Zoom to image.
  return (
    <div>
      {/* Second Tune Toggler  */}
      {songHasTwoTunes && (
        <div id="songToggler">
          <IonToggle checked={secondTune} onIonChange={(e) => setSecondTune(!secondTune)} />
        </div>
      )}

      {/* image */}
      {/* <TransformWrapper>
        <TransformComponent> */}
      <img
        style={{ width: width }}
        id="musicView"
        onDoubleClick={() => {
          if (zoomed) {
            setWidth(widthPixels);
          } else setWidth(widthPixels * 2);
          setZoomed(!zoomed);
        }}
        src={url}
        alt={alt}
      />
      {/* </TransformComponent>
      </TransformWrapper> */}
    </div>
  );
};

export default MusicView;
