#!/usr/bin/env node --max_old_space_size=8192 node_modules/ts-node/dist/bin.js

const [runner, executable, ...args] = process.argv;
const [videoUrl] = args;

if (!videoUrl) {
  console.log("");
  console.log("Passe a URL do video que quer baixar.");
  process.exit(0);
}

require("./pw")
  .getCookiesAndDownloadVideo(videoUrl)
  .then(
    () => console.log("fim"),
    (error) => console.error("Erro: " + error.message)
  );
