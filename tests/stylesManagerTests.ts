import { bootstrapThemeName } from "../src/entries/plugins";
import { StylesManager } from "../src/stylesmanager";
import { Logger } from "../src/utils/utils";

export default QUnit.module("Styles Manager");

function clearStyles() {
  document.querySelectorAll("style").forEach(el => el.parentNode.removeChild(el));
}
function resetTheme() {
  StylesManager.applyTheme("default");
  clearStyles();
}

QUnit.test("Test styles creation order - default", function (assert) {
  clearStyles();
  const logger = new Logger();
  StylesManager.Logger = logger;
  const sm = new StylesManager();
  assert.equal(logger.result, "");
  StylesManager.applyTheme("default");
  assert.equal(logger.result, "->apply theme default completed");
  resetTheme();
});

QUnit.test("Test styles creation order - bootstrap", function (assert) {
  clearStyles();
  const logger = new Logger();
  StylesManager.Logger = logger;
  const sm = new StylesManager();
  assert.equal(logger.result, "");
  assert.equal(bootstrapThemeName, "bootstrap");
  StylesManager.applyTheme("bootstrap");
  assert.equal(logger.result, "->style sheet surveyjs-styles created->style sheet bootstrap.sv_main created->apply theme bootstrap completed");
  resetTheme();
});

QUnit.test("Test styles creation order - bootstrapmaterial", function (assert) {
  clearStyles();
  const logger = new Logger();
  StylesManager.Logger = logger;
  const sm = new StylesManager();
  assert.equal(logger.result, "");
  StylesManager.applyTheme("bootstrapmaterial");
  assert.equal(logger.result, "->style sheet surveyjs-styles created->style sheet bootstrapmaterial.sv_main created->apply theme bootstrapmaterial completed");
  resetTheme();
});

QUnit.test("Test styles creation order - modern", function (assert) {
  clearStyles();
  const logger = new Logger();
  StylesManager.Logger = logger;
  const sm = new StylesManager();
  assert.equal(logger.result, "");
  StylesManager.applyTheme("modern");
  assert.equal(logger.result, "->apply theme modern completed");
  resetTheme();
});