// The captions the control's UI adds. Prototype strings, not localized yet: only the captions the
// library already has (clearCaption, selectAllItemText, filterStringPlaceholder, the dialog's Apply
// and Cancel) are. A module of its own, so the toolbars and the field popups both read it without
// importing each other.
export const filterUIStrings = {
  save: "Save",
  advanced: "Advanced...",
  filters: "Filters",
  filtersCount: "Filters: {0}",
  dialogTitle: "Filter",
  searchLabel: "Search",
  searchPlaceholder: "Search by {0}",
  rawNote: "This preset has no editable conditions: the first edit starts a new filter.",
  readOnlyNote: "This preset cannot be edited.",
  showMore: "Show More",
  showLess: "Show Less",
  clearAll: "Clear All",
  addCustomValue: "Add \"{0}\"...",
  removeValue: "Remove"
};
