chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({
        skipTime: 10,
        volume: 0.1
    })
});