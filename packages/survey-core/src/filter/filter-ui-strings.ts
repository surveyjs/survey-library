// The captions the control's UI adds. Prototype strings, not localized yet: only the captions the
// library already has (clearCaption, selectAllItemText, filterStringPlaceholder, the dialog's Apply
// and Cancel) are. A module of its own, so the toolbars and the field popups both read it without
// importing each other.
export const filterUIStrings = {
  save: "Save",
  filters: "Filters",
  filtersCount: "Filters: {0}",
  dialogTitle: "Filters",
  searchLabel: "Search",
  searchPlaceholder: "Search by {0}",
  showMore: "Show More",
  showLess: "Show Less",
  clearAll: "Clear All",
  addCustomValue: "Add \"{0}\"...",
  removeValue: "Remove",
  presetsTitle: "Filter Presets",
  showResultsCount: "Show {0} items",
  showOneResult: "Show 1 item",
  showResults: "Show results",
  addPresetTitle: "Add New Preset",
  presetName: "Preset Name",
  presetContains: "Contains",
  addField: "Add",
  presetTitleExists: "A preset with this name already exists.",
  presetNoConditions: "Add at least one condition."
};
