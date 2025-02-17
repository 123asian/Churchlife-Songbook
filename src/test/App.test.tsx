import puppeteer, { Browser, Page } from "puppeteer";

const baseUrl = "http://localhost:8080";
const selectors = {
  searchBar: "#searchBar > input",
  appName: "#appName",
  shlSongbook: "#shl > ion-card-title",
  searchViewIonCard: "#searchViewSongList > ion-card",
  searchViewIonCardTitle: "#searchViewSongList > ion-card > ion-card-title",
  lyricViewIonCardTitle: "#lyricViewCard > ion-card-header > ion-card-title",
  musicView: "#musicView",
  songViewToggler: "#songViewToggler",
  lyricVerseName: "#lyricViewCard > ion-card-content > h5",
  lyricLine: "#lyricViewCard > ion-card-content > ion-text > p",
  noResultsFoundLabel: "#root > div > ion-content > ion-item > ion-label",
  nextButton: "#nextButton",
  prevButton: "#prevButton",
  downloadMusicButton: "#music-download-button",
};
const hasMultipleBooks = false;

describe("App", () => {
  let page: Page;
  let browser: Browser;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      // headless: false, // uncomment this to open browser window for tests
      slowMo: 10, // use this to slow down testing for debugging purposes
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      // dumpio: true, // uncomment this to have console logs and verbose logging
    });
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto(baseUrl);
  });

  it("renders without crashing", async () => {
    await page.waitForSelector(selectors.appName);

    const html = await page.$eval(selectors.appName, e => e.innerHTML);
    expect(html).toBeTruthy();
  });

  it("this test helps prevent later tests from failing", () => {
    true;
  });

  it("searching song number displays correct song", async () => {
    await verifySearchResults(page, "533", ["533. O Church Arise"]);
  });

  it("searching title displays correct results", async () => {
    await verifySearchResults(page, "follow", ["271. Follow On!", "274. How Shall I Follow Him I Serve?"], false);
  });

  it("searching author displays correct results", async () => {
    await verifySearchResults(page, "bertha fennell", ["401. Savior, I By Faith Am Touching"], false);
  });

  it("searching is case and order insensitive", async () => {
    const expectedSong = "3. Praise God From Whom All Blessings Flow";
    const newPage = async () => {
      page = await browser.newPage();
      await page.goto(baseUrl);
    };

    await verifySearchResults(page, "praise god from Whom aLL bleSsiNgs FLOW", [expectedSong], false);

    await newPage();
    await verifySearchResults(page, "whom all flow god praise from blessings", [expectedSong], false);
  }, 10000);

  it("finds song by lyrics", async () => {
    await verifySearchResults(page, "early in the morning", ["5. Holy, Holy, Holy!"], false);
  });

  it("finds song by lyrics", async () => {
    await verifySearchResults(page, "incarnate born", ["77. Crown Him With Many Crowns"], false);
  });

  it("prioritizes title over lyrics in search", async () => {
    await verifySearchResults(page, "incarnate", ["380. O Word Of God Incarnate"], false);
  });

  it("prioritizes title over lyrics in search", async () => {
    await verifySearchResults(page, "born", ["475. Ye Must Be Born Again"], false);
  });

  it("searching terms not found displays no results", async () => {
    await verifySearchResults(page, "zxcvzxv", []);

    expect(await page.$eval(selectors.noResultsFoundLabel, e => e.innerHTML)).toEqual("No results found");
  });

  it("selecting song displays song page music view", async () => {
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCardTitle);

    const navigation = page.waitForNavigation({ waitUntil: "networkidle0" });

    const ionCards = await page.$$(selectors.searchViewIonCardTitle);
    await ionCards[5].click();

    await page.waitForSelector(selectors.songViewToggler);
    const button = await page.$(selectors.songViewToggler);
    await button?.click();

    await page.waitForSelector(selectors.musicView);

    await navigation;

    expect(page.url()).toEqual(getSongLink(6));
    const musicViewSrc = await page.$eval(selectors.musicView, e => e.getAttribute("src"));
    expect(musicViewSrc).toEqual(
      "https://raw.githubusercontent.com/Church-Life-Apps/Resources/master/resources/images/shl/SHL_006.png"
    );
  }, 20000);

  it("song page lyric view works correctly", async () => {
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCardTitle);

    const ionCards = await page.$$(selectors.searchViewIonCardTitle);
    await ionCards[5].click();

    await page.waitForSelector(selectors.lyricViewIonCardTitle);

    const cardTitle = await page.$eval(selectors.lyricViewIonCardTitle, e => e.innerHTML);
    expect(cardTitle).toEqual("6) Come, Thou Almighty King");

    const lyricLines = await page.$$(selectors.lyricLine);
    expect(lyricLines.length).toEqual(27);
  });

  it("lyrics view displays lyrics based on presentation order - song 42", async () => {
    await page.goto(getSongLink(42));

    await page.waitForSelector(selectors.lyricViewIonCardTitle);

    const cardTitle = await page.$eval(selectors.lyricViewIonCardTitle, e => e.innerHTML);
    expect(cardTitle).toEqual("42) Blessed Be Your Name");

    const lyricVerseNames = await page.$$(selectors.lyricVerseName);
    expect(lyricVerseNames.length).toEqual(10);

    expect(await lyricVerseNames[2].evaluate(e => e.innerHTML)).toEqual("Chorus 1");
    expect(await lyricVerseNames[3].evaluate(e => e.innerHTML)).toEqual("Chorus 2");
    expect(await lyricVerseNames[5].evaluate(e => e.innerHTML)).toEqual("Verse 4");
    expect(await lyricVerseNames[8].evaluate(e => e.innerHTML)).toEqual("Bridge 1");
  });

  it("lyrics view displays lyrics based on presentation order - song 44", async () => {
    await page.goto(getSongLink(44));

    await page.waitForSelector(selectors.lyricViewIonCardTitle);

    const cardTitle = await page.$eval(selectors.lyricViewIonCardTitle, e => e.innerHTML);
    expect(cardTitle).toEqual("44) The Name Of Jesus");

    const lyricVerseNames = await page.$$(selectors.lyricVerseName);
    expect(lyricVerseNames.length).toEqual(8);

    expect(await lyricVerseNames[1].evaluate(e => e.innerHTML)).toEqual("Chorus 1");
    expect(await lyricVerseNames[5].evaluate(e => e.innerHTML)).toEqual("Chorus 1");
  });

  it("displays song list and loads all songs on scroll", async () => {
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCard);

    let ionCards = await page.$$(selectors.searchViewIonCard);
    expect(ionCards.length).toBe(20); // list should only pre-load 20 songs.

    // scroll to bottom
    await ionCards[ionCards.length - 1].hover();
    await page.waitForSelector(selectors.searchViewIonCard + `:nth-child(${ionCards.length})`);
    ionCards = await page.$$(selectors.searchViewIonCard);

    while (ionCards.length < 533) {
      // fake scrolling by hovering back and forth:
      await ionCards[ionCards.length - 1].hover();
      await ionCards[ionCards.length - 10].hover();
      await ionCards[ionCards.length - 1].hover();

      await page.waitForSelector(selectors.searchViewIonCard + `:nth-child(${ionCards.length})`);
      ionCards = await page.$$(selectors.searchViewIonCard);
    }

    const loadedIonCards = await page.$$(selectors.searchViewIonCard);
    expect(loadedIonCards.length).toBe(533); // list should contain all 533 songs.
  }, 20000);

  it("displays arrow buttons and transitions correctly on lyrics mode when screen is wide enough", async () => {
    await page.setViewport({ width: 1366, height: 768 });
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCardTitle);

    const ionCards = await page.$$(selectors.searchViewIonCardTitle);
    await ionCards[5].click();

    await page.waitForSelector(selectors.lyricViewIonCardTitle);

    expect(page.url()).toEqual(getSongLink(6));
    expect(await page.$eval(selectors.lyricViewIonCardTitle, e => e.innerHTML)).toEqual("6) Come, Thou Almighty King");

    await page.waitForSelector(selectors.nextButton);
    await page.click(selectors.nextButton);

    expect(page.url()).toEqual(getSongLink(7));
    expect(await page.$eval(selectors.lyricViewIonCardTitle, e => e.innerHTML)).toEqual(
      "7) God, Our Father, We Adore Thee!"
    );

    await page.waitForSelector(selectors.prevButton);
    await page.click(selectors.prevButton);

    expect(page.url()).toEqual(getSongLink(6));
    expect(await page.$eval(selectors.lyricViewIonCardTitle, e => e.innerHTML)).toEqual("6) Come, Thou Almighty King");
  });

  it("buttons invisible but should still be in dom", async () => {
    await page.setViewport({ width: 900, height: 768 });
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCardTitle);

    const ionCards = await page.$$(selectors.searchViewIonCardTitle);
    await ionCards[5].click();

    await page.waitForSelector(selectors.songViewToggler);
    await page.click(selectors.songViewToggler);

    expect(document.querySelector(selectors.prevButton)).toBeTruthy;
    expect(document.querySelector(selectors.nextButton)).toBeTruthy;
  });

  it("displays arrow buttons and transitions correctly on music mode", async () => {
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCardTitle);

    const ionCards = await page.$$(selectors.searchViewIonCardTitle);
    await ionCards[5].click();

    await page.waitForSelector(selectors.songViewToggler);
    await page.click(selectors.songViewToggler);

    await page.waitForSelector(selectors.musicView);

    expect(page.url()).toEqual(getSongLink(6));
    expect(await page.$eval(selectors.musicView, e => e.getAttribute("src"))).toEqual(
      "https://raw.githubusercontent.com/Church-Life-Apps/Resources/master/resources/images/shl/SHL_006.png"
    );

    await page.waitForSelector(selectors.nextButton);
    await page.click(selectors.nextButton);

    expect(page.url()).toEqual(getSongLink(7));
    expect(await page.$eval(selectors.musicView, e => e.getAttribute("src"))).toEqual(
      "https://raw.githubusercontent.com/Church-Life-Apps/Resources/master/resources/images/shl/SHL_007.png"
    );

    await page.waitForSelector(selectors.prevButton);
    await page.click(selectors.prevButton);

    expect(page.url()).toEqual(getSongLink(6));
    expect(await page.$eval(selectors.musicView, e => e.getAttribute("src"))).toEqual(
      "https://raw.githubusercontent.com/Church-Life-Apps/Resources/master/resources/images/shl/SHL_006.png"
    );
  }, 20000);

  it("Download music button should not exist on lyric view", async () => {
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCardTitle);

    const ionCards = await page.$$(selectors.searchViewIonCardTitle);
    await ionCards[5].click();

    const downloadButton = await page.$(selectors.downloadMusicButton);

    expect(downloadButton).toEqual(null);
  });

  it("Download music button should exist in music mode", async () => {
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCardTitle);

    const ionCards = await page.$$(selectors.searchViewIonCardTitle);
    await ionCards[5].click();

    await page.waitForSelector(selectors.songViewToggler);
    await page.click(selectors.songViewToggler);

    await page.waitForSelector(selectors.downloadMusicButton);
    const downloadButton = await page.$(selectors.downloadMusicButton);
    expect(downloadButton).toBeTruthy();
  });

  it("Download music button should have right download name", async () => {
    if (hasMultipleBooks) {
      await page.waitForSelector(selectors.shlSongbook);
      await page.click(selectors.shlSongbook);
    }

    await page.waitForSelector(selectors.searchViewIonCardTitle);

    const ionCards = await page.$$(selectors.searchViewIonCardTitle);
    await ionCards[5].click();

    await page.waitForSelector(selectors.songViewToggler);
    await page.click(selectors.songViewToggler);

    await page.waitForSelector(selectors.downloadMusicButton);
    const downloadButtonLink = await page.$eval(selectors.downloadMusicButton, e => e.getAttribute("download"));
    expect(downloadButtonLink).toEqual("shl_6");
  });

  afterAll(async () => {
    browser.close();
  });
});

/**
 * Waits for the SearchBar and song cards to show up.
 * Types in the requested searchTerm.
 * Waits for the 20th original song card to disappear.
 * Asserts that the visible song cards match the songResults.
 * If strict = true, then the visible song cards must exactly be the expected songResults.
 * If strict = false, then only the top N song cards must match the given songResults, where N = songResults.length.
 */
async function verifySearchResults(page: Page, searchTerm: string, songResults: string[], strict = true) {
  if (hasMultipleBooks) {
    await page.waitForSelector(selectors.shlSongbook);
    await page.click(selectors.shlSongbook);
  }

  if (songResults !== null) {
    expect(songResults.length).toBeLessThan(20);
  }

  await page.waitForSelector(selectors.searchBar);

  await page.waitForSelector(selectors.searchViewIonCard);

  await page.type(selectors.searchBar, searchTerm);

  await page.waitForSelector(selectors.searchViewIonCard + ":nth-child(20)", {
    hidden: true,
  });
  const ionCards = await page.$$(selectors.searchViewIonCardTitle);
  if (strict) {
    expect(ionCards.length).toEqual(songResults.length);
  } else {
    expect(ionCards.length).toBeGreaterThanOrEqual(songResults.length);
  }
  if (strict) {
    for (let i = 0; i < ionCards.length; i++) {
      expect(await ionCards[i].evaluate(e => e.innerHTML)).toEqual(songResults[i]);
    }
  } else {
    for (let i = 0; i < songResults.length; i++) {
      expect(await ionCards[i].evaluate(e => e.innerHTML)).toEqual(songResults[i]);
    }
  }
}

function getSongLink(songNumber: number) {
  return baseUrl + "/#/shl/" + songNumber.toString();
}
