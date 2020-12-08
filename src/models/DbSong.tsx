import { describeTime } from "../utils/TimeUtils";

/**
 * Model for a DbSong object in the Songs table
 */
export class DbSong {
  constructor(
    public songNumber: number,
    public bookId: number,
    public numHits: number,
    public lastUsed: number,
    public favorited: boolean,
    public author: string,
    public title: string,
    public lyrics: string
  ) {}

  public toString = (): string => {
    return `Song ${this.songNumber} in book ${this.bookId}: ${this.title} by ${this.author}. numHits: ${
      this.numHits
    }, lastUsed: ${describeTime(this.lastUsed)}, favorited: ${this.favorited}.`;
  };
}
