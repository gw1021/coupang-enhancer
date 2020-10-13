window.onload = () => {
    getOptions();
}

const reloadPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
    });
}

var options = {};
const getOptions = () => {
    chrome.runtime.sendMessage({ msg: "getOptions" }, (res) => {
        document.getElementById("EnableHideCheckBox").checked = res.hideEnabled;
        document.getElementById("EnableRocketCheckBox").checked = res.rocketEnabled;
        options["hideEnabled"] = res.hideEnabled;
        options["rocketEnabled"] = res.rocketEnabled;
    });
}

const setOptions = () => {
    chrome.runtime.sendMessage({ msg: 'setOptions', 'data': options }, (res) => {
        console.log(res);
        if (res) {
            reloadPage();
        }
    })
}

document.addEventListener('change', (evt) => {
    console.log(evt.target);
    if (evt.target == document.getElementById("EnableHideCheckBox")) {
        options["hideEnabled"] = document.getElementById("EnableHideCheckBox").checked;
        setOptions();
    }
    else if (evt.target == document.getElementById("EnableRocketCheckBox")) {
        options["rocketEnabled"] = document.getElementById("EnableRocketCheckBox").checked;
        setOptions();
    }
})