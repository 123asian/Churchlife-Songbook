import { IonItem, IonLabel } from "@ionic/react";
import React from "react";
import "./Components.css";

interface LyricViewProps {
  songNumber: number;
}

/**
 * Lyric Viewer React Functional Component.
 */
const LyricView: React.FC<LyricViewProps> = (props) => {
  var data;
  try {
    data = require(`../resources/Songs_&_Hymns_Of_Life/metadata/${props.songNumber}.json`);
  } catch {
    return <h1 className="center">No Song Found</h1>;
  }
  let lyrics = getLyrics(data);
  return (
    <div>
      <h2 className="center">{data["title"]}</h2>

      <IonItem>
        <IonLabel id="lyricTextBox">{lyrics}</IonLabel>
      </IonItem>
    </div>
  );

  /**
   * Parses all verse of the song to a string.
   */
  function getLyrics(data: any) {
    let verses = Object.keys(data["lyrics"]);
    var lyrics = ``;
    verses.forEach((versenumber) => {
      lyrics += `\n${versenumber}: `;
      data["lyrics"][versenumber].forEach((line: String) => {
        lyrics += `\t${line}\n`;
      });
    });
    lyrics = lyrics.trimStart();
    return lyrics;
  }
};

export default LyricView;
