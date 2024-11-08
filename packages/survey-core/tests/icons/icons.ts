import { settings } from "../../src/settings";
import { getNewIconName, getCustomNewIconNameIfExists, getIconNameFromProxy, createSvg } from "../../src/utils/utils";

export default QUnit.module("UtilsSVGIconsTests");

QUnit.test(
  "support old icon names in surveyjs codebase for backward compatibility",
  (assert) => {
    const oldIconName = "icon-changecamera"; // see renamedIcons dictionary
    const newIconName = "icon-flip-24x24";

    assert.equal(getNewIconName(newIconName), newIconName, "newName didn't transform");
    assert.equal(getNewIconName(oldIconName), newIconName, "oldName transformed to newName");
  }
);

QUnit.test(
  "check settings.customIcons for built-in icons swap",
  (assert) => {
    const originalIconName = "icon-arrowdown-24x24";
    const builtInIconName = "icon-arrowleft-24x24";
    const customIconName = "icon-arrowright-24x24";

    settings.customIcons[builtInIconName] = customIconName;

    assert.equal(getCustomNewIconNameIfExists(originalIconName), null, "this icon doesn't have a custom name");
    assert.equal(getCustomNewIconNameIfExists(builtInIconName), customIconName, "returns custom name");

    delete settings.customIcons[builtInIconName];
  }
);

QUnit.test(
  "check settings.customIcons for built-in icons swap: support old custom names",
  (assert) => {
    const builtInIconNameOld = "icon-arrow-left";
    const customIconNameOld = "icon-arrow-right";
    const customIconNameNew = "icon-arrowright-24x24";

    settings.customIcons[builtInIconNameOld] = customIconNameOld;

    assert.equal(getCustomNewIconNameIfExists(builtInIconNameOld), customIconNameNew, "returns custom name and transformed to new");

    delete settings.customIcons[builtInIconNameOld];
  }
);

QUnit.test(
  "check getIconNameFromProxy: old name without customIcon",
  (assert) => {
    const oldIconName = "icon-changecamera";
    const newIconName = "icon-flip-24x24";
    assert.equal(getIconNameFromProxy(oldIconName), newIconName, "returns new name");
  }
);

QUnit.test(
  "Use proxy to get icons in svg, function getIconNameFromProxy",
  (assert) => {
    const oldIconName = "icon-changecamera";
    const newIconName = "icon-flip-24x24";

    settings.customIcons[oldIconName] = newIconName;
    assert.equal(getIconNameFromProxy(oldIconName), newIconName);
    assert.equal(getIconNameFromProxy(newIconName), newIconName);
    delete settings.customIcons[oldIconName];
  }
);

QUnit.test(
  "Support old customIcons names in svg, function getIconNameFromProxy",
  (assert) => {
    const oldIconName = "icon-changecamera";
    const newIconName = "icon-flip-24x24";

    const oldIconNameToSwap = "icon-closecamera";
    const newIconNameToSwap = "icon-close-24x24";

    settings.customIcons[oldIconName] = oldIconNameToSwap;
    assert.equal(getIconNameFromProxy(oldIconName), newIconNameToSwap);
    assert.equal(getIconNameFromProxy(newIconName), newIconName);
    delete settings.customIcons[oldIconName];
  }
);

QUnit.test(
  "utils: createSvg",
  function (assert) {
    var element: HTMLSpanElement = document.createElement("svg");
    element.innerHTML = "<use></use>";
    document.body.appendChild(element);
    createSvg(16, 0, 0, "icon-test", element, "titletext");
    assert.equal(element.querySelector("use")?.getAttribute("xlink:href"), "#icon-test");
    assert.equal(element.querySelectorAll("title").length, 1);
    assert.equal(element.querySelector("title")?.innerHTML, "titletext");

    createSvg(16, 0, 0, "icon-test", element, "titletext2");
    assert.equal(element.querySelector("use")?.getAttribute("xlink:href"), "#icon-test");
    assert.equal(element.querySelectorAll("title").length, 1);
    assert.equal(element.querySelector("title")?.innerHTML, "titletext2");

    element.remove();
  }
);