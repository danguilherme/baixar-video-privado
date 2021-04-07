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
exports.downloadVideo = void 0;
var cli_progress_1 = __importDefault(require("cli-progress"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var ytdl_core_1 = __importDefault(require("ytdl-core"));
function downloadVideo(videoId, cookieString, idToken, output) {
    return new Promise(function (resolve) {
        var requestOptions = {
            headers: {
                cookie: cookieString,
                // Optional. If not given, ytdl-core will try to find it.
                // You can find this by going to a video's watch page, viewing the source,
                // and searching for "ID_TOKEN".
                "x-youtube-identity-token": idToken,
            },
        };
        ytdl_core_1.default
            .getInfo(videoId, { requestOptions: requestOptions })
            .then(function (info) {
            console.log("title:", info.videoDetails.title);
            console.log("rating:", info.player_response.videoDetails.averageRating);
            console.log("uploaded by:", info.videoDetails.author.name);
            var formats = info.formats;
            var format = ytdl_core_1.default.chooseFormat(formats, {
                quality: 18,
            });
            console.log("format:", format.qualityLabel);
            return downloadWithRetry(function () { return ytdl_core_1.default(videoId, { format: format, requestOptions: requestOptions }); }, output);
        })
            .then(resolve);
    });
}
exports.downloadVideo = downloadVideo;
// -----
function downloadWithRetry(getVideo, output) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                return [2 /*return*/, download(getVideo(), output)];
            }
            catch (error) {
                console.log("retrying");
                return [2 /*return*/, downloadWithRetry(getVideo(), output)];
            }
            return [2 /*return*/];
        });
    });
}
function download(video, output) {
    return new Promise(function (resolve, reject) {
        var outputName = output;
        var outputPath = path_1.default.resolve(__dirname, outputName);
        // const video = ytdl(videoID, { requestOptions });
        var progressBar = null;
        video.on("progress", function (chunkLength, downloaded, total) {
            if (progressBar === null) {
                progressBar = new cli_progress_1.default.SingleBar({
                    format: outputName + " [{bar}] {percentage}% | {value}/{total}",
                    barCompleteChar: "\u2588",
                    barIncompleteChar: "\u2591",
                    hideCursor: true,
                });
                progressBar === null || progressBar === void 0 ? void 0 : progressBar.start(total, 0);
            }
            progressBar.update(downloaded);
            // const percent = downloaded / total;
            // console.log("downloading", `${(percent * 100).toFixed(1)}%`);
        });
        video.on("error", function (error) {
            progressBar.stop();
            progressBar = null;
            console.log("error", error);
            console.log("retrying");
            reject();
        });
        video.on("end", function () {
            progressBar.stop();
            progressBar = null;
            console.log("video salvo em", outputPath);
            resolve(undefined);
        });
        video.pipe(fs_1.default.createWriteStream(outputPath));
    });
}
