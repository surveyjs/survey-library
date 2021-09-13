import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
import { Selector } from "testcafe";
const title = "comment";

const commentQuestion = Selector(".sv_q textarea");
const otherCommentQuestion = Selector(".sv_q .sv_q_other");
const json = {
  questions: [
    {
      type: "comment",
      name: "suggestions",
      title: "What would make you more satisfied with the Product?"
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(async t => {
    await initSurvey(framework, {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "comment",
              "name": "question1",
              "autoGrow": true
            },
            {
              "type": "radiogroup",
              "name": "question2",
              "hasComment": true,
              "commentText": "Comment text"
            }
          ]
        }
      ],
      "autoGrowComment": true
    });
  });

  test("autoGrowComment", async t => {
    await t
      .click(commentQuestion)
      .expect(commentQuestion.getStyleProperty("resize")).eql("none")
      .expect(commentQuestion.clientHeight).eql(116)
      .pressKey("a enter a enter a enter a enter")
      .expect(commentQuestion.clientHeight).eql(144)

      .pressKey("backspace")
      .expect(commentQuestion.clientHeight).eql(116)

      .pressKey("tab")
      .expect(otherCommentQuestion.getStyleProperty("resize")).eql("none")
      .expect(otherCommentQuestion.clientHeight).eql(60)

      .pressKey("a enter a enter")
      .expect(otherCommentQuestion.clientHeight).eql(88)

      .pressKey("backspace")
      .expect(otherCommentQuestion.clientHeight).eql(60);
  });
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("fill textarea", async t => {
    await t
      .typeText(commentQuestion, "puppies")
      .pressKey("enter")
      .typeText(commentQuestion, "money")
      .click("input[value=Complete]");

    await t.expect(await getSurveyResult()).eql({ suggestions: "puppies\nmoney" });
  });

  test("change rows count", async t => {
    await t.expect(Selector("textarea[rows=\"4\"]").visible).ok();

    await setOptions("suggestions", { rows: 2 });
    await t.expect(Selector("textarea[rows=\"2\"]").visible).ok();
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on question title state editable", async (t) => {
    const newTitle = "MyText";
    const outerSelector = ".sv_q_title";
    const innerSelector = ".sv-string-editor";

    await t
      .expect(await getQuestionValue()).eql(undefined)
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    await t.expect(await getQuestionValue()).eql(undefined);
    const json = JSON.parse(await getQuestionJson());
    await t.expect(json.title).eql(newTitle);
  });
});