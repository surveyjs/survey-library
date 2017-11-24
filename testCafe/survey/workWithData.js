import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `workWithData`;

const set_data = ClientFunction(() => {
  survey.data = {
    name: "John Doe",
    email: "johndoe@nobody.com",
    car: ["Ford"]
  };
  survey.render();
});

const add_value_changed_listener = ClientFunction(() => {
  survey.onValueChanged.add(function(sender, options) {
    document.documentElement.appendChild(
      document.createTextNode(options.value)
    );
  });
});

const set_values = ClientFunction(() => {
  survey.setValue("name", "Wombat");
  survey.setValue("email", "wo@mbat.com");
  survey.setValue("car", ["BMW", "Ford"]);
});

const get_value = ClientFunction(() => {
  document.documentElement.appendChild(
    document.createTextNode(survey.getValue("car"))
  );
});

const json = {
  questions: [
    { type: "text", name: "name", title: "Your name:" },
    { type: "text", name: "email", title: "Your e-mail" },
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
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

  test(`set data`, async t => {
    let surveyResult;

    await set_data();
    await t.click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      name: "John Doe",
      email: "johndoe@nobody.com",
      car: ["Ford"]
    });
  });

  test(`add value changed listener`, async t => {
    const getPositionName = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("John Doe")
    );
    const getPositionCar = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("None")
    );

    await add_value_changed_listener();
    await t.typeText(`div input`, `John Doe`).click(`div input[type=checkbox]`);

    assert.notEqual(await getPositionName(), -1);
    assert.notEqual(await getPositionCar(), -1);
  });

  test(`set values`, async t => {
    let surveyResult;

    await set_values();
    await t.click(`input[value=Complete]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      name: "Wombat",
      email: "wo@mbat.com",
      car: ["BMW", "Ford"]
    });
  });

  test(`get value`, async t => {
    const getPositionCar = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("BMW")
    );

    await set_values();
    await set_values();

    assert.notEqual(await getPositionCar(), -1);
  });
});
