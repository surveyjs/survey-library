import { settings } from "../../src/settings";
import { getNewIconName, getCustomNewIconNameIfExists, getIconNameFromProxy, createSvg } from "../../src/utils/icons";

import { describe, test, expect } from "vitest";
describe("UtilsSVGIconsTests", () => {
  test("support old icon names in surveyjs codebase for backward compatibility", () => {
    const oldIconName = "icon-changecamera"; // see renamedIcons dictionary
    const newIconName = "icon-flip-24x24";

    expect(getNewIconName(newIconName), "newName didn't transform").toLooseEqual(newIconName);
    expect(getNewIconName(oldIconName), "oldName transformed to newName").toLooseEqual(newIconName);
  });

  test("check settings.customIcons for built-in icons swap", () => {
    const originalIconName = "icon-arrowdown-24x24";
    const builtInIconName = "icon-arrowleft-24x24";
    const customIconName = "icon-arrowright-24x24";

    settings.customIcons[builtInIconName] = customIconName;

    expect(getCustomNewIconNameIfExists(originalIconName), "this icon doesn't have a custom name").toLooseEqual(null);
    expect(getCustomNewIconNameIfExists(builtInIconName), "returns custom name").toLooseEqual(customIconName);

    delete settings.customIcons[builtInIconName];
  });

  test("check settings.customIcons for built-in icons swap: support old custom names", () => {
    const builtInIconNameOld = "icon-arrow-left";
    const customIconNameOld = "icon-arrow-right";
    const customIconNameNew = "icon-arrowright-24x24";

    settings.customIcons[builtInIconNameOld] = customIconNameOld;

    expect(getCustomNewIconNameIfExists(builtInIconNameOld), "returns custom name and transformed to new").toLooseEqual(customIconNameNew);

    delete settings.customIcons[builtInIconNameOld];
  });

  test("check getIconNameFromProxy: old name without customIcon", () => {
    const oldIconName = "icon-changecamera";
    const newIconName = "icon-flip-24x24";
    expect(getIconNameFromProxy(oldIconName), "returns new name").toLooseEqual(newIconName);
  });

  test("Use proxy to get icons in svg, function getIconNameFromProxy", () => {
    const oldIconName = "icon-changecamera";
    const newIconName = "icon-flip-24x24";

    settings.customIcons[oldIconName] = newIconName;
    expect(getIconNameFromProxy(oldIconName)).toLooseEqual(newIconName);
    expect(getIconNameFromProxy(newIconName)).toLooseEqual(newIconName);
    delete settings.customIcons[oldIconName];
  });

  test("Support old customIcons names in svg, function getIconNameFromProxy", () => {
    const oldIconName = "icon-changecamera";
    const newIconName = "icon-flip-24x24";

    const oldIconNameToSwap = "icon-closecamera";
    const newIconNameToSwap = "icon-close-24x24";

    settings.customIcons[oldIconName] = oldIconNameToSwap;
    expect(getIconNameFromProxy(oldIconName)).toLooseEqual(newIconNameToSwap);
    expect(getIconNameFromProxy(newIconName)).toLooseEqual(newIconName);
    delete settings.customIcons[oldIconName];
  });

  test("utils: createSvg", () => {
    var element: HTMLSpanElement = document.createElement("svg");
    element.innerHTML = "<use></use>";
    document.body.appendChild(element);
    createSvg(16, 0, 0, "icon-test", element, "titletext");
    expect(element.querySelector("use")?.getAttribute("xlink:href")).toLooseEqual("#icon-test");
    expect(element.querySelectorAll("title").length).toLooseEqual(1);
    expect(element.querySelector("title")?.innerHTML).toLooseEqual("titletext");

    createSvg(16, 0, 0, "icon-test", element, "titletext2");
    expect(element.querySelector("use")?.getAttribute("xlink:href")).toLooseEqual("#icon-test");
    expect(element.querySelectorAll("title").length).toLooseEqual(1);
    expect(element.querySelector("title")?.innerHTML).toLooseEqual("titletext2");

    element.remove();
  });
});
