import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
import { ClientFunction, Selector } from "testcafe";
const title = "comment";

const commentQuestion = Selector(".sd-question textarea");
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
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("autoGrowComment & acceptCarriageReturn", async t => {
    await initSurvey(framework, {
      "autoGrowComment": true,
      "allowResizeComment": false,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "comment",
              "name": "question1",
            },
            {
              "type": "radiogroup",
              "name": "question2",
              "hasComment": true,
              "commentText": "Comment text"
            },
            {
              "type": "comment",
              "name": "question3",
              "acceptCarriageReturn": false
            },
          ]
        }
      ],
    });
    await t
      .click(commentQuestion)
      .expect(commentQuestion.getStyleProperty("resize")).eql("none")
      .expect(commentQuestion.clientHeight).eql(120)
      .pressKey("a enter a enter a enter a enter")
      .expect(commentQuestion.clientHeight).eql(144)

      .pressKey("backspace")
      .expect(commentQuestion.clientHeight).eql(120)

      .pressKey("tab")
      .expect(commentQuestion.nth(1).getStyleProperty("resize")).eql("none")
      .expect(commentQuestion.nth(1).clientHeight).eql(72)

      .pressKey("a enter a enter")
      .expect(commentQuestion.nth(1).clientHeight).eql(96)

      .pressKey("backspace")
      .expect(commentQuestion.nth(1).clientHeight).eql(72)

      .pressKey("tab")
      .expect(commentQuestion.nth(2).getStyleProperty("resize")).eql("none")
      .expect(commentQuestion.nth(2).clientHeight).eql(120)
      .pressKey("a enter a enter a enter a enter")
      .expect(commentQuestion.nth(2).clientHeight).eql(120)
      .expect(commentQuestion.nth(2).value).eql("aaaa")

      .typeText(commentQuestion.nth(2), "a\na\na\na\n", { replace: true })
      .pressKey("tab")
      .expect(commentQuestion.nth(2).value).eql("aaaa");
  });

  test("autoGrowComment after survey data set", async t => {
    await t.resizeWindow(1280, 900);
    await initSurvey(framework, {
      "elements": [
        {
          "type": "comment",
          "name": "question1",
          "autoGrow": true,
          "rows": 1
        }
      ]
    });
    await t.expect(commentQuestion.clientHeight).eql(48);

    await ClientFunction(() =>
      window["survey"].data = { "question1": "<h3>Thank you for your feedback.</h3> <h5> We are glad that you share with us your ideas.We highly value all suggestions from our customers. We do our best to improve the product and reach your expectation.</h5><br/>" }
    )();
    await t.expect(commentQuestion.clientHeight).eql(120);
  });

  test("autoGrow with default value", async (t) => {
    await t.resizeWindow(1280, 900);
    await initSurvey(framework, {
      "showQuestionNumbers": "off",
      "widthMode": "static",
      "width": "500px",
      questions: [
        {
          name: "name",
          type: "comment",
          titleLocation: "hidden",
          defaultValue: "The comment area has an initial height of two rows and automatically expands or shrinks to accomodate the content.",
          autoGrow: true,
          allowResize: false,
          rows: 1
        }
      ]
    });

    await t
      .expect(commentQuestion.value).eql("The comment area has an initial height of two rows and automatically expands or shrinks to accomodate the content.")
      .expect(commentQuestion.clientHeight).eql(96);
  });

  test("fill textarea", async t => {
    await initSurvey(framework, json);
    await t
      .typeText(commentQuestion, "puppies")
      .pressKey("enter")
      .typeText(commentQuestion, "money")
      .click("input[value=Complete]");

    await t.expect(await getSurveyResult()).eql({ suggestions: "puppies\nmoney" });
  });

  test("change rows count", async t => {
    await initSurvey(framework, json);
    await t.expect(Selector("textarea[rows=\"4\"]").visible).ok();

    await setOptions("suggestions", { rows: 2 });
    await t.expect(Selector("textarea[rows=\"2\"]").visible).ok();
  });

  test("click on question title state editable", async (t) => {
    const newTitle = "MyText";
    const outerSelector = ".sd-question__title";
    const innerSelector = ".sv-string-editor";

    await initSurvey(framework, json, undefined, true);
    await t
      .expect(await getQuestionValue()).eql(undefined)
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    await t.expect(await getQuestionValue()).eql(undefined);
    const questionJson = JSON.parse(await getQuestionJson());
    await t.expect(questionJson.title).eql(newTitle);
  });

  test("Remaining character counter", async (t) => {
    const characterCounter = Selector(".sd-remaining-character-counter");

    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          name: "comment",
          type: "comment",
          maxLength: 10,
        }]
    });

    await t
      .expect(characterCounter.textContent).eql("0/10")

      .pressKey("A")
      .expect(characterCounter.textContent).eql("1/10")

      .typeText("textarea", "bcd")
      .expect(characterCounter.textContent).eql("4/10")

      .pressKey("backspace")
      .pressKey("backspace")
      .expect(characterCounter.textContent).eql("2/10")

      .pressKey("backspace")
      .pressKey("backspace")
      .expect(characterCounter.textContent).eql("0/10");
  });
});

const json2 = {
  "logoPosition": "right",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "boolean",
          "name": "question3"
        },
        {
          "type": "text",
          "name": "question1"
        },
        {
          "type": "comment",
          "name": "question2",
          "visibleIf": "{question3} = true",
          "setValueExpression": "{question1}"
        }
      ]
    }
  ]
};
frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Bug: 8921 - check long text reactivity when change visible property", async t => {
    await initSurvey(framework, json2);
    await t
      .click(Selector("span").withText("Yes"))
      .click(Selector("span").withText("No"))
      .click(Selector("span").withText("Yes"))
      .typeText(Selector("input[type='text']"), "test")
      .pressKey("tab")
      .expect(Selector("textarea").value).eql("test");
  });
});