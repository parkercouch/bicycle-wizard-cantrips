(async () => {
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled"]);
  if (!current_state.lightspeed_module_enabled) {
    return;
  }

  inject_ui_toggle_buttons();
  format_notes_boxes();
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
  * Copy verbose presentation of needed data into condensed form on customer row
  */
function copy_workorder_info_to_customer_row() {
  const workorder_data = get_workorder_data();
  const functions_row = document.querySelector("#view > div > div.functions");
  const customer_name = document.querySelector("hgroup.workorder-customer-basics");


  const info_bar = functions_row.cloneNode();
  info_bar.removeAttribute("class");
  customer_name.after(info_bar);

  info_bar.outerHTML = `
    <div style="display: flex; flex-flow: row" id="workorder-info-bar">
      <div style="margin: 0.5rem; padding: 0;">
        <h3 style="margin: 0; padding: 0;">${workorder_data.bike_description}: ${workorder_data.bike_color}, ${workorder_data.bike_size}</h3>
        <h4 style="margin: 0; padding: 0;">DUE: ${workorder_data.due_date}</h4>
      </div>
      <div style="margin: 0.5rem; padding: 0;">
        <h3 style="margin: 0; padding: 0;">Hook In: ${workorder_data.hook_in}</h3>
        <h3 style="margin: 0; padding: 0;">Hook Out: ${workorder_data.hook_out}</h3>
      </div>
    </div>
  `;
}

/**
  * scrape data from workorder
  */
function get_workorder_data() {
  return {
    bike_description: document.querySelector("#serial_description").value,
    bike_color: document.querySelector("#serial_color").value,
    bike_size: document.querySelector("#serial_size").value,
    due_date: document.querySelector("#workorder_edit_time_out_field_date").value,
    hook_in: document.querySelector("#hookInInputField").value,
    hook_out: document.querySelector("#hookOutInputField").value,
  };
}

/**
  * Add buttons that modify the ui
  */
function inject_ui_toggle_buttons() {
  const topbar_toggler = document.querySelector("#wrapper > div.js-topbar > div > div:nth-child(1)");
  const topbar = document.querySelector("div.js-topbar");
  const page_wrapper = document.querySelector("#wrapper");

  const customer_info = document.querySelector("div.workorder-customer");
  const customer_buttons = document.querySelector("div.workorder-customer-buttons");
  const customer_contact = document.querySelector("div.workorder-customer-contact");
  const bike_description_row = document.querySelector("#workorder_status_wrapper > fieldset:nth-child(3)");
  const employee_row = document.querySelector("#workorder_status_wrapper > fieldset.workorder-employee");
  const button_row = document.querySelector("#view > div > div.functions");
  const workorder_dates_row = document.querySelector("#workorder_status_wrapper > fieldset.workorder-dates");
  const internal_notes_container = document.querySelector("#workorder_status_wrapper > div.view_field_box > div:nth-child(2)");

  const toggle_buttons = topbar_toggler.cloneNode();
  toggle_buttons.style.setProperty("width", "2rem");
  toggle_buttons.style.setProperty("margin", "5px");
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
    toggle_display(customer_buttons);
    toggle_display(customer_contact);
    toggle_display(bike_description_row);
    toggle_display(employee_row);
    toggle_display(button_row);
    toggle_display(workorder_dates_row);

    toggle_display(topbar);
    page_wrapper.style["padding-top"] = page_wrapper.style["padding-top"] === "0px" ? "54px" : "0px";

    if (!!document.querySelector("#workorder-info-bar")) {
      document.querySelector("#workorder-info-bar").remove();
    } else {
      copy_workorder_info_to_customer_row();
    }
  };
  internal_notes_button.onclick = function () {
    toggle_color(internal_notes_button);
    toggle_display(internal_notes_container);
  };

  customer_info.style.setProperty("display", "flex");
  customer_info.style.setProperty("padding", "5px");

  customer_buttons.after(toggle_buttons);
}

function toggle_display(element) {
  element.style.display = element.style.display === "none" ? null : "none";
}
function toggle_color(element) {
  element.style.color = element.style.color === "grey" ? "black" : "grey";
}
