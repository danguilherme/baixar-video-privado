"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
// To get your YouTube cookie
// - navigate to YouTube in a web browser
// - open up dev tools (opt+cmd+j on mac)
// - go to the network tab
// - click on a request on the left
// - scroll down to "Request Headers"
// - find the "cookie" header and copy its entire contents
var COOKIE = "SID=8QeDudLSXZ5371PnLbcb3deP1HbTz59xOBqWvsJ1gMcy5Y6YAV7Fu42DUSEQlOcHvkkoTw.; __Secure-3PSID=8QeDudLSXZ5371PnLbcb3deP1HbTz59xOBqWvsJ1gMcy5Y6YL0Yg6_hUB8133QDGaPyUeg.; HSID=AgurDzszE7qm8SBte; SSID=AJHxKVM5CweER7vfv; APISID=5eBP_oAhSlH0AfN8/AqJ-3j885mIt5fDFC; SAPISID=dJUc-SjiKrWH0PNF/A71GYH5ubi0oDmT1u; __Secure-3PAPISID=dJUc-SjiKrWH0PNF/A71GYH5ubi0oDmT1u; YSC=v98hlFdLvlM; LOGIN_INFO=AFmmF2swRAIgTJMOIZNzey1nyOzspYjTQ0dCVKCz3AVOl5QzJjz1zK4CIGT5CaKegcPS9-yoR-TcnM13E4IQ3EU6SfkDhh0ggLo3:QUQ3MjNmekhBakU2aEZXamN5Nmh3b0hzRVh0M1Nsc1ZKY0plWFduelQ1WDI5a19KVlZDWlFCUGZxX1NpNExicUJCd1RGanlQQVJGZmU1QU9KbWN2WV9pbElUSzBLNUItazZ5SW9FQ3FvRU9KU1BIaW1XYjZIaUFqeE56cnh2SG9mNEhoYXowM1JmVVY1UlRnYlFsTDhPQmhVd1VKYV9jZ09R; VISITOR_INFO1_LIVE=_ixD7x4ZTs8; SIDCC=AJi4QfFrjMyLzPFXKBaUha3pE0r4c5UWfpoTeqVqmkG_HJSNDjbvPgW7d50Zo8XoXjxFOVAgLA; __Secure-3PSIDCC=AJi4QfENWX_m54566C1vSizZNdERsJmyasghmjA40igoNmgK5-GIUeZ8OP4eFw6Sf4WLilF5IA;";
var videoID = "xWbzTQ-Wt3A";
var requestOptions = {
    headers: {
        cookie: COOKIE,
        // Optional. If not given, ytdl-core will try to find it.
        // You can find this by going to a video's watch page, viewing the source,
        // and searching for "ID_TOKEN".
        // 'x-youtube-identity-token': "QUFFLUhqbHFidlEwMUk5QWQwYnVPS2lKeGhiSVd0OXozQXw=",
    },
};
ytdl_core_1.default.getInfo(videoID, { requestOptions: requestOptions }).then(function (info) {
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
    var formats = info.formats;
    var format = ytdl_core_1.default.chooseFormat(formats, {
        quality: 18,
    });
    console.log("format", format.qualityLabel);
    // const video = ytdl(videoID, { format, requestOptions });
    // download(video);
    downloadWithRetry(function () { return ytdl_core_1.default(videoID, { format: format, requestOptions: requestOptions }); });
});
// -----
function downloadWithRetry(getVideo) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                download(getVideo());
            }
            catch (error) {
                console.log("retrying");
                downloadWithRetry(getVideo());
            }
            return [2 /*return*/];
        });
    });
}
function download(video) {
    return new Promise(function (resolve, reject) {
        var outputName = "video.mp4";
        var outputPath = path_1.default.resolve(__dirname, outputName);
        // const video = ytdl(videoID, { requestOptions });
        video.on("info", function (info, format) {
            console.log("title:", info.videoDetails.title);
            console.log("rating:", info.player_response.videoDetails.averageRating);
            console.log("uploaded by:", info.videoDetails.author.name);
            console.log("quality:", format.itag, format.qualityLabel);
        });
        video.on("progress", function (chunkLength, downloaded, total) {
            var percent = downloaded / total;
            console.log("downloading", (percent * 100).toFixed(1) + "%");
        });
        video.on("error", function (error) {
            console.log("error", error);
            console.log("retrying");
            reject();
        });
        video.on("end", function () {
            console.log("saved to", outputName);
            resolve(undefined);
        });
        video.pipe(fs_1.default.createWriteStream(outputPath));
    });
}
