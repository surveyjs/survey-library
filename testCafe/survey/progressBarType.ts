import { url, initSurvey, frameworks, getSurveyResult } from "../helper";
import { Selector, ClientFunction } from "testcafe";

const title = "progressBarType";

const json_questions = {
  showProgressBar: "top",
  progressBarType: "questions",
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

const json_requiredQuestions = {
  showProgressBar: "top",
  progressBarType: "requiredQuestions",
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

const json_toc = {
  showTOC: true,
  pages: [
    {
      elements: [
        {
          type: "text",
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

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
    }
  );
  test("progressBarType:questions", async t => {
    await initSurvey(framework, json_questions);
    await t.expect(Selector("span").withText("Answered 0/4 questions").exists).ok()
      .typeText("input[type=email]", "stub@gmail.com")
      .pressKey("tab")
      .expect(Selector("span").withText("Answered 1/4 questions").exists).ok();
  });
  test("progressBarType:requiredQuestions", async t => {
    await initSurvey(framework, json_requiredQuestions);
    await t.expect(Selector("span").withText("Answered 0/2 questions").exists).ok()
      .typeText("input[type=email]", "stub@gmail.com")
      .pressKey("tab")
      .expect(Selector("span").withText("Answered 1/2 questions").exists).ok();
  });
  test("navigation:toc", async t => {
    await initSurvey(framework, json_toc);
    const page1 = Selector(".sv-list__item-body").withText("page1");
    const page2 = Selector(".sv-list__item-body").withText("page2");
    await t.expect(page1.exists).ok();
    await t.expect(page2.exists).ok();
    await t.click(page2);
    await t.expect(Selector("h5.sv_q_title").withText("q3").exists).ok();
  });
});