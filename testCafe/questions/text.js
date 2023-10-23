import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson } from "../helper";
import { Selector, fixture, test, ClientFunction } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "text";

const json = {
  questions: [
    {
      name: "name",
      type: "text",
      state: "expanded",
      title: "Please enter your name:",
    },
    {
      name: "birthdate",
      type: "text",
      inputType: "date",
      title: "Your birthdate:",
    },
    {
      name: "color",
      type: "text",
      inputType: "color",
      title: "Your favorite color:",
    },
    {
      name: "email",
      type: "text",
      inputType: "email",
      title: "Your e-mail:",
      isRequired: true,
      validators: [{ type: "email" }],
    },
    {
      name: "datetime",
      type: "text",
      inputType: "datetime",
      title: "Your lunch time:",
    },
    {
      name: "datetime-local",
      type: "text",
      inputType: "datetime-local",
      title: "Your supper time:",
    },
    {
      name: "month",
      type: "text",
      inputType: "month",
      title: "Your favorite month:",
    },
    {
      name: "password",
      type: "text",
      inputType: "password",
      title: "Please enter password:",
    },
    {
      name: "range",
      type: "text",
      inputType: "range",
      title: "Please set price range:",
    },
    {
      name: "tel",
      type: "text",
      inputType: "tel",
      title: "Enter your phone number",
    },
    {
      name: "time",
      type: "text",
      inputType: "time",
      title: "When do you watch TV?",
    },
    {
      name: "url",
      type: "text",
      inputType: "url",
      title: "Add link to your site please",
    },
    {
      name: "week",
      type: "text",
      inputType: "week",
      title: "Mark any week which you want",
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test.skip("fill text field", async (t) => {
    let surveyResult;

    await t
      .typeText("input[type=email]", "stub@gmail.com")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      email: "stub@gmail.com",
    });
  });

  // it isn't working for bootstrap and custom design (standard)
  // if (framework.indexOf("bootstrap") === -1) {
  //   test(`change size`, async t => {
  //     const getWidth = ClientFunction(
  //       () => document.querySelector("input[type=email]").clientWidth
  //     );
  //     let oldWidth;
  //     let newWidth;

  //     oldWidth = await getWidth();

  //     await setOptions("email", { size: 10 });

  //     newWidth = await getWidth();

  //     assert(oldWidth > newWidth);
  //   });
  // }

  test("check input types", async (t) => {
    const types = [
      "color",
      "date",
      "datetime-local",
      "email",
      "month",
      "password",
      "range",
      "tel",
      "text",
      "time",
      "url",
      "week",
    ];

    for (let i = 0; i < types.length; i++) {
      await t.hover(`input[type=${types[i]}]`);
    }
  });

  test("expand collapse title", async (t) => {
    const title = "Please enter your name:";
    const questionTitle = Selector("h5").withText(title);
    const contentItem = Selector("input[type='text']");

    assert.equal(await contentItem.visible, true);
    await t.click(questionTitle);
    assert.equal(await contentItem.visible, false);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on question title state editable", async (t) => {
    var newTitle = "MyText";
    var json = JSON.parse(await getQuestionJson());
    var questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);

    var outerSelector = ".sv_q_title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    assert.equal(questionValue, undefined);
    json = JSON.parse(await getQuestionJson());
    assert.equal(json.title, newTitle);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Remaining character counter", async (t) => {
    const characterCounter = Selector(".sv-remaining-character-counter");

    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          name: "name",
          type: "text",
          maxLength: 10,
        }]
    });

    await t
      .expect(characterCounter.textContent).eql("0/10")

      .pressKey("A")
      .expect(characterCounter.textContent).eql("1/10")

      .typeText("input", "bcd")
      .expect(characterCounter.textContent).eql("4/10")

      .pressKey("backspace")
      .pressKey("backspace")
      .expect(characterCounter.textContent).eql("2/10")

      .pressKey("backspace")
      .pressKey("backspace")
      .expect(characterCounter.textContent).eql("0/10");
  });
  test("Allow Space As Answer", async (t) => {
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          name: "name",
          type: "text",
          maxLength: 10,
        }]
    });
    await ClientFunction(() => {
      window.survey.getQuestionByName("name").allowSpaceAsAnswer = true;
    })();

    await t
      .pressKey("space")
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      name: " ",
    });
  });
});