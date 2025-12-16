// Icon Management
function updateIcon(tabId, url) {
    if (!url || !url.startsWith('http')) {
        chrome.action.setIcon({ path: "icons/icon16_empty.png", tabId });
        return;
    }

    chrome.storage.local.get(url, (result) => {
        const note = result[url];
        if (note) {
            chrome.action.setIcon({ path: "icons/icon16.png", tabId });
        } else {
            chrome.action.setIcon({ path: "icons/icon16_empty.png", tabId });
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        updateIcon(tabId, tab.url);
    }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
        updateIcon(activeInfo.tabId, tab.url);
    }
});

chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
        // Ideally we should only update the relevant tab, but finding which tab has which URL is async.
        // For simplicity, let's update the active tab if it matches.
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0] && tabs[0].url) {
                updateIcon(tabs[0].id, tabs[0].url);
            }
        });
    }
});

// Context Menu Logic
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "addToWebNote",
        title: chrome.i18n.getMessage("contextMenuTitle"),
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "addToWebNote" && info.selectionText) {
        const url = tab.url;
        if (!url) return;

        chrome.storage.local.get(url, (result) => {
            let note = result[url];
            const newText = info.selectionText;

            if (note) {
                note.content += `\n\n${newText}`;
                note.timestamp = new Date().toISOString();
            } else {
                note = {
                    title: tab.title || "New Note",
                    content: newText,
                    url: url,
                    timestamp: new Date().toISOString()
                };
            }

            chrome.storage.local.set({ [url]: note });
        });
    }
});

