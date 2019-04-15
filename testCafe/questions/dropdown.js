import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `dropdown`;

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
        "Citroen"
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`choose empty`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Please answer the question")
    );
    let position;
    let surveyResult;

    await t.click(`input[value=Complete]`);

    position = await getPosition();
    assert.notEqual(position, -1);

    surveyResult = await getSurveyResult();
    assert.equal(typeof surveyResult, `undefined`);
  });

  test(`choose value`, async t => {
    let surveyResult;

    await t
      .click(`select`)
      .click(`option[value=Nissan]`)
      .click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "Nissan");
  });

  test(`change choices order`, async t => {
    const getChoicesCount = ClientFunction(
      () => document.querySelectorAll(`select option`).length
    );
    const getFirst = Selector(`select option`, { index: 1 });
    const getSecond = Selector(`select option`, { index: 2 });
    let rnd_count = 0;
    let first, second, first_2;
    let choicesCount = await getChoicesCount();

    // asc
    await setOptions("car", { choicesOrder: "asc" });
    first = await getFirst();
    second = await getSecond();

    assert.equal(first.textContent, "Audi");
    assert.equal(second.textContent, "BMW");

    // desc
    await setOptions("car", { choicesOrder: "desc" });
    first = await getFirst();
    second = await getSecond();
    assert.equal(first.textContent, "Volkswagen");
    assert.equal(second.textContent, "Vauxhall");

    // rnd
    if (choicesCount === 1) {
      assert(false, `need to more than one choices`);
    }

    for (let i = 0; i < 15; i++) {
      await setOptions("car", { choicesOrder: "asc" });
      await setOptions("car", { choicesOrder: "random" });
      first_2 = await getFirst();

      if (first.textContent !== first_2.textContent) {
        rnd_count++;
      }

      first = first_2;

      if (rnd_count >= 4) {
        break;
      }
    }

    assert(rnd_count >= 4); // beacuse of 'none', 'asc', 'desc' and if 4 it is really rnd
  });

  test(`check integrity`, async t => {
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
      "Citroen"
    ];
    let i;
    const getChoicesCount = ClientFunction(
      () => document.querySelectorAll("option").length
    );
    let choicesCount;
    let checkIntegrity = async () => {
      choicesCount = await getChoicesCount();
      assert.equal(choicesCount, choices.length + 1); // +1 because of default "Choose..." option
      for (i = 0; i < choices.length; i++) {
        await t.click("select").click(`option[value=${choices[i]}]`);
      }
    };

    await setOptions("car", { choicesOrder: "asc" });
    await checkIntegrity();

    await setOptions("car", { choicesOrder: "desc" });
    await checkIntegrity();

    await setOptions("car", { choicesOrder: "random" });
    await checkIntegrity();
  });

  test(`show "other" choice`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Other")
    );
    let position;

    await setOptions("car", { hasOther: true, otherText: "Other" });
    position = await getPosition();
    assert.notEqual(position, -1);
  });

  test(`check "other" choice doesn't change order`, async t => {
    const getOtherChoice = Selector(
      () => document.querySelectorAll(`select option`)[12]
    );
    let otherChoice;

    await setOptions("car", { hasOther: true, otherText: "Other" });
    await setOptions("car", { choicesOrder: "desc" });

    otherChoice = await getOtherChoice();
    assert.equal(otherChoice.textContent, "Other");
  });

  test(`choose other`, async t => {
    const getOtherInput = Selector(
      () => document.querySelectorAll("textarea")[0]
    );

    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(`select`)
      .click(`option[value=other]`)
      .typeText(getOtherInput, "Zaporozec")
      .click(`input[value=Complete]`);

    let surveyResult = await getSurveyResult();
    assert.equal(surveyResult.car, "other");
    assert.equal(surveyResult["car-Comment"], "Zaporozec");
  });
});
