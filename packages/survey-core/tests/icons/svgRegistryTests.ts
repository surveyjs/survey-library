import { settings, ISurveyEnvironment } from "../../src/settings";
import { SvgIconRegistry } from "../../src/svgbundle";
import { describe, test, expect } from "vitest";
describe("SvgRegistryTests", () => {
  test("svg import from raw symbol", () => {
    let svg = new SvgIconRegistry();
    svg.registerIconFromSymbol("a", "<symbol id=\"icon-a\"><circle/></symbol>");
    svg.registerIconFromSymbol("b", "<symbol id=\"icon-b\"><line/></symbol>");

    expect(svg.iconsRenderedHtml()).toLooseEqual("<symbol id=\"icon-a\"><circle/></symbol><symbol id=\"icon-b\"><line/></symbol>");
  });

  test("svg import from svg via element", () => {
    let svg = new SvgIconRegistry();
    svg.registerIconFromSvgViaElement("a", "<svg viewBox=\"0 0 100 100\"><circle/></symbol>");
    expect(svg.iconsRenderedHtml()).toLooseEqual("<symbol viewBox=\"0 0 100 100\" id=\"icon-a\"><circle></circle></symbol>");
  });

  test("svg import from svg via string", () => {
    let svg = new SvgIconRegistry();
    let res = svg.registerIconFromSvg("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
    expect(res).toBeTruthy();
    expect(svg.iconsRenderedHtml()).toLooseEqual("<symbol id=\"icon-a\" viewBox=\"0 0 100 100\"><circle/></symbol>");
  });

  test("svg import custom prefix via element", () => {
    let svg = new SvgIconRegistry();
    svg.registerIconFromSvgViaElement("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>", "sprite-");
    expect(svg.iconsRenderedHtml()).toLooseEqual("<symbol viewBox=\"0 0 100 100\" id=\"sprite-a\"><circle></circle></symbol>");
  });

  test("svg import custom prefix via string", () => {
    let svg = new SvgIconRegistry();
    let res = svg.registerIconFromSvg("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>", "sprite-");
    expect(res).toBeTruthy();
    expect(svg.iconsRenderedHtml()).toLooseEqual("<symbol id=\"sprite-a\" viewBox=\"0 0 100 100\"><circle/></symbol>");
  });

  test("svg import in the custom environment", () => {
    const shadowRootWrapper = document.createElement("div");
    const shadowRoot = shadowRootWrapper.attachShadow({ mode: "open" });

    const svgMountContainer = document.createElement("div");
    shadowRoot.appendChild(svgMountContainer);

    const environment: ISurveyEnvironment = {
      ...settings.environment,
      root: shadowRoot,
      rootElement: shadowRoot,
      svgMountContainer,
    };

    settings.environment = environment as any;

    let svg = new SvgIconRegistry();
    svg.registerIconFromSvgViaElement("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>", "sprite-");
    expect(svg.iconsRenderedHtml()).toLooseEqual("<symbol viewBox=\"0 0 100 100\" id=\"sprite-a\"><circle></circle></symbol>");

    svgMountContainer.remove();
    shadowRootWrapper.remove();

    settings.environment = {
      ...settings.environment,
      root: document,
      rootElement: document.body,
      svgMountContainer: document.head
    };
  });

  test("svg import from svg via element - use prefix", () => {
    let svg = new SvgIconRegistry();
    svg.registerIconFromSvgViaElement("icon-a", "<svg viewBox=\"0 0 100 100\"><circle/></symbol>");
    expect(svg.iconsRenderedHtml()).toLooseEqual("<symbol viewBox=\"0 0 100 100\" id=\"icon-a\"><circle></circle></symbol>");
  });

  test("svg import from svg via string - use prefix", () => {
    let svg = new SvgIconRegistry();
    let res = svg.registerIconFromSvg("icon-a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
    expect(res).toBeTruthy();
    expect(svg.iconsRenderedHtml()).toLooseEqual("<symbol id=\"icon-a\" viewBox=\"0 0 100 100\"><circle/></symbol>");
  });

  test("check that user's svgs with old name will be supported after icons renaming", () => {
    const oldIconName = "icon-changecamera"; // see renamedIcons dictionary
    const newIconName = "icon-flip-24x24";

    let svg = new SvgIconRegistry();
    let res = svg.registerIconFromSvg(oldIconName, "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
    expect(res).toBeTruthy();
    expect(svg.iconsRenderedHtml()).toLooseEqual(`<symbol id="${newIconName}" viewBox="0 0 100 100"><circle/></symbol>`);
  });

  test("check that user's svgs with old name will be supported after icons renaming: whithout 'icon-' prefix", () => {
    const oldIconName = "changecamera"; // see renamedIcons dictionary
    const newIconName = "flip-24x24";

    let svg = new SvgIconRegistry();
    let res = svg.registerIconFromSvg(oldIconName, "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
    expect(res).toBeTruthy();
    expect(svg.iconsRenderedHtml()).toLooseEqual(`<symbol id="icon-${newIconName}" viewBox="0 0 100 100"><circle/></symbol>`);
  });
});
