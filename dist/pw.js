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
exports.getCookiesAndDownloadVideo = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var playwright_1 = require("playwright");
var slugify_1 = __importDefault(require("slugify"));
var download_1 = require("./download");
var getBaseFileLocation = function () { return __dirname; };
var getCookieFilePath = function (which) {
    return path_1.default.join(getBaseFileLocation(), which + "-cookies.txt");
};
var DEFAULT_TIMEOUT = 60000 * 5;
// async function main() {
//   getCookiesAndDownloadVideo("https://www.youtube.com/watch?v=xWbzTQ-Wt3A");
// }
// main().catch(console.error);
function getCookiesAndDownloadVideo(videoURL, outputName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, id, downloadCookiesString, idToken;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, getVideoInformation(videoURL)];
                case 1:
                    _a = _b.sent(), id = _a.id, downloadCookiesString = _a.downloadCookiesString, idToken = _a.idToken;
                    console.log("baixando video...");
                    return [2 /*return*/, download_1.downloadVideo(id, downloadCookiesString, idToken, outputName || slugify_1.default(id) + ".mp4")];
            }
        });
    });
}
exports.getCookiesAndDownloadVideo = getCookiesAndDownloadVideo;
function getVideoInformation(videoURL) {
    return __awaiter(this, void 0, void 0, function () {
        var browser, context, _a, _b, page, cookiesStr, cookiePromise, url, videoId, idToken;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, playwright_1.firefox.launch({
                        headless: false,
                    })];
                case 1:
                    browser = _c.sent();
                    return [4 /*yield*/, browser.newContext()];
                case 2:
                    context = _c.sent();
                    _b = (_a = context).addCookies;
                    return [4 /*yield*/, getCookies("auth")];
                case 3: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 4:
                    _c.sent();
                    context.setDefaultTimeout(DEFAULT_TIMEOUT);
                    return [4 /*yield*/, context.newPage()];
                case 5:
                    page = _c.sent();
                    return [4 /*yield*/, goToYoutube(page)];
                case 6:
                    _c.sent();
                    cookiesStr = "";
                    cookiePromise = page.waitForRequest(function (request) {
                        var isVideo = request.url().includes("youtube.com/videoplayback");
                        if (isVideo) {
                            cookiesStr = request.headers().cookie;
                        }
                        return isVideo;
                    });
                    console.log("navegando para o video");
                    return [4 /*yield*/, page.goto(videoURL)];
                case 7:
                    _c.sent();
                    console.log("navegado, carregando video");
                    return [4 /*yield*/, cookiePromise];
                case 8:
                    _c.sent();
                    url = page.url();
                    console.log("url", url);
                    videoId = new URL(videoURL).searchParams.get("v");
                    console.log("video id", videoId);
                    return [4 /*yield*/, page.evaluate(function () {
                            return window.ytcfg.get("ID_TOKEN");
                        })];
                case 9:
                    idToken = _c.sent();
                    console.log("ID_TOKEN", idToken);
                    browser.close();
                    return [2 /*return*/, {
                            url: videoURL,
                            id: videoId,
                            downloadCookiesString: cookiesStr,
                            idToken: idToken,
                        }];
            }
        });
    });
}
function getCookies(which) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (fs_1.default.existsSync(getCookieFilePath(which))) {
                return [2 /*return*/, JSON.parse(fs_1.default.readFileSync(getCookieFilePath(which), "utf-8"))];
            }
            return [2 /*return*/, []];
        });
    });
}
function setCookies(which, cookies) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("saving cookies");
            fs_1.default.writeFileSync(getCookieFilePath(which), JSON.stringify(cookies), {
                encoding: "utf-8",
            });
            return [2 /*return*/];
        });
    });
}
function goToYoutube(page) {
    return __awaiter(this, void 0, void 0, function () {
        var state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.goto("https://www.youtube.com/")];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, consentIfNeeded(page)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.race([
                            page
                                .waitForSelector('a[href*="accounts.google.com/ServiceLogin"]')
                                .then(identity("signed-out")),
                            page
                                .waitForSelector("#avatar-btn img")
                                .then(identity("signed-in")),
                        ])];
                case 3:
                    state = _a.sent();
                    if (!(state === "signed-out")) return [3 /*break*/, 6];
                    console.log("not logged in");
                    return [4 /*yield*/, page.click('a[href*="accounts.google.com/ServiceLogin"]')];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, signIn(page)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function consentIfNeeded(page) {
    return __awaiter(this, void 0, void 0, function () {
        var consentingBtn;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, page.$('form[action*="consent.youtube.com"] button')];
                case 1:
                    consentingBtn = _a.sent();
                    if (!consentingBtn) {
                        console.log("no consent needed");
                        return [2 /*return*/];
                    }
                    console.log("consenting");
                    return [4 /*yield*/, page.click('form[action*="consent.youtube.com"] button')];
                case 2:
                    _a.sent();
                    console.log("consenting done");
                    return [2 /*return*/];
            }
        });
    });
}
function goToVideo(page, url) {
    return __awaiter(this, void 0, void 0, function () {
        var status, _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    console.log("navigating to", url);
                    return [4 /*yield*/, page.goto(url)];
                case 1:
                    _d.sent();
                    return [4 /*yield*/, Promise.race([
                            page
                                .waitForSelector('form[action*="consent.youtube.com"] button')
                                .then(identity("consent")),
                            page
                                .waitForSelector("#alerts #container.WARNING")
                                .then(identity("error")),
                            page
                                .waitForSelector("#secondary #related #items")
                                .then(identity("video")),
                        ])];
                case 2:
                    status = _d.sent();
                    console.log("ended up in", status);
                    if (!(status === "consent")) return [3 /*break*/, 4];
                    console.log("consenting");
                    return [4 /*yield*/, page.click('form[action*="consent.youtube.com"] button')];
                case 3:
                    _d.sent();
                    console.log("retrying");
                    return [2 /*return*/, goToVideo(page, url)];
                case 4:
                    if (!(status === "error")) return [3 /*break*/, 8];
                    _b = (_a = console).log;
                    _c = ["error"];
                    return [4 /*yield*/, page.textContent("#alerts #container.WARNING yt-formatted-string")];
                case 5:
                    _b.apply(_a, _c.concat([_d.sent()]));
                    return [4 /*yield*/, page.click("#player-container-outer + yt-playability-error-supported-renderers paper-button#button")];
                case 6:
                    _d.sent();
                    console.log("sign in");
                    return [4 /*yield*/, signIn(page)];
                case 7:
                    _d.sent();
                    _d.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function signIn(page, selectorToWaitFor) {
    if (selectorToWaitFor === void 0) { selectorToWaitFor = "#container.ytd-masthead"; }
    return __awaiter(this, void 0, void 0, function () {
        var minutes, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    minutes = DEFAULT_TIMEOUT / 60000;
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    console.log("voc\u00EA tem " + minutes + " minutos para fazer login");
                    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                    return [4 /*yield*/, page.waitForSelector(selectorToWaitFor)];
                case 1:
                    _c.sent();
                    console.log("logado :)");
                    _a = setCookies;
                    _b = ["auth"];
                    return [4 /*yield*/, page.context().cookies()];
                case 2:
                    _a.apply(void 0, _b.concat([_c.sent()]));
                    return [2 /*return*/];
            }
        });
    });
}
function identity(arg) {
    return function () { return arg; };
}
