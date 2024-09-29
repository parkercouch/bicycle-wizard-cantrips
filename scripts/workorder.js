(async () => {
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled"]);
  if (!current_state.lightspeed_module_enabled) {
    return;
  }

  inject_ui_toggle_buttons();
  format_notes_boxes();
  inject_snippets_buttons();
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
  const workorder_pagination = document.querySelector("nav.records");

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
    toggle_display(workorder_pagination);

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

/**
 * Add buttons above notes for common snippets of text
 */
function inject_snippets_buttons() {
  const note_text_area = document.querySelector("#noteTextArea");
  const notes_container = note_text_area.parentNode;
  const notes_label = document.querySelector("#workorder_status_wrapper > div.view_field_box > div.view_field_box > label");
  notes_label.style.setProperty("width", "10rem");
  notes_label.style.setProperty("display", "inline-flex");

  const intake_snippet_button = document.createElement("button");
  notes_container.insertBefore(intake_snippet_button, note_text_area);
  intake_snippet_button.outerHTML = `
    <button id="intake-snippet-button" type="button" class="snippets-button" style="margin-bottom: 2px; height: 1.25rem; font-size: small;">
      <span>INTAKE</span>
    </button>
  `;

  const intake_button = document.getElementById("intake-snippet-button");
  intake_button.onclick = function () {
    update_notes(get_intake_snippet_text());
  }


  const quote_snippet_button = document.createElement("button");
  notes_container.insertBefore(quote_snippet_button, note_text_area);
  quote_snippet_button.outerHTML = `
    <button id="quote-snippet-button" type="button" class="snippets-button" style="margin-bottom: 2px; height: 1.25rem; font-size: small;">
      <span>QUOTE</span>
    </button>
  `;

  const quote_button = document.getElementById("quote-snippet-button");
  quote_button.onclick = function () {
    update_notes(get_quote_snippet_text());
  }


  const service_snippet_button = document.createElement("button");
  notes_container.insertBefore(service_snippet_button, note_text_area);
  service_snippet_button.outerHTML = `
    <button id="service-snippet-button" type="button" class="snippets-button" style="margin-bottom: 2px; height: 1.25rem; font-size: small;">
      <span>SERVICE</span>
    </button>
  `;

  const service_button = document.getElementById("service-snippet-button");
  service_button.onclick = function () {
    update_notes(get_service_snippet_text());
  }
}

/**
 * Update notes text area and trigger onchange
 */
function update_notes(new_text) {
  const textArea = document.getElementById("noteTextArea");
  textArea.value = new_text + textArea.value;
  textArea.dispatchEvent(new Event('change'));
}

/**
  * get name from sidebar props
  */
function get_name() {
  const sidebar_info = document.querySelector("body > div.cr-sidebar.no_print");
  /**
   * @type {string}
   */
  const employee_name = JSON.parse(sidebar_info.dataset.reactProps).employeeName;

  return employee_name.split(" ").reduce(function (acc, name, i) {
    if (i === 0) {
      return name;
    }
    if (name == "") {
      return acc + " ";
    }
    return acc + name.slice(0,1);
  }, "") 
}

/**
  * Get date formatted MM/DD
  */
function get_current_date() {
  const today = new Date();
  return `${(today.getMonth() + 1)}`.padStart(2, "0") + "/" + today.getDate();
}

function get_intake_snippet_text() {
  return "===== INTAKE =====\n" +
    "= " + get_current_date() + " (" + get_name() + ") =\n" +
    "[[ REQUESTS ]] : \n" +
    "[[ LAST BIKE SERVICE? ]] : \n" +
    "[[ CUSTOMER PROVIDED PARTS? ]] : \n" +
    "[[ DEPOSIT (Y/N)? ]] : \n" +
    "[[ OTHER ]] : \n";
}

function get_quote_snippet_text() {
  return "===== QUOTE =====\n" +
    "= " + get_current_date() + " (" + get_name() + ") =\n" +
    "[[ REQUESTS ]] : \n" +
    "[[ WHEELS ]] : \n" +
    "[[ BRAKES ]] : \n" +
    "[[ DRIVETRAIN ]] : \n" +
    "[[ CABLE KITS ]] : \n" +
    "[[ BEARINGS ]] : \n" +
    "[[ SUSPENSION ]] : \n" +
    "[[ GRIPS/BAR TAPE ]] : \n" +
    "[[ OTHER ]] : \n";
}

function get_service_snippet_text() {
  return "===== SERVICE =====\n" +
    "= " + get_current_date() + " (" + get_name() + ") =\n" +
    "[[ MECHANIC'S NOTES ]] : \n" +
    "[[ WHEELS ]] : \n" +
    "[[ BRAKES ]] : \n" +
    "[[ DRIVETRAIN ]] : \n" +
    "[[ CABLE KITS ]] : \n" +
    "[[ BEARINGS ]] : \n" +
    "[[ SUSPENSION ]] : \n" +
    "[[ GRIPS/BAR TAPE ]] : \n" +
    "[[ PARTS ALLOWANCE USED? (Y/N) ]] : \n"+
    "[[ RECOMMENDATIONS ]] : \n"+
    "[[ CONTACTED? ]] : \n"+
    "[[ OTHER ]] : \n";
}
