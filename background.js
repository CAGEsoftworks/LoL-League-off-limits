const strictKeywords = [
  "riotgames.com", "leagueoflegends.com", "playvalorant.com", 
  "2xko.com", "vanguard", "riotclient"
];

function handleRiotDetection(downloadId, matchReason) {
  if (downloadId) {
    chrome.downloads.cancel(downloadId, () => {
      console.log(`[Blocked] Cancelled download ID ${downloadId} via: ${matchReason}`);
    });
  }

  // Increment temptation counter in storage
  chrome.storage.local.get({ temptationCount: 0 }, (data) => {
    const newCount = data.temptationCount + 1;
    chrome.storage.local.set({ temptationCount: newCount }, () => {
      chrome.tabs.create({
        url: chrome.runtime.getURL("survey.html"),
        active: true
      });
    });
  });
}

// 1. Intercept direct download attempts
chrome.downloads.onCreated.addListener((downloadItem) => {
  const url = (downloadItem.url || "").toLowerCase();
  const finalUrl = (downloadItem.finalUrl || "").toLowerCase();
  const filename = (downloadItem.filename || "").toLowerCase();

  const matchFound = strictKeywords.some(keyword => 
    url.includes(keyword) || finalUrl.includes(keyword) || filename.includes(keyword)
  );

  if (
    matchFound || 
    filename.startsWith("install league") || 
    filename.startsWith("install valorant") || 
    filename.startsWith("install 2xko") || 
    filename.startsWith("install_2xko")
  ) {
    handleRiotDetection(downloadItem.id, "Initial ecosystem filter match");
  }
});

// 2. Intercept dynamic downloads when filename settles
chrome.downloads.onChanged.addListener((delta) => {
  if (delta.filename && delta.filename.current) {
    const currentFilename = delta.filename.current.toLowerCase();

    if (
      currentFilename.includes("install league") || 
      currentFilename.includes("league of legends") || 
      currentFilename.includes("valorant") || 
      currentFilename.includes("vanguard") || 
      currentFilename.includes("riotclient") ||
      currentFilename.includes("2xko") ||
      currentFilename.includes("projectl")
    ) {
      handleRiotDetection(delta.id, "Dynamic ecosystem filename match");
    }
  }
});

// 3. Purge all open Riot tabs when survey completes
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "closeRiotTabs") {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (!tab.url) return;
        const cleanUrl = tab.url.toLowerCase();
        
        const isRiotTab = strictKeywords.some(keyword => cleanUrl.includes(keyword));
        if (isRiotTab) {
          chrome.tabs.remove(tab.id);
        }
      });
    });
    sendResponse({ status: "done" });
  }
});