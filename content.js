function injectScript(filePath) {
    const script = document.createElement('script');
    script.setAttribute('src', chrome.runtime.getURL(filePath));
    (document.head || document.documentElement).appendChild(script);
}

function sendSettingsToPage(settings) {
    window.postMessage({
        type: "FROM_EXT_HIGHLIGHTER_SETTINGS",
        payload: settings
    }, window.location.origin);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command === 'updateHighlighterSettings') {
        sendSettingsToPage(request.payload);
    }
});

chrome.storage.sync.get(['highlighterEnabled'], (result) => {

    setTimeout(() => {
        sendSettingsToPage({ highlighterEnabled: !!result.highlighterEnabled });
    }, 500);
});

injectScript('injected.js');