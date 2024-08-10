chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    lightspeed_module_enabled: true
  });
  chrome.action.setBadgeText({
    text: "on",
  });
});
