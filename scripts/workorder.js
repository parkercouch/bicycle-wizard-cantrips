(async () => {
  const current_state = await chrome.storage.local.get(["lightspeed_module_enabled"]);
  if (!current_state.lightspeed_module_enabled) {
    return;
  }

  const internal_notes_container = document.querySelector("#workorder_status_wrapper > div.view_field_box > div:nth-child(2)");
  const workorder_dates_row = document.querySelector("#workorder_status_wrapper > fieldset.workorder-dates");

  const toggle_internal_notes_button = document.createElement("ol");
  toggle_internal_notes_button.innerHTML = `
    <button type="button" style="padding: 0 0.5rem; height: 1.5rem; margin-top: 1.25rem;">
      <span style="display: block;">Toggle Internal Notes</span>
    </button>
  `;
  toggle_internal_notes_button.onclick = function () {
    internal_notes_container.style.display = internal_notes_container.style.display === "none" ? null : "none";
  };

  workorder_dates_row.append(toggle_internal_notes_button);

  const notes_container = document.querySelector("div.view_field_box:has(label[for=note])");
  const notes_boxes = document.querySelectorAll("#workorder_status_wrapper > div.view_field_box > *");
  const note_text_area = document.querySelector("#noteTextArea");

  notes_container.style["flex-flow"] = "column";
  for (let i = 0; i < notes_boxes.length; i++) {
    notes_boxes[i].style.setProperty("flex", "1 1 100%");
    notes_boxes[i].style.setProperty("width", "-webkit-fill-available");
  }
  note_text_area.style.setProperty("height", "15rem");
})();
