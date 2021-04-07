import fs from "fs";
import path from "path";
import { Cookie, firefox, Page } from "playwright";
import slugify from "slugify";

import { downloadVideo } from "./download";

const getBaseFileLocation = () => __dirname;
const getCookieFilePath = (which: CookieType) =>
  path.join(getBaseFileLocation(), `${which}-cookies.txt`);

const DEFAULT_TIMEOUT = 60000 * 5;

// async function main() {
//   getCookiesAndDownloadVideo("https://www.youtube.com/watch?v=xWbzTQ-Wt3A");
// }
// main().catch(console.error);

export async function getCookiesAndDownloadVideo(
  videoURL: string,
  outputName: string
) {
  const { id, downloadCookiesString, idToken } = await getVideoInformation(
    videoURL
  );

  console.log("baixando video...");
  return downloadVideo(
    id,
    downloadCookiesString,
    idToken,
    outputName || `${slugify(id)}.mp4`
  );
}

async function getVideoInformation(videoURL: string) {
  const browser = await firefox.launch({
    headless: false,
  });

  const context = await browser.newContext();
  await context.addCookies(await getCookies("auth"));
  context.setDefaultTimeout(DEFAULT_TIMEOUT);

  const page = await context.newPage();

  await goToYoutube(page);
  let cookiesStr = "";
  const cookiePromise = page.waitForRequest((request) => {
    const isVideo = request.url().includes("youtube.com/videoplayback");

    if (isVideo) {
      cookiesStr = request.headers().cookie;
    }

    return isVideo;
  });

  console.log("navegando para o video");
  await page.goto(videoURL);
  console.log("navegado, carregando video");
  await cookiePromise;

  const url = page.url();
  console.log("url", url);

  const videoId = new URL(videoURL).searchParams.get("v");
  console.log("video id", videoId);

  const idToken = await page.evaluate<string>(() =>
    (window as any).ytcfg.get("ID_TOKEN")
  );
  console.log("ID_TOKEN", idToken);

  browser.close();

  return {
    url: videoURL,
    id: videoId,
    downloadCookiesString: cookiesStr,
    idToken,
  };
}

type CookieType = "auth" | "download";
async function getCookies(which: CookieType) {
  if (fs.existsSync(getCookieFilePath(which))) {
    return JSON.parse(
      fs.readFileSync(getCookieFilePath(which), "utf-8")
    ) as Cookie[];
  }

  return [];
}

async function setCookies(which: CookieType, cookies: Cookie[]) {
  console.log("saving cookies");
  fs.writeFileSync(getCookieFilePath(which), JSON.stringify(cookies), {
    encoding: "utf-8",
  });
}

async function goToYoutube(page: Page) {
  await page.goto("https://www.youtube.com/");

  await consentIfNeeded(page);

  const state = await Promise.race([
    page
      .waitForSelector('a[href*="accounts.google.com/ServiceLogin"]')
      .then(identity("signed-out" as const)),
    page
      .waitForSelector("#avatar-btn img")
      .then(identity("signed-in" as const)),
  ]);

  if (state === "signed-out") {
    console.log("not logged in");
    await page.click('a[href*="accounts.google.com/ServiceLogin"]');
    await signIn(page);
  }
}

async function consentIfNeeded(page: Page) {
  const consentingBtn = await page.$(
    'form[action*="consent.youtube.com"] button'
  );

  if (!consentingBtn) {
    console.log("no consent needed");
    return;
  }

  console.log("consenting");
  await page.click('form[action*="consent.youtube.com"] button');
  console.log("consenting done");
}

async function goToVideo(page: Page, url?: string) {
  console.log("navigating to", url);
  await page.goto(url);

  const status = await Promise.race([
    page
      .waitForSelector('form[action*="consent.youtube.com"] button')
      .then(identity("consent" as const)),
    page
      .waitForSelector("#alerts #container.WARNING")
      .then(identity("error" as const)),
    page
      .waitForSelector("#secondary #related #items")
      .then(identity("video" as const)),
  ]);

  console.log("ended up in", status);

  if (status === "consent") {
    console.log("consenting");
    await page.click('form[action*="consent.youtube.com"] button');
    console.log("retrying");
    return goToVideo(page, url);
  }

  if (status === "error") {
    console.log(
      "error",
      await page.textContent("#alerts #container.WARNING yt-formatted-string")
    );

    await page.click(
      "#player-container-outer + yt-playability-error-supported-renderers paper-button#button"
    );

    console.log("sign in");
    await signIn(page);
  }
}

async function signIn(
  page: Page,
  selectorToWaitFor: string = "#container.ytd-masthead"
) {
  const minutes = DEFAULT_TIMEOUT / 60000;
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
  console.log(`você tem ${minutes} minutos para fazer login`);
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

  await page.waitForSelector(selectorToWaitFor);
  console.log("logado :)");

  setCookies("auth", await page.context().cookies());
}

function identity<T>(arg: T): () => T {
  return () => arg;
}
