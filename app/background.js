'use strict';

var backgroundOptions;

chrome.webRequest.onBeforeRequest.addListener(
    details => {
        console
        if (backgroundOptions.rocketEnabled) {
            const url = new URL(details.url);
            const params = new URLSearchParams(url.search);
            params.set('filterType', 'rocket_wow');
            params.set('rocketAll', 'true');
            console.log("redirection");
            return {
                redirectUrl: `${url.origin}${url.pathname}?${params}`
            }
        }
        else {
            console.log("none-redirection")
            return { redirectUrl: details.url }
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
                console.log(res);
                if (Object.keys(res).length === 0) {
                    var jsonObj = {};
                    var options = {};

                    options["hideEnabled"] = true;
                    options["rocketEnabled"] = true;

                    jsonObj["options"] = options;
                    backgroundOptions = options;

                    chrome.storage.sync.set(jsonObj, () => {
                        sendResponse(options);
                    });
                } else {
                    sendResponse(res["options"]);
                    backgroundOptions = res["options"];
                }
                console.log(backgroundOptions)
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
            console.log(req.msg);

    }
    return true;
});