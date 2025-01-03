import { frameworks, url, setOptions, initSurvey } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
const title = "html";

const json = {
  elements: [
    {
      type: "text",
      name: "name",
    },
    {
      type: "html",
      name: "info",
      html:
        "<table><body><row><td><img src='https://surveyjs.io/Content/Images/examples/26178-20160417.jpg' width='100px' /></td><td style='padding:20px'>You may put here any html code. For example images, <b>text</b> or <a href='https://surveyjs.io/Editor/Editor/'  target='_blank'>links</a></td></row></body></table>"
    },
    {
      type: "html",
      name: "testName",
      html: "Name: <span>{name}</span>"
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("check html elements", async t => {
    const getImageExistance = ClientFunction(
      () =>
        !!document.querySelector(
          'table img[src="https://surveyjs.io/Content/Images/examples/26178-20160417.jpg"]'
        )
    );
    const getBoldExistance = ClientFunction(
      () => !!document.querySelector("table b")
    );
    const getLinkExistance = ClientFunction(
      () =>
        !!document.querySelector(
          'table a[href="https://surveyjs.io/Editor/Editor/"]'
        )
    );

    await t.expect(await getImageExistance()).ok();
    await t.expect(await getBoldExistance()).ok();
    await t.expect(await getLinkExistance()).ok();
  });

  test("change html", async t => {
    await setOptions("info", { html: "<h1>Wombat</h1>" });
    await t.expect(Selector("h1").withText("Wombat").visible).ok();
  });
  test("text processing", async t => {
    await t.typeText("input[type=text]", "John")
      .pressKey("tab")
      .expect(Selector("span").withText("John").visible).ok();
  });
});
