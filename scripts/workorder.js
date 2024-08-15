(async () => {
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled"]);
  if (!current_state.lightspeed_module_enabled) {
    return;
  }

  inject_toggle_internal_notes_button();
  inject_simple_ui_toggle_button();
  format_notes_boxes();
  copy_workorder_info_to_topbar();
})();

function inject_toggle_internal_notes_button() {
  const internal_notes_container = document.querySelector("#workorder_status_wrapper > div.view_field_box > div:nth-child(2)");
  const workorder_dates_row = document.querySelector("#workorder_status_wrapper > fieldset.workorder-dates");

  const toggle_internal_notes_button = document.createElement("ol");
  toggle_internal_notes_button.innerHTML = `
    <button type="button" style="padding: 0 0.5rem; height: 1.5rem; margin-top: 1.25rem;">
      <span style="display: block;">Toggle Internal Notes</span>
    </button>
  `;
  toggle_internal_notes_button.onclick = function () {
    toggle_display(internal_notes_container);
  };

  workorder_dates_row.append(toggle_internal_notes_button);
}

function format_notes_boxes() {
  const notes_container = document.querySelector("div.view_field_box:has(label[for=note])");
  const notes_boxes = document.querySelectorAll("#workorder_status_wrapper > div.view_field_box > *");
  const note_text_area = document.querySelector("#noteTextArea");

  notes_container.style["flex-flow"] = "column";
  for (let i = 0; i < notes_boxes.length; i++) {
    notes_boxes[i].style.setProperty("flex", "1 1 100%");
    notes_boxes[i].style.setProperty("width", "-webkit-fill-available");
  }
  note_text_area.style.setProperty("height", "15rem");
}

function copy_workorder_info_to_topbar() {
  const topbar_breadcrumbs = document.querySelector("#wrapper > div.js-topbar > div > div.cr-topbar__breadcrumbs");
  const topbar = document.querySelector("#wrapper > div.js-topbar > div");

  const bike_description = document.querySelector("#serial_description").value;
  const bike_color = document.querySelector("#serial_color").value;
  const bike_size = document.querySelector("#serial_size").value;

  const topbar_info_container = topbar_breadcrumbs.cloneNode();
  topbar_info_container.innerHTML = `
    <p>${bike_description}: ${bike_color}, ${bike_size}</p>
  `;

  topbar.appendChild(topbar_info_container);
}

function inject_simple_ui_toggle_button() {
  const topbar = document.querySelector("#wrapper > div.js-topbar > div");
  const topbar_toggler = document.querySelector("#wrapper > div.js-topbar > div > div:nth-child(1)");
  const topbar_breadcrumbs = document.querySelector("#wrapper > div.js-topbar > div > div.cr-topbar__breadcrumbs");

  const customer_info = document.querySelector("div.workorder-customer");
  const bike_description_row = document.querySelector("#workorder_status_wrapper > fieldset:nth-child(3)");
  const employee_row = document.querySelector("#workorder_status_wrapper > fieldset.workorder-employee");
  const button_row = document.querySelector("#view > div > div.functions");

  const toggle_simple_ui_button = topbar_toggler.cloneNode();
  toggle_simple_ui_button.innerHTML = `
    <button type="button" style="">
      <span style="display: block;">UI</span>
    </button>
  `;
  toggle_simple_ui_button.onclick = function () {
    toggle_display(customer_info);
    toggle_display(bike_description_row);
    toggle_display(employee_row);
    toggle_display(button_row);
  };

  topbar.insertBefore(toggle_simple_ui_button, topbar_breadcrumbs);
}

function toggle_display(element) {
  element.style.display = element.style.display === "none" ? null : "none";
}
