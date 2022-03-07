import { url, initSurvey, frameworks, getSurveyResult } from "../helper";
import { Selector, ClientFunction } from "testcafe";

const title = "svgRegistry";

const json = {

  elements: [
    {
      "type": "html",
      "name": "question1",
      "html": "<svg id=\"svg-icon-test\"><use xlink:href=\"#icon-icon-test\"></use></svg>"
    }
  ]
};

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await ClientFunction(() => {
        window["Survey"].SvgRegistry.registerIconFromSvg("icon-test", "<svg viewBox=\"1 2 3 4\"></svg>");
      })();
      await initSurvey(framework, json);
    }
  );
  test("Check svg icons", async t => {
    await t
      .expect(Selector("#sv-icon-holder-global-container").exists).ok()
      .expect(ClientFunction(() => {
        return document.querySelector("#sv-icon-holder-global-container").innerHTML;
      })()).eql("<svg style=\"display:none;\"><symbol id=\"icon-icon-test\" viewBox=\"1 2 3 4\"></symbol></svg>");
  });
});