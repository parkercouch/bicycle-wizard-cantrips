chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    lightspeed_module_enabled: true
  });
  chrome.action.setBadgeText({
    text: "on",
  });
});

chrome.tabs.onUpdated.addListener(async function on_url_update(tabId, changeInfo, _tab) {
  if (!changeInfo.url) {
    return;
  }

  if (changeInfo.url.includes("us.merchantos.com/?name=workbench.views")) {
    await chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ['scripts/workorder.js'],
      }
    );
    return;
  }

  if (changeInfo.url.includes("us.merchantos.com/?name=workbench.listings.workorders_agenda")) {
    await chrome.scripting.executeScript(
      {
        target: { tabId: tabId },
        files: ['scripts/schedule.js'],
      }
    );
    return;
  }
});
