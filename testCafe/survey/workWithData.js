import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
const title = "workWithData";

const set_data = ClientFunction(() => {
  window["survey"].data = {
    name: "John Doe",
    email: "johndoe@nobody.com",
    car: ["Ford"]
  };
});

const add_value_changed_listener = ClientFunction(() => {
  window["survey"].onValueChanged.add(function (sender, options) {
    let divElement = document.body.getElementsByClassName("new-element")[0];
    if (!divElement) {
      divElement = document.createElement("div");
      divElement.className = "new-element";
      document.body.appendChild(divElement);
    }
    divElement.appendChild(document.createTextNode(options.value));
  });
});

const set_values = ClientFunction(() => {
  window["survey"].setValue("name", "Wombat");
  window["survey"].setValue("email", "wo@mbat.com");
  window["survey"].setValue("car", ["BMW", "Ford"]);
});

const get_value = ClientFunction(() => {
  document.documentElement.appendChild(
    document.createTextNode(window["survey"].getValue("car"))
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

  test("set data", async t => {
    let surveyResult;

    await set_data();
    await t.click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      name: "John Doe",
      email: "johndoe@nobody.com",
      car: ["Ford"]
    });
  });

  test("add value changed listener", async t => {
    const resultElement = Selector(".new-element");

    await add_value_changed_listener();
    await t
      .expect(resultElement.exists).notOk()
      .typeText(".sv_row input", "John Doe")
      .pressKey("tab")
      .expect(resultElement.textContent).eql("John Doe")

      .click("div input[type=checkbox]")
      .pressKey("tab")
      .expect(resultElement.textContent).eql("John DoeNone");
  });

  test("set values", async t => {
    let surveyResult;

    await set_values();
    await t.click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      name: "Wombat",
      email: "wo@mbat.com",
      car: ["BMW", "Ford"]
    });
  });

  test("get value", async t => {
    await set_values();
    await set_values();

    await t.expect(Selector(".sv-string-viewer").withText("BMW").visible).ok();
  });
});
