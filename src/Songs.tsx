/* Data structures to support handling songs */

import { File } from '@ionic-native/file/ngx';

abstract class Songbook
{
  abstract readonly name: string
  readonly songsBySongNumber: Map<number, Song>
  readonly songsByTitle: Map<string, Song>

  constructor()
  {
    this.songsBySongNumber = new Map();
    this.songsByTitle = new Map();
  }

  // The expectation is this function should populate `songsBySongNumber` and 
  // `songsByTitle` for every song in the songbook.
  abstract compileSongs(): void;
}

class Song
{
  constructor(
    name: string,
    songNumber: number,
    pageNumber: number
  ) {}
}

class Songs
{
  songbooks: Map<string, Songbook>

  constructor()
  {
    this.songbooks = new Map();

    // create and add black book
    let blackBook = new BlackBook();
    this.songbooks.set(blackBook.name, blackBook);

    // compile songs for all songbooks
    this.compileSongs();
  }

  compileSongs()
  {
    this.songbooks.forEach((songbook, _) =>
    {
      songbook.compileSongs();
    });
  }
}


class BlackBook extends Songbook
{
  readonly name: string = "Songs & Hymns Of Life";

  // This will need to be adjusted if we want to move these files to a backend server.
  readonly metadataPath = "https://github.com/Church-Life-Apps/Songs/tree/master/resources/Songs_%26_Hymns_Of_Life/metadata/";
  readonly pagesPath = "https://github.com/Church-Life-Apps/Songs/tree/master/resources/Songs_%26_Hymns_Of_Life/pages/";

  compileSongs(): void
  {
    // this is harder than I thought.
  }
}




export { Songs };