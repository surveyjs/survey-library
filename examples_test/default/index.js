function init() {
  //disable observer for survey to prevent loop limited exceptions
  Survey.defaultStandardCss.variables.mobileWidth = undefined;
  Survey.StylesManager.applyTheme("default");
}
document.addEventListener("DOMContentLoaded", init);