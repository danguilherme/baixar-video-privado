import ytdl, { videoFormat, videoInfo } from "ytdl-core";
import path from "path";
import fs from "fs";

export function downloadVideo(
  videoId: string,
  cookieString: string,
  idToken: string,
  output: string
) {
  const requestOptions = {
    headers: {
      cookie: cookieString,
      // Optional. If not given, ytdl-core will try to find it.
      // You can find this by going to a video's watch page, viewing the source,
      // and searching for "ID_TOKEN".
      "x-youtube-identity-token": idToken,
    },
  };
  ytdl.getInfo(videoId, { requestOptions }).then((info) => {
    console.log("title:", info.videoDetails.title);
    console.log("rating:", info.player_response.videoDetails.averageRating);
    console.log("uploaded by:", info.videoDetails.author.name);

    const formats = info.formats;
    const format = ytdl.chooseFormat(formats, {
      quality: 18,
    });
    console.log("format:", format.qualityLabel);

    downloadWithRetry(() => ytdl(videoId, { format, requestOptions }), output);
  });
}

// -----

async function downloadWithRetry(getVideo: () => any, output: string) {
  try {
    download(getVideo(), output);
  } catch (error) {
    console.log("retrying");
    downloadWithRetry(getVideo(), output);
  }
}

function download(video: any, output: string) {
  return new Promise((resolve, reject) => {
    const outputName = output;
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
