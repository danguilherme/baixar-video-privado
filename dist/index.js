#!/usr/bin/env node --max_old_space_size=8192
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pw_1 = require("./pw");
var _a = process.argv, runner = _a[0], executable = _a[1], args = _a.slice(2);
var videoUrl = args[0], outputName = args[1];
if (!videoUrl) {
    console.log("");
    console.log("Passe a URL do video que quer baixar.");
    process.exit(0);
}
console.log("carregando...");
pw_1.getCookiesAndDownloadVideo(videoUrl, outputName).then(function () { return console.log("fim"); }, function (error) { return console.error("Erro: " + error.message); });
