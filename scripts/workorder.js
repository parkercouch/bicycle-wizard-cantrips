(async () => {
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled"]);
  if (!current_state.lightspeed_module_enabled) {
    return;
  }

  inject_ui_toggle_buttons();
  format_notes_boxes();
  copy_workorder_info_to_topbar();
})();

/**
  * Move notes into a single column and make the default size larger
  */
function format_notes_boxes() {
  const notes_container = document.querySelector("div.view_field_box:has(label[for=note])");
  const notes_boxes = document.querySelectorAll("#workorder_status_wrapper > div.view_field_box > *");
  const note_text_area = document.querySelector("#noteTextArea");
  const hook_in = document.querySelector("#hookInInputField");
  const hook_out = document.querySelector("#hookOutInputField");

  hook_in.style.setProperty("width", "8rem");
  hook_out.style.setProperty("width", "8rem");

  notes_container.style["flex-flow"] = "column";
  for (let i = 0; i < notes_boxes.length; i++) {
    notes_boxes[i].style.setProperty("flex", "1 1 100%");
    notes_boxes[i].style.setProperty("width", "-webkit-fill-available");
  }
  note_text_area.style.setProperty("height", "15rem");
  note_text_area.style.setProperty("font-size", "medium");
}

/**
  * Copy verbose presentation of needed data into condensed form on topbar
  */
function copy_workorder_info_to_topbar() {
  const topbar_breadcrumbs = document.querySelector("#wrapper > div.js-topbar > div > div.cr-topbar__breadcrumbs");
  const topbar = document.querySelector("#wrapper > div.js-topbar > div");

  const bike_description = document.querySelector("#serial_description").value;
  const bike_color = document.querySelector("#serial_color").value;
  const bike_size = document.querySelector("#serial_size").value;

  topbar_breadcrumbs.style.setProperty("padding-right", "1rem");

  const topbar_info_container = topbar_breadcrumbs.cloneNode();
  topbar_info_container.innerHTML = `
    <p>${bike_description}: ${bike_color}, ${bike_size}</p>
  `;

  const due_date = document.querySelector("#workorder_edit_time_out_field_date").value;
  const hook_in = document.querySelector("#hookInInputField").value;
  const hook_out = document.querySelector("#hookOutInputField").value;

  const topbar_dates_container = topbar_breadcrumbs.cloneNode();
  topbar_dates_container.style.setProperty("flex-flow", "column");
  topbar_dates_container.innerHTML = `
    <div style="margin: 0; padding: 0;">DUE: ${due_date}</div>
    <div style="margin: 0; padding: 0;">In: ${hook_in}, Out: ${hook_out}</div>
  `;

  topbar.appendChild(topbar_info_container);
  topbar.appendChild(topbar_dates_container);
}

/**
  * Add buttons that modify the ui
  */
function inject_ui_toggle_buttons() {
  const topbar = document.querySelector("#wrapper > div.js-topbar > div");
  const topbar_toggler = document.querySelector("#wrapper > div.js-topbar > div > div:nth-child(1)");
  const topbar_breadcrumbs = document.querySelector("#wrapper > div.js-topbar > div > div.cr-topbar__breadcrumbs");

  const customer_info = document.querySelector("div.workorder-customer");
  const bike_description_row = document.querySelector("#workorder_status_wrapper > fieldset:nth-child(3)");
  const employee_row = document.querySelector("#workorder_status_wrapper > fieldset.workorder-employee");
  const button_row = document.querySelector("#view > div > div.functions");
  const workorder_dates_row = document.querySelector("#workorder_status_wrapper > fieldset.workorder-dates");
  const internal_notes_container = document.querySelector("#workorder_status_wrapper > div.view_field_box > div:nth-child(2)");

  const toggle_buttons = topbar_toggler.cloneNode();
  toggle_buttons.style.setProperty("width", "2rem");
  toggle_buttons.classList.replace("cr-topbar__toggler", "ui_toggler");
  toggle_buttons.innerHTML = `
    <button type="button" style="color: grey; font-size: medium">
      <span style="display: block;">UI</span>
    </button>
    <button type="button" style="color: grey; font-size: medium">
      <span style="display: block;">IN</span>
    </button>
  `;

  const ui_button = toggle_buttons.childNodes[1];
  const internal_notes_button = toggle_buttons.childNodes[3];

  ui_button.onclick = function () {
    toggle_color(ui_button);
    toggle_display(customer_info);
    toggle_display(bike_description_row);
    toggle_display(employee_row);
    toggle_display(button_row);
    toggle_display(workorder_dates_row);
  };
  internal_notes_button.onclick = function () {
    toggle_color(internal_notes_button);
    toggle_display(internal_notes_container);
  };

  topbar.insertBefore(toggle_buttons, topbar_breadcrumbs);
}

function toggle_display(element) {
  element.style.display = element.style.display === "none" ? null : "none";
}
function toggle_color(element) {
  element.style.color = element.style.color === "grey" ? "black" : "grey";
}
