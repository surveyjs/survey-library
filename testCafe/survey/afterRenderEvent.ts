import { ClientFunction, Selector } from "testcafe";
import { frameworks, url_test, initSurvey } from "../helper";

const title = "afterRenderQuestionEvent";

const json = {
  pages: [
    {
      name: "page1",
      title: "page one",
      elements: [
        {
          type: "radiogroup",
          name: "q1",
          choices: ["1", "2", "3"],
        },
        {
          type: "text",
          visibleIf: "{q1} = '1'",
          name: "q2",
          isRequired: true,
        },
        {
          type: "text",
          name: "q3",
        },
        {
          type: "text",
          name: "q4",
        }
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url_test}defaultV2/${framework}`.beforeEach(async (t) => {
    await t.resizeWindow(1920, 1080);
  });
  test("afterRender is not fired when questions are lazy rendered", async (t) => {
    await ClientFunction(() => {
      (window as any).Survey.settings.lazyRowsRendering = true;
    })();
    const f = (survey, options) => {
      options.htmlElement.setAttribute("test", true);
    };
    const events = { onAfterRenderQuestion: f };
    await initSurvey(framework, json, events);

    await t.click(Selector("label").nth(0))
      .expect(Selector("div[data-name='q1']").hasAttribute("test")).ok()
      .expect(Selector("div[data-name='q2']").hasAttribute("test")).ok()
      .expect(Selector("div[data-name='q3']").hasAttribute("test")).ok()
      .expect(Selector("div[data-name='q4']").hasAttribute("test")).ok();
  });
});
