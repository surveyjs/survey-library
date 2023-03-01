import { url, initSurvey, frameworks, getSurveyResult } from "../helper";
import { Selector, ClientFunction } from "testcafe";

const title = "progressBarType";

const json = {
  showProgressBar: "top",
  pages: [
    {
      elements: [
        {
          type: "text",
          isRequired: true,
          inputType: "email",
          name: "q1"
        },
        {
          type: "text",
          name: "q2"
        }
      ]
    },
    {
      elements: [
        {
          type: "text",
          isRequired: true,
          name: "q3"
        },
        {
          type: "text",
          name: "q4"
        }
      ]
    }
  ]
};

const setProgressBarType_questions = ClientFunction(() => {
  window["survey"].progressBarType = "";
  window["survey"].render();
});

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
    }
  );
  test("progressBarType:questions", async t => {
    json["progressBarType"] = "questions";
    await initSurvey(framework, json);
    await t.expect(Selector("span").withText("Answered 0/4 questions").exists).ok()
      .typeText("input[type=email]", "stub@gmail.com")
      .pressKey("tab")
      .expect(Selector("span").withText("Answered 1/4 questions").exists).ok();
  });
  test("progressBarType:requiredQuestions", async t => {
    json["progressBarType"] = "requiredQuestions";
    await initSurvey(framework, json);
    await t.expect(Selector("span").withText("Answered 0/2 questions").exists).ok()
      .typeText("input[type=email]", "stub@gmail.com")
      .pressKey("tab")
      .expect(Selector("span").withText("Answered 1/2 questions").exists).ok();
  });
  test("navigation:toc", async t => {
    json["showTOC"] = true;
    json["pages"][0]["elements"][0]["isRequired"] = false;
    await initSurvey(framework, json);
    const page1 = Selector(".sv-list__item-body").withText("page1");
    const page2 = Selector(".sv-list__item-body").withText("page2");
    await t.expect(page1.exists).ok();
    await t.expect(page2.exists).ok();
    await t.click(page2);
    await t.expect(Selector("h5.sv_q_title").withText("q3").exists).ok();
  });
});