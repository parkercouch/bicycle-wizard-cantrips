(async () => {
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
 * Add buttons above notes for common snippets of text
 */
function inject_snippets_buttons() {
  const note_text_area = document.querySelector("#noteTextArea");
  const notes_container = note_text_area.parentNode;
  const internal_notes_container = document.querySelector("#workorder_status_wrapper > div.view_field_box > div:nth-child(2)");
  const notes_label = document.querySelector("#workorder_status_wrapper > div.view_field_box > div.view_field_box > label");
  notes_label.style.setProperty("width", "10rem");
  notes_label.style.setProperty("display", "inline-flex");

  const internal_notes_button = document.createElement("button");
  notes_container.insertBefore(internal_notes_button, note_text_area);
  internal_notes_button.outerHTML = `
    <button id="internal_notes_button" type="button" class="snippets-button" style="margin-bottom: 2px; margin-right: 5rem; height: 1.25rem; font-size: small;">
      <span>TOGGLE</span>
    </button>
  `;

  const toggle_button = document.getElementById("internal_notes_button");
  toggle_button.onclick = function () {
    toggle_color(internal_notes_button);
    toggle_display(internal_notes_container);
  };

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

function toggle_display(element) {
  element.style.display = element.style.display === "none" ? null : "none";
}
function toggle_color(element) {
  element.style.color = element.style.color === "grey" ? "black" : "grey";
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
