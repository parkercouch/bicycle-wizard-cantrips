(async () => {
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled", "lightspeed_account_number"]);
  if (!current_state.lightspeed_module_enabled) {
    return;
  }

  const synced_settings = await chrome.storage.sync.get(["lightspeed_account_number"]);
  if (synced_settings.lightspeed_account_number == undefined) {
    return;
  }

  inject_print_tag_buttons(synced_settings.lightspeed_account_number);
})();

function inject_print_tag_buttons(account_number) {
  let list_id = 0;

  while (!!document.getElementById(`listing_r_${list_id}`)) {
    const edit_workorder_button = document.querySelector(`#listing_r_${list_id} > td.lf > a`);
    const workorder_number = document.querySelector(`#cellWorkordersDueID_${list_id}`).textContent.trim();

    const print_button = edit_workorder_button.cloneNode();
    print_button.removeAttribute("onclick");

    edit_workorder_button.after(print_button);

    print_button.outerHTML = `
    <a title="Print Tag" name="print_tag" onclick="window.merchantos.print.printUrl({ url: '/API/Account/${account_number}/DisplayTemplate/Workorder/${workorder_number}.html?template=WorkorderReceipt&#38;print=true&#38;type=shop-tag', target: '_blank', pageType: 'receipt', isHubPrintable: false });">
      <i class="icon-print"></i>
    </a>
    `;

    list_id++;
  }
}
