import { fixture, test, ClientFunction, Selector } from "testcafe";
import { frameworks, url, initSurvey } from "../helper";
const title = "Lazy rendering";

const json = {
  elements: <Array<any>>[
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
    }
  );

  test("Skeleton rendered", async (t) => {
    await t.expect(Selector("#surveyElement").exists).ok();
    const enableLR = ClientFunction(() => {
      const container: HTMLDivElement = document.getElementById("surveyElement") as HTMLDivElement;
      container.style.height = "500px";
      container.style.overflow = "auto";
      window["Survey"].settings.lazyRender.enabled = true;
    });
    const disableLR = ClientFunction(() => {
      window["Survey"].settings.lazyRender.enabled = false;
    });

    await enableLR();
    await t.expect(Selector("#surveyElement").exists).ok();
    for(var i=0; i<50; i++) {
      json.elements.push({
        type: "radiogroup",
        name: "q" + (i+1),
        choices: ["item1", "item2", "item3"],
      });
    }
    await initSurvey(framework, json);

    await ClientFunction(() => {
      window["survey"].getAllQuestions().forEach((q, i) => {
        q.id = "my_id_" + (i+1);
      });
      window["survey"].render("surveyElement");
    })();

    await t.expect(Selector(".sv-skeleton-element").exists).ok();
    await t.expect(Selector(".sv-skeleton-element").withAttribute("id", "my_id_50").exists).ok();
    await disableLR();
  });
});
