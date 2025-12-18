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
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled"]);
  if (!current_state.lightspeed_module_enabled) {
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
