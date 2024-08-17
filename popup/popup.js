const toggle_lightspeed_button = document.querySelector("#toggle_lightspeed_button");

toggle_lightspeed_button.onclick = async function () {
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled"]);
  chrome.storage.local.set({ lightspeed_module_enabled: !current_state.lightspeed_module_enabled});
  chrome.action.setBadgeText({
    text: current_state.lightspeed_module_enabled ? "off" : "on",
  });
}

const settings_form = document.querySelector("#settings");

settings_form.onsubmit = async function (e) {
  e.preventDefault();
  const account_number = document.getElementById("account-number").value;
  console.log(`storing account number: ${account_number}`);
  await chrome.storage.sync.set({ lightspeed_account_number: account_number});
  console.log(`stored account number: ${account_number}`);
  document.getElementById("settings").reset();
}
