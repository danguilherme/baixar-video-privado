#!/usr/bin/env node --max_old_space_size=8192
import { getCookiesAndDownloadVideo } from "./pw";

const [runner, executable, ...args] = process.argv;
const [videoUrl, outputName] = args;

if (!videoUrl) {
  console.log("");
  console.log("Passe a URL do video que quer baixar.");
  process.exit(0);
}

console.log("carregando...");
getCookiesAndDownloadVideo(videoUrl, outputName).then(
  () => console.log("fim"),
  (error) => console.error("Erro: " + error.message)
);
