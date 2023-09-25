import { url, initSurvey, frameworks, getSurveyResult } from "../helper";
import { Selector, ClientFunction } from "testcafe";

const title = "svgRegistry";

const json = {

  elements: [
    {
      "type": "html",
      "name": "question1",
      "html": "<svg id=\"svg-icon-test\"><use xlink:href=\"#icon-icn-test\"></use></svg>"
    }
  ]
};

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await ClientFunction(() => {
        window["Survey"].SvgRegistry.registerIconFromSvg("icn-test", "<svg viewBox=\"1 2 3 4\"></svg>");
      })();
      await initSurvey(framework, json);
    }
  );
  test("Check svg icons", async t => {
    var svgContainer = ClientFunction(() => {
      return document.querySelector("#sv-icon-holder-global-container").innerHTML;
    });
    await t
      .expect(Selector("#sv-icon-holder-global-container").exists).ok()
      .expect(svgContainer()).contains("<symbol id=\"icon-icn-test\" viewBox=\"1 2 3 4\"></symbol>")
      .expect(svgContainer()).contains("<symbol id=\"icon-left\"");
  });
});