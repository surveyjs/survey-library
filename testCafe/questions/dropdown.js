import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion } from "../helper";
import { Selector, fixture, test } from "testcafe";
const title = "dropdown";

const json = {
  questions: [
    {
      type: "dropdown",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 0,
      choices: [
        "None",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen",
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("choose empty", async (t) => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async (t) => {
    let surveyResult;

    await t
      .click("select")
      .click("option[value=Nissan]")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql("Nissan");
  });

  test("change choices order", async (t) => {
    const getFirst = Selector("select option").nth(1);
    const getSecond = Selector("select option").nth(2);
    let rnd_count = 0;
    let first, first_2;

    // asc
    await setOptions("car", { choicesOrder: "asc" });
    await t
      .expect(getFirst.textContent).eql("Audi")
      .expect(getSecond.textContent).eql("BMW");

    // desc
    await setOptions("car", { choicesOrder: "desc" });
    await t
      .expect(getFirst.textContent).eql("Volkswagen")
      .expect(getSecond.textContent).eql("Vauxhall");

    // rnd
    await t.expect(Selector("select option").count).notEql(1); // "need to more than one choices"

    first = await getFirst();
    for (let i = 0; i < 15; i++) {
      await setOptions("car", { choicesOrder: "asc" });
      await setOptions("car", { choicesOrder: "random" });
      first_2 = await getFirst();

      if (first.textContent.trim() !== first_2.textContent.trim()) {
        rnd_count++;
      }

      first = first_2;

      if (rnd_count >= 4) {
        break;
      }
    }

    await t.expect(rnd_count).gte(4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
  });

  test("check integrity", async (t) => {
    const choices = [
      "None",
      "Ford",
      "Vauxhall",
      "Volkswagen",
      "Nissan",
      "Audi",
      "Mercedes-Benz",
      "BMW",
      "Peugeot",
      "Toyota",
      "Citroen",
    ];
    let checkIntegrity = async (t) => {
      await t.expect(Selector("option").count).eql(choices.length + 1); // +1 because of default "Choose..." option
      for (let i = 0; i < choices.length; i++) {
        await t.click("select").click(`option[value=${choices[i]}]`);
      }
    };

    await setOptions("car", { choicesOrder: "asc" });
    await checkIntegrity(t);

    await setOptions("car", { choicesOrder: "desc" });
    await checkIntegrity(t);

    await setOptions("car", { choicesOrder: "random" });
    await checkIntegrity(t);
  });

  test("show \"other\" choice", async (t) => {
    await t
      .click(Selector(".sv_row select"))
      .expect(Selector(".sv_row select option").count).eql(12);

    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(Selector(".sv_row select"))
      .expect(Selector(".sv_row select option").count).eql(13)
      .expect(Selector(".sv_row select option").nth(12).textContent).contains("Other");
  });

  test("check \"other\" choice doesn't change order", async (t) => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t.expect(Selector("select option").nth(12).textContent).eql("Other");

    await setOptions("car", { choicesOrder: "desc" });
    await t.expect(Selector("select option").nth(12).textContent).eql("Other");
  });

  test("choose other", async (t) => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click("select")
      .click("option[value=other]")
      .typeText(Selector("textarea"), "Zaporozec")
      .click("input[value=Complete]");

    let surveyResult = await getSurveyResult();
    await t
      .expect(surveyResult.car).eql("other")
      .expect(surveyResult["car-Comment"]).eql("Zaporozec");
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
    let json = JSON.parse(await getQuestionJson());
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    const outerSelector = ".sv_q_title";
    const innerSelector = ".sv-string-editor";
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
