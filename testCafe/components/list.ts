import { url, initSurvey, registerCustomToolboxComponent, frameworks } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "list";

const explicitErrorHandler = () => {
  window.addEventListener("error", e => {
    if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded") {
      e.stopImmediatePropagation();
    }
  });
};

const json = {
  elements: [
    {
      type: "text",
      name: "actions_question"
    }
  ]
};

const disposeSurvey = ClientFunction(framework => {
  window["survey"].dispose();
  if (framework === "react") {
    window["ReactDOM"].unmountComponentAtNode(document.getElementById("surveyElement"));
  }
});

function addTitleAction(_, opt) {
  for (var i = 0; i < 30; i++) {
    opt.titleActions.push({
      title: "Custom Action " + i,
      component: "svc-custom-action",
      action: () => {
      }
    });
  }
}

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: `(${explicitErrorHandler.toString()})()` }).beforeEach(async t => {
  });

  test("check custom markup in list behavior", async t => {
    await registerCustomToolboxComponent(framework);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addTitleAction });
    await t
      .expect(Selector(".sv-popup__content .my-custom-action-class").withText("Custom Action 29").exists).ok();
  });

});