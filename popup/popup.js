const toggle_lightspeed_button = document.querySelector("#toggle_lightspeed_button");

toggle_lightspeed_button.onclick = async function () {
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled"]);
  chrome.storage.local.set({ lightspeed_module_enabled: !current_state.lightspeed_module_enabled});
  chrome.action.setBadgeText({
    text: current_state.lightspeed_module_enabled ? "off" : "on",
  });
}
