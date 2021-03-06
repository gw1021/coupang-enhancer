'use strict';

var loadFlag = false;
var backgroundOptions;

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        if (loadFlag) {
            if (backgroundOptions.rocketEnabled) {
                const url = new URL(details.url);
                const params = new URLSearchParams(url.search);
                params.set('filterType', 'rocket_wow%2Ccoupang_global');
                params.set('rocketAll', 'true');
                return {
                    redirectUrl: `${url.origin}${url.pathname}?${params}`
                }
            }
            else {
                return { redirectUrl: details.url }
            }
        }
    },
    { urls: ["*://www.coupang.com/np/search*", "*://www.coupang.com/np/categories/*"] },
    ["blocking"]
);

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    var data = req.data;

    switch (req.msg) {
        case 'getOptions':
            chrome.storage.sync.get(["options"], (res) => {
                if (Object.keys(res).length === 0) {
                    var jsonObj = {};
                    var options = {};

                    options["hideEnabled"] = true;
                    options["rocketEnabled"] = true;

                    jsonObj["options"] = options;

                    chrome.storage.sync.set(jsonObj, () => {
                        loadFlag = true;
                        backgroundOptions = options;
                        sendResponse(options);
                    });
                } else {
                    loadFlag = true;
                    backgroundOptions = res["options"];
                    sendResponse(res["options"]);
                }
            });
            break;
        case 'setOptions':
            var jsonObj = {};
            jsonObj["options"] = data;
            chrome.storage.sync.set(jsonObj, () => {
                var error = chrome.runtime.lastError;
                if (error) {
                    sendResponse(false);
                } else {
                    sendResponse(true);
                }

            });
            break;
        default:
            // console.log(req.msg);
            break

    }
    return true;
});