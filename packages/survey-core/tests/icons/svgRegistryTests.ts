import { settings, ISurveyEnvironment } from "../../src/settings";
import { SvgIconRegistry } from "../../src/svgbundle";
export default QUnit.module("SvgRegistryTests");

QUnit.test("svg import from raw symbol", function (assert) {
  let svg = new SvgIconRegistry();
  svg.registerIconFromSymbol("a", "<symbol id=\"icon-a\"><circle/></symbol>");
  svg.registerIconFromSymbol("b", "<symbol id=\"icon-b\"><line/></symbol>");

  assert.equal(svg.iconsRenderedHtml(), "<symbol id=\"icon-a\"><circle/></symbol><symbol id=\"icon-b\"><line/></symbol>");
});

QUnit.test("svg import from svg via element", function (assert) {
  let svg = new SvgIconRegistry();
  svg.registerIconFromSvgViaElement("a", "<svg viewBox=\"0 0 100 100\"><circle/></symbol>");
  assert.equal(svg.iconsRenderedHtml(), "<symbol viewBox=\"0 0 100 100\" id=\"icon-a\"><circle></circle></symbol>");
});

QUnit.test("svg import from svg via string", function (assert) {
  let svg = new SvgIconRegistry();
  let res = svg.registerIconFromSvg("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
  assert.ok(res);
  assert.equal(svg.iconsRenderedHtml(), "<symbol id=\"icon-a\" viewBox=\"0 0 100 100\"><circle/></symbol>");
});

QUnit.test("svg import custom prefix via element", function (assert) {
  let svg = new SvgIconRegistry();
  svg.registerIconFromSvgViaElement("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>", "sprite-");
  assert.equal(svg.iconsRenderedHtml(), "<symbol viewBox=\"0 0 100 100\" id=\"sprite-a\"><circle></circle></symbol>");
});

QUnit.test("svg import custom prefix via string", function (assert) {
  let svg = new SvgIconRegistry();
  let res = svg.registerIconFromSvg("a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>", "sprite-");
  assert.ok(res);
  assert.equal(svg.iconsRenderedHtml(), "<symbol id=\"sprite-a\" viewBox=\"0 0 100 100\"><circle/></symbol>");
});

QUnit.test("svg import in the custom environment", function (assert) {
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
  assert.equal(svg.iconsRenderedHtml(), "<symbol viewBox=\"0 0 100 100\" id=\"sprite-a\"><circle></circle></symbol>");

  svgMountContainer.remove();
  shadowRootWrapper.remove();

  settings.environment = {
    ...settings.environment,
    root: document,
    rootElement: document.body,
    svgMountContainer: document.head
  };
});

QUnit.test("svg import from svg via element - use prefix", function (assert) {
  let svg = new SvgIconRegistry();
  svg.registerIconFromSvgViaElement("icon-a", "<svg viewBox=\"0 0 100 100\"><circle/></symbol>");
  assert.equal(svg.iconsRenderedHtml(), "<symbol viewBox=\"0 0 100 100\" id=\"icon-a\"><circle></circle></symbol>");
});

QUnit.test("svg import from svg via string - use prefix", function (assert) {
  let svg = new SvgIconRegistry();
  let res = svg.registerIconFromSvg("icon-a", "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
  assert.ok(res);
  assert.equal(svg.iconsRenderedHtml(), "<symbol id=\"icon-a\" viewBox=\"0 0 100 100\"><circle/></symbol>");
});

QUnit.test("check that user's svgs with old name will be supported after icons renaming", function (assert) {
  const oldIconName = "icon-changecamera"; // see renamedIcons dictionary
  const newIconName = "icon-flip-24x24";

  let svg = new SvgIconRegistry();
  let res = svg.registerIconFromSvg(oldIconName, "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
  assert.ok(res);
  assert.equal(svg.iconsRenderedHtml(), `<symbol id="${newIconName}" viewBox="0 0 100 100"><circle/></symbol>`);
});

QUnit.test("check that user's svgs with old name will be supported after icons renaming: whithout 'icon-' prefix", function (assert) {
  const oldIconName = "changecamera"; // see renamedIcons dictionary
  const newIconName = "flip-24x24";

  let svg = new SvgIconRegistry();
  let res = svg.registerIconFromSvg(oldIconName, "<svg viewBox=\"0 0 100 100\"><circle/></svg>");
  assert.ok(res);
  assert.equal(svg.iconsRenderedHtml(), `<symbol id="icon-${newIconName}" viewBox="0 0 100 100"><circle/></symbol>`);
});
