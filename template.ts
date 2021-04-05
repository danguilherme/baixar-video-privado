import ytdl, { videoFormat, videoInfo } from "ytdl-core";
import path from "path";
import fs from "fs";

// To get your YouTube cookie
// - navigate to YouTube in a web browser
// - open up dev tools (opt+cmd+j on mac)
// - go to the network tab
// - click on a request on the left
// - scroll down to "Request Headers"
// - find the "cookie" header and copy its entire contents
const COOKIE =
  "SID=8QeDudLSXZ5371PnLbcb3deP1HbTz59xOBqWvsJ1gMcy5Y6YAV7Fu42DUSEQlOcHvkkoTw.; __Secure-3PSID=8QeDudLSXZ5371PnLbcb3deP1HbTz59xOBqWvsJ1gMcy5Y6YL0Yg6_hUB8133QDGaPyUeg.; HSID=AgurDzszE7qm8SBte; SSID=AJHxKVM5CweER7vfv; APISID=5eBP_oAhSlH0AfN8/AqJ-3j885mIt5fDFC; SAPISID=dJUc-SjiKrWH0PNF/A71GYH5ubi0oDmT1u; __Secure-3PAPISID=dJUc-SjiKrWH0PNF/A71GYH5ubi0oDmT1u; YSC=v98hlFdLvlM; LOGIN_INFO=AFmmF2swRAIgTJMOIZNzey1nyOzspYjTQ0dCVKCz3AVOl5QzJjz1zK4CIGT5CaKegcPS9-yoR-TcnM13E4IQ3EU6SfkDhh0ggLo3:QUQ3MjNmekhBakU2aEZXamN5Nmh3b0hzRVh0M1Nsc1ZKY0plWFduelQ1WDI5a19KVlZDWlFCUGZxX1NpNExicUJCd1RGanlQQVJGZmU1QU9KbWN2WV9pbElUSzBLNUItazZ5SW9FQ3FvRU9KU1BIaW1XYjZIaUFqeE56cnh2SG9mNEhoYXowM1JmVVY1UlRnYlFsTDhPQmhVd1VKYV9jZ09R; VISITOR_INFO1_LIVE=_ixD7x4ZTs8; SIDCC=AJi4QfFrjMyLzPFXKBaUha3pE0r4c5UWfpoTeqVqmkG_HJSNDjbvPgW7d50Zo8XoXjxFOVAgLA; __Secure-3PSIDCC=AJi4QfENWX_m54566C1vSizZNdERsJmyasghmjA40igoNmgK5-GIUeZ8OP4eFw6Sf4WLilF5IA;";
const videoID = "xWbzTQ-Wt3A";

const requestOptions = {
  headers: {
    cookie: COOKIE,
    // Optional. If not given, ytdl-core will try to find it.
    // You can find this by going to a video's watch page, viewing the source,
    // and searching for "ID_TOKEN".
    // 'x-youtube-identity-token': "QUFFLUhqbHFidlEwMUk5QWQwYnVPS2lKeGhiSVd0OXozQXw=",
  },
};
ytdl.getInfo(videoID, { requestOptions }).then((info) => {
  console.log("title:", info.videoDetails.title);
  console.log("rating:", info.player_response.videoDetails.averageRating);
  console.log("uploaded by:", info.videoDetails.author.name);
  // const json = JSON.stringify(info, null, 2)
  //   // eslint-disable-next-line max-len
  //   .replace(
  //     /(ip(?:=|%3D|\/))((?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|[0-9a-f]{1,4}(?:(?::|%3A)[0-9a-f]{1,4}){7})/gi,
  //     "$10.0.0.0"
  //   );
  // fs.writeFile("video-info.json", json, (err2) => {
  //   if (err2) throw err2;
  // });

  const formats = info.formats;
  const format = ytdl.chooseFormat(formats, {
    quality: 18,
  });
  console.log("format", format.qualityLabel);
  // const video = ytdl(videoID, { format, requestOptions });
  // download(video);
  downloadWithRetry(() => ytdl(videoID, { format, requestOptions }));
});

// -----

async function downloadWithRetry(getVideo: () => any) {
  try {
    download(getVideo());
  } catch (error) {
    console.log("retrying");
    downloadWithRetry(getVideo());
  }
}

function download(video: any) {
  return new Promise((resolve, reject) => {
    const outputName = "video.mp4";
    const outputPath = path.resolve(__dirname, outputName);
    // const video = ytdl(videoID, { requestOptions });

    video.on("info", (info: videoInfo, format: videoFormat) => {
      console.log("title:", info.videoDetails.title);
      console.log("rating:", info.player_response.videoDetails.averageRating);
      console.log("uploaded by:", info.videoDetails.author.name);
      console.log("quality:", format.itag, format.qualityLabel);
    });

    video.on("progress", (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      console.log("downloading", `${(percent * 100).toFixed(1)}%`);
    });

    video.on("error", (error) => {
      console.log("error", error);
      console.log("retrying");
      reject();
    });

    video.on("end", () => {
      console.log("saved to", outputName);
      resolve(undefined);
    });

    video.pipe(fs.createWriteStream(outputPath));
  });
}
