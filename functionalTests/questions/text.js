import { frameworks, url, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, getTimeZone, setTimeZoneUnsafe } from "../helper";
import { Selector, fixture, test, ClientFunction } from "testcafe";
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
    const questionTitle = Selector("div").withAttribute("id", /ariaTitle$/).withText(title);
    const contentItem = Selector("input[type='text']");

    await t
      .expect(contentItem.visible).ok()
      .click(questionTitle)
      .expect(contentItem.visible).notOk();
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
    await t.expect(questionValue).eql(undefined);

    var outerSelector = ".sd-question__title";
    var innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);
    json = JSON.parse(await getQuestionJson());
    await t.expect(json.title).eql(newTitle);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Remaining character counter", async (t) => {
    const characterCounter = Selector(".sd-remaining-character-counter");

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
  test("Test input type (month) in western timezone", async (t) => {
    const oldTimeZone = await getTimeZone();
    await setTimeZoneUnsafe(t, "America/Los_Angeles");
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          "type": "text",
          "name": "monthInput",
          "title": "Month Input",
          "inputType": "month"
        }]
    });

    await t
      .expect(getTimeZone()).eql("America/Los_Angeles")
      .pressKey("M tab 2 0 2 4 tab")
      .expect(Selector("input").nth(0).value).eql("2024-03")
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      monthInput: "2024-03"
    });
    await setTimeZoneUnsafe(t, oldTimeZone);
  });
});
frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Date validation", async (t) => {
    await initSurvey(framework, {
      elements: [
        {
          type: "text",
          name: "date1",
          defaultValue: "2020-05-04",
          inputType: "date",
          maxValueExpression: "getDate('2020-05-05')",
          maxErrorText: "Max error"
        },
        {
          type: "text",
          name: "date2",
          defaultValue: "2020-05-04",
          inputType: "date",
          validators: [
            {
              type: "expression",
              text: "Validator error",
              expression: "{date2} < getDate('2020-05-05')"
            }
          ]
        }
      ],
      checkErrorsMode: "onValueChanged",
      focusFirstQuestionAutomatic: true
    });

    await t
      .pressKey("tab up up  tab tab")
      .expect(Selector("span").withText("Max error").visible).ok()
      .pressKey("tab up up  tab tab")
      .expect(Selector("span").withText("Validator error").visible).ok()
      .pressKey("shift+tab shift+tab down down shift+tab shift+tab")
      .expect(Selector("span").withText("Validator error").visible).notOk()
      .pressKey("shift+tab  down down  tab tab tab")
      .expect(Selector("span").withText("Max error").visible).notOk();
  });

});