import prettyBytes from "pretty-bytes";
import fs from "fs";
import path from "path";
import ytdl from "ytdl-core";

export function downloadVideo(
  videoId: string,
  cookieString: string,
  idToken: string,
  output: string
) {
  return new Promise((resolve) => {
    const requestOptions = {
      headers: {
        cookie: cookieString,
        // Optional. If not given, ytdl-core will try to find it.
        // You can find this by going to a video's watch page, viewing the source,
        // and searching for "ID_TOKEN".
        "x-youtube-identity-token": idToken,
      },
    };
    ytdl
      .getInfo(videoId, { requestOptions })
      .then((info) => {
        console.log("title:", info.videoDetails.title);
        console.log("rating:", info.player_response.videoDetails.averageRating);
        console.log("uploaded by:", info.videoDetails.author.name);

        const formats = info.formats;
        const format = ytdl.chooseFormat(formats, {
          quality: 18,
        });
        console.log("format:", format.qualityLabel);

        return downloadWithRetry(
          () => ytdl(videoId, { format, requestOptions }),
          output
        );
      })
      .then(resolve);
  });
}

// -----

async function downloadWithRetry(getVideo: () => any, output: string) {
  try {
    return download(getVideo(), output);
  } catch (error) {
    console.log("retrying");
    return downloadWithRetry(getVideo(), output);
  }
}

function download(video: any, output: string) {
  return new Promise((resolve, reject) => {
    const outputName = output;
    const outputDir = process.cwd();
    console.log("baixando", outputName, "em", outputDir);
    const outputPath = path.resolve(outputDir, outputName);
    // const video = ytdl(videoID, { requestOptions });

    let lastPrintTime: null | number = null;
    const PRINT_EVERY = 5000; /* 5 seconds */

    video.on("progress", (chunkLength, downloaded, total) => {
      const percent = downloaded / total;
      const now = +new Date();
      if (lastPrintTime === null || now > lastPrintTime + PRINT_EVERY) {
        lastPrintTime = +new Date();

        const downloadedPretty = prettyBytes(downloaded);
        const totalPretty = prettyBytes(total);
        console.log(
          "baixando:",
          `${(percent * 100).toFixed(
            1
          )}% [${downloadedPretty} / ${totalPretty}]`
        );
      }
    });

    video.on("error", (error) => {
      console.log("Erro:", error);
      console.log("");
      console.log("");
      console.log("Tentando novamente");
      reject();
    });

    video.on("end", () => {
      console.log("video salvo em", outputPath);
      resolve(undefined);
    });

    video.pipe(fs.createWriteStream(outputPath));
  });
}
