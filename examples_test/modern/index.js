function init() {
  //disable observer for survey to prevent loop limited exceptions
  Survey.modernCss.variables.mobileWidth = undefined;
}
document.addEventListener("DOMContentLoaded", init);