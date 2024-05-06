import { SurveyModel } from "../src/survey";
import { JsonObject, Serializer } from "../src/jsonobject";
import { PageModel } from "../src/page";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { Question } from "../src/question";
import { QuestionMultipleTextModel, MultipleTextItemModel } from "../src/question_multipletext";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDropdownModelBase } from "../src/question_matrixdropdownbase";
import { ItemValue } from "../src/itemvalue";
import { NumericValidator } from "../src/validator";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { Helpers } from "../src/helpers";
import { MatrixDropdownColumn } from "../src/question_matrixdropdowncolumn";
import { ComponentCollection } from "../src/question_custom";

export default QUnit.module("SurveySerialization");

QUnit.test("Serialize two pages", function (assert) {
  var survey = new SurveyModel();
  survey.addNewPage("Page 1");
  survey.addNewPage("Page 2");
  var jsObj = new JsonObject().toJsonObject(survey);
  assert.equal(
    JSON.stringify(jsObj),
    '{"pages":[{"name":"Page 1"},{"name":"Page 2"}]}',
    "serialize two pages"
  );
});
QUnit.test("Deserialize two pages", function (assert) {
  var survey = new SurveyModel();
  new JsonObject().toObject(
    { pages: [{ name: "Page1" }, { name: "Page2" }] },
    survey
  );
  assert.equal(survey.pages.length, 2, "Two pages from json");
  assert.equal(survey.pages[0].name, "Page1", "property name is set");
  assert.equal(survey.pages[0].data, survey, "data interface is set");
  assert.equal(survey.pages[1].getType(), "page", "it is a live object");
});
QUnit.test("Serialize two questions", function (assert) {
  var page = new PageModel("Page1");
  var textQuestion = new QuestionTextModel("textQuestion");
  textQuestion.isRequired = true;
  var checkBoxQuestion = new QuestionCheckboxModel("checkboxQuestion");
  checkBoxQuestion.choices = ["red", "white"];
  checkBoxQuestion.isRequired = true;
  checkBoxQuestion.hasComment = true;
  page.addQuestion(textQuestion);
  page.addQuestion(checkBoxQuestion);
  var jsObj = new JsonObject().toJsonObject(page);
  assert.equal(
    JSON.stringify(jsObj),
    '{"name":"Page1","elements":[{"type":"text","name":"textQuestion","isRequired":true},{"type":"checkbox","name":"checkboxQuestion","isRequired":true,"showCommentArea":true,"choices":["red","white"]}]}',
    "serialize two questions"
  );
});
QUnit.test("Deserialize two questions", function (assert) {
  var survey = new SurveyModel();
  var page = new PageModel("Page1");
  survey.addPage(page);
  new JsonObject().toObject(
    {
      questions: [
        { type: "text", name: "textQuestion", isRequired: "true" },
        {
          type: "checkbox",
          name: "checkboxQuestion",
          isRequired: "true",
          choices: ["red", "white"],
        },
      ],
    },
    page
  );
  var checkbox: any = page.questions[1];
  assert.equal(page.questions.length, 2, "Two questions from json");
  assert.equal(page.questions[0].name, "textQuestion", "property name is set");
  assert.equal(page.questions[1].getType(), "checkbox", "it is a live object");
  assert.equal(
    checkbox.choices.length,
    2,
    "property choices is set correctly: length"
  );
  assert.equal(
    checkbox.choices[0].value,
    "red",
    "property choices is set correctly: value"
  );
  assert.equal(
    checkbox.choices[0].locText.renderedHtml,
    "red",
    "property choices is set correctly: text"
  );
  assert.equal(
    checkbox.choices[1].value,
    "white",
    "property choices is set correctly: value"
  );
  assert.equal(
    checkbox.choices[1].locText.renderedHtml,
    "white",
    "property choices is set correctly: text"
  );
  survey.setValue("textQuestion", "newValue");
  assert.equal(
    (<Question>page.questions[0]).value,
    "newValue",
    "data interface is working"
  );
});
QUnit.test("Full survey deserialize with one question", function (assert) {
  var survey = new SurveyModel();
  new JsonObject().toObject(
    {
      pages: [
        {
          name: "page1",
          questions: [
            { type: "text", name: "textQuestion", isRequired: "true" },
            {
              type: "checkbox",
              name: "checkboxQuestion",
              isRequired: "true",
              choices: ["red", "white"],
            },
          ],
        },
      ],
    },
    survey
  );
  survey.setValue("textQuestion", "newValue");
  assert.equal(
    (<Question>survey.pages[0].questions[0]).value,
    "newValue",
    "data interface is working"
  );
});
QUnit.test(
  "Full survey deserialize with one question bypass pages object",
  function (assert) {
    var survey = new SurveyModel();
    new JsonObject().toObject(
      {
        questions: [
          { type: "text", name: "textQuestion", isRequired: "true" },
          {
            type: "checkbox",
            name: "checkboxQuestion",
            isRequired: "true",
            choices: ["red", "white"],
          },
        ],
      },
      survey
    );
    survey.setValue("textQuestion", "newValue");
    assert.equal(
      (<Question>survey.pages[0].questions[0]).value,
      "newValue",
      "data interface is working"
    );
  }
);
QUnit.test(
  "Full survey deserialize with one element bypass pages object",
  function (assert) {
    var survey = new SurveyModel();
    new JsonObject().toObject(
      {
        elements: [
          { type: "text", name: "textQuestion", isRequired: "true" },
          {
            type: "checkbox",
            name: "checkboxQuestion",
            isRequired: "true",
            choices: ["red", "white"],
          },
        ],
      },
      survey
    );
    survey.setValue("textQuestion", "newValue");
    assert.equal(
      (<Question>survey.pages[0].elements[0]).value,
      "newValue",
      "data interface is working"
    );
  }
);
QUnit.test("Serialize survey data", function (assert) {
  var survey = new SurveyModel();
  survey.setValue("question1", "value1");
  survey.setValue("question2", true);
  survey.setValue("question3", ["red", "white"]);
  var data = survey.data;
  var expectedData = {
    question1: "value1",
    question2: true,
    question3: ["red", "white"],
  };
  assert.deepEqual(data, expectedData, "check if get data works correctly");
});
QUnit.test("Deserialize survey data", function (assert) {
  var survey = new SurveyModel();
  var data = {
    question1: "value1",
    question2: true,
    question3: ["red", "white"],
  };
  survey.data = data;
  assert.equal(
    survey.getValue("question1"),
    "value1",
    "survey data for question 1"
  );
  assert.equal(
    survey.getValue("question2"),
    true,
    "survey data for question 2"
  );
  assert.deepEqual(
    survey.getValue("question3"),
    ["red", "white"],
    "survey data for question 3"
  );
});
QUnit.test("Serialize mutltiple text question", function (assert) {
  var mtQuestion = new QuestionMultipleTextModel("q1");
  mtQuestion.items.push(new MultipleTextItemModel("item1"));
  mtQuestion.items.push(new MultipleTextItemModel("item2", "text2"));
  var jsObj = new JsonObject().toJsonObject(mtQuestion);
  assert.equal(
    JSON.stringify(jsObj),
    '{"name":"q1","items":[{"name":"item1"},{"name":"item2","title":"text2"}]}',
    "serialize multiple text question"
  );
});
QUnit.test(
  "Deserialize/serialize mutltiple text question default value",
  function (assert) {
    var json = {
      name: "q",
      defaultValue: { item1: "11", item2: "22" },
      items: [
        { name: "item1", title: "Item 1" },
        { name: "item2", title: "Item 2" },
      ],
    };
    var q = new QuestionMultipleTextModel("q");
    new JsonObject().toObject(Helpers.getUnbindValue(json), q);
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.addNewPage("p");
    survey.pages[0].addElement(q);
    assert.deepEqual(
      q.defaultValue,
      json.defaultValue,
      "Default value is in object"
    );
    assert.deepEqual(q.toJSON(), json, "Default value serialized correctly");
  }
);
QUnit.test("Serialize restful choices", function (assert) {
  var question = new QuestionDropdownModel("q1");
  question.choicesByUrl.path = "name";
  var jsObj = new JsonObject().toJsonObject(question);
  assert.equal(
    JSON.stringify(jsObj),
    '{"name":"q1","choicesByUrl":{"path":"name"}}',
    "serialize choicesByUrl"
  );
});
QUnit.test("Deserialize question with missing name", function (assert) {
  var survey = new SurveyModel();
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    {
      questions: [{ type: "text", isRequired: "true" }],
    },
    survey
  );
  assert.equal(
    survey.pages[0].questions.length,
    1,
    "one question is deserialize."
  );
  assert.equal(jsonObj.errors.length, 1, "one serialization error");
  assert.equal(
    jsonObj.errors[0].type,
    "requiredproperty",
    "The required property error"
  );
});
QUnit.test("Deserialize choicesByUrl", function (assert) {
  var question = new QuestionDropdownModel("q1");
  assert.equal(
    question.choicesByUrl.isEmpty,
    true,
    "It is created, but no data"
  );
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    {
      type: "dropdown",
      name: "country",
      choicesByUrl: {
        url: "http://services.groupkt.com/country/get/all",
        path: "RestResponse;result",
      },
    },
    question
  );
  assert.equal(
    question.choicesByUrl.getType(),
    "choicesByUrl",
    "It is the real object"
  );
  assert.equal(question.choicesByUrl.isEmpty, false, "There are data");
  assert.equal(
    question.choicesByUrl.path,
    "RestResponse;result",
    "data is copied correctly"
  );
});
QUnit.test("Change choicesByUrl.path default value", function (assert) {
  const prop = Serializer.findProperty("choicesByUrl", "path");
  assert.ok(prop, "Property is here");
  prop.defaultValue = "list";
  let question = new QuestionDropdownModel("q1");
  assert.equal(question.choicesByUrl.path, "list", "Get value from property default value");
  const survey = new SurveyModel({
    elements: [
      {
        type: "dropdown",
        name: "question1",
        choicesByUrl: {
          valueName: "name"
        }
      }] });
  question = <QuestionDropdownModel>survey.getQuestionByName("question1");
  assert.equal(question.choicesByUrl.path, "list", "Get value from property default value, #2");
  prop.defaultValue = undefined;
});
QUnit.test("MatrixDropdown serialize and deserialize", function (assert) {
  var matrix = new QuestionMatrixDropdownModelBase("q1");
  matrix.columns.push(new MatrixDropdownColumn("col1"));
  matrix.columns.push(new MatrixDropdownColumn("col2"));
  var json = new JsonObject().toJsonObject(matrix);
  var matrix2 = new QuestionMatrixDropdownModelBase("q2");
  matrix2.columns.push(new MatrixDropdownColumn("col3"));
  new JsonObject().toObject(json, matrix2);
  assert.equal(matrix2.columns.length, 2, "There are two columns");
  assert.equal(matrix2.columns[0].name, "col1", "Name is correct");
  assert.equal(
    matrix2.columns[0].getType(),
    "matrixdropdowncolumn",
    "Name is correct"
  );
});

QUnit.test("Survey serialize dropdown.choices localization", function (assert) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "question1");
  q1.choices = ["val1"];
  q1.choices[0].text = "text1";
  survey.locale = "de";
  q1.choices[0].text = "de-text1";
  survey.locale = "";
  var json = new JsonObject().toJsonObject(survey);
  var checkedJson = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "dropdown",
            choices: [
              { value: "val1", text: { default: "text1", de: "de-text1" } },
            ],
            name: "question1",
          },
        ],
      },
    ],
  };
  assert.deepEqual(json, checkedJson, "Jsons should be the same");
});

QUnit.test("Survey deserialize checkbox.choices localization", function (
  assert
) {
  //{ pages: [{elements: [], name: "page1"}]}
  var question = new QuestionCheckboxModel("q1");
  var jsonObj = new JsonObject();
  jsonObj.toObject(
    { type: "checkbox", choices: [{ value: "2", text: { de: "item" } }] },
    question
  );
  assert.equal(
    (<ItemValue>question.choices[0]).locText.renderedHtml,
    "2",
    "The default locale is 2"
  );
  assert.equal(
    (<ItemValue>question.choices[0]).locText.getLocaleText("de"),
    "item",
    "The de locale is item"
  );
});

QUnit.test("Survey deserialize/serialize localization survey", function (
  assert
) {
  var survey = new SurveyModel();
  var origionalJson = {
    pages: [
      {
        elements: [
          {
            type: "checkbox",
            choices: [{ value: "2", text: { de: "second item" } }],
            name: "question1",
          },
        ],
        name: "page1",
      },
    ],
  };
  new JsonObject().toObject(origionalJson, survey);

  var newJsonObj = new JsonObject().toJsonObject(survey);
  assert.deepEqual(
    newJsonObj,
    origionalJson,
    "Two json objects should be equal"
  );
});

QUnit.test(
  "Survey deserialize dynamic matrix with different locale, Issue #507",
  function (assert) {
    var survey = new SurveyModel({
      pages: [
        {
          name: "p1",
          elements: [
            {
              type: "matrixdropdown",
              name: "q1",
              columns: [{ name: "Column 1" }],
              rows: ["Row 1", "Row 2"],
            },
          ],
        },
      ],
      locale: "zh-cn",
    });
    assert.equal(
      survey.getQuestionByName("q1").name,
      "q1",
      "Matrix deserialized successful"
    );
  }
);

QUnit.test(
  "Survey checkbox.choices serialize/deserialize custom properties",
  function (assert) {
    Serializer.addProperty("itemvalue", "imageLink");
    var question = new QuestionCheckboxModel("q1");
    var jsonObj = new JsonObject();
    var originalJson = {
      name: "q1",
      choices: [{ value: "2", imageLink: "link to image" }],
    };
    jsonObj.toObject(originalJson, question);
    assert.equal(
      (<ItemValue>question.choices[0]).locText.renderedHtml,
      "2",
      "The default locale is 2"
    );
    assert.equal(
      (<ItemValue>question.choices[0])["imageLink"],
      "link to image",
      "Custom property is deserialized"
    );
    var json = jsonObj.toJsonObject(question);
    assert.deepEqual(
      json,
      originalJson,
      "Custom property has serialized correctly"
    );
    Serializer.removeProperty("itemvalue", "imageLink");
  }
);
QUnit.test("Serialize numeric validation, minValue=0, Editor#239", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q = <Question>page.addNewQuestion("text", "question1");
  q.validators.push(new NumericValidator(0, 100));
  var json = new JsonObject().toJsonObject(q);
  var originalJson = {
    name: "question1",
    validators: [
      {
        type: "numeric",
        minValue: 0,
        maxValue: 100,
      },
    ],
  };
  assert.deepEqual(json, originalJson, "minValue should be here");
});

QUnit.test(
  "Expressions + markup https://surveyjs.answerdesk.io/ticket/details/T909",
  function (assert) {
    var json = {
      pages: [
        {
          name: "page1",
          elements: [
            {
              type: "dropdown",
              name: "Q1",
              choices: ["1", "2", "3"],
            },
            {
              type: "radiogroup",
              name: "Radio1",
              choices: [
                {
                  value: "{Q1} text",
                  text: "{Q1} text",
                },
              ],
            },
          ],
        },
      ],
    };

    var survey = new SurveyModel(json);
    var q1 = survey.getQuestionByName("Q1");
    var q2: QuestionRadiogroupModel = <any>survey.getQuestionByName("Radio1");
    survey.onTextMarkdown.add(function (survey, options) {
      options.html = options.text;
    });

    assert.equal(q2.visibleChoices[0].locText.renderedHtml, " text");

    q1.value = "1";
    assert.equal(q2.visibleChoices[0].locText.renderedHtml, "1 text");
  }
);

QUnit.test("Do not deseriabled default comment text - 'Other text:'", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  var q1 = <QuestionDropdownModel>page.addNewQuestion("dropdown", "q1");
  q1.choices = [];
  page.addNewQuestion("html", "q2");
  var originalJson = {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "dropdown",
            name: "q1",
          },
          {
            type: "html",
            name: "q2",
          },
        ],
      },
    ],
  };
  assert.deepEqual(
    survey.toJSON(),
    originalJson,
    "in questions we should have only type and name"
  );
});

QUnit.test("Test fromJSON/clone/ensureUniqueNames functionalities", function (
  assert
) {
  var survey = new SurveyModel();
  var page = survey.addNewPage("page1");
  page.title = "Test title";
  page.addNewQuestion("dropdown", "q1");
  page.fromJSON({
    elements: [
      { type: "text", name: "q11" },
      { type: "comment", name: "q22" },
    ],
  });
  assert.equal(page.questions.length, 2, "There are two questions");
  assert.equal(page.questions[0].name, "q11", "The fist question is q11");
  assert.equal(
    page.questions[0].getType(),
    "text",
    "The fist question type is text"
  );
  assert.equal(page.title, "Test title", "Reset the title");
  var clonePage = <PageModel>page.clone();
  assert.equal(clonePage.name, "page1", "Clone page: name");
  assert.equal(clonePage.title, "Test title", "Clone page: title");
  assert.equal(
    clonePage.questions.length,
    2,
    "Clone page: There are two questions"
  );
  assert.equal(
    clonePage.questions[0].name,
    "q11",
    "Clone page: The fist question is q11"
  );
  assert.equal(
    clonePage.questions[0].getType(),
    "text",
    "Clone page: The fist question type is text"
  );
  survey.ensureUniqueNames(clonePage);
  assert.equal(clonePage.name, "page2", "Clone page - unique: name");
  assert.equal(
    clonePage.questions[0].name,
    "q12",
    "Clone page - unique: The fist question is q12"
  );
  assert.equal(
    clonePage.questions[1].name,
    "q23",
    "Clone page - unique: The fist question is q23"
  );

  var clonePage2 = <PageModel>page.clone();
  survey.addPage(clonePage2);
  survey.ensureUniqueNames();
  assert.ok(survey.getPageByName("page2"), "Renamed page1->page2");
  assert.ok(survey.getQuestionByName("q12"), "Renamed q11->q12");
  assert.ok(survey.getQuestionByName("q23"), "Renamed q22->q23");
});

QUnit.test(
  "html and expression questions should not have errors, Bug#2359",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
        { name: "q1", type: "html", html: "text", isRequired: true },
        { name: "q2", type: "expression", isRequired: true },
      ],
    });
    var q1 = survey.getQuestionByName("q1");
    assert.equal(q1.hasErrors(), false, "html question doesn't have errors");
    var q2 = survey.getQuestionByName("q2");
    assert.equal(
      q2.hasErrors(),
      false,
      "expression question doesn't have isRequired errors"
    );
  }
);

QUnit.test(
  "navigationTitle property visibility",
  function (assert) {
    var survey = new SurveyModel({
      questions: [
        { name: "q1", type: "html" },
      ],
    });
    var page = survey.pages[0];
    var property = Serializer.findProperty("page", "navigationTitle");

    assert.notOk(property.isVisible("", page), "navigationTitle invisible");
    survey.showTOC = true;
    assert.ok(property.isVisible("", page), "navigationTitle visible for TOC");
    survey.showTOC = false;
    assert.notOk(property.isVisible("", page), "navigationTitle invisible");
    survey.progressBarType = "buttons";
    assert.ok(property.isVisible("", page), "navigationTitle visible for buttons nav");
  }
);
QUnit.test("choiceValuesFromQuestion properties visibility", function (assert) {
  const survey = new SurveyModel({
    questions: [
      { name: "q1", type: "dropdown", choices: [1, 2, 3] },
      { name: "q2", type: "matrixdynamic" },
      { name: "q3", type: "dropdown", choicesFromQuestion: "q1" },
      { name: "q4", type: "dropdown", choicesFromQuestion: "q2" },
      { name: "q5", type: "matrixdropdown",
        columns: [
          { name: "col1", cellType: "dropdown", choicesFromQuestion: "q1" },
          { name: "col2", cellType: "dropdown", choicesFromQuestion: "q2" }
        ]
      }
    ],
  });
  const q1 = survey.getQuestionByName("q1");
  const q3 = survey.getQuestionByName("q3");
  const q4 = survey.getQuestionByName("q4");
  const q5 = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q5");
  const col1 = q5.columns[0];
  const col2 = q5.columns[1];
  const propMode = Serializer.findProperty("dropdown", "choicesFromQuestionMode");
  const propValues = Serializer.findProperty("dropdown", "choiceValuesFromQuestion");
  const propTexts = Serializer.findProperty("dropdown", "choiceTextsFromQuestion");

  assert.equal(propMode.visibleIf(q1), false, "q1.choicesFromQuestionMode");
  assert.equal(propValues.visibleIf(q1), false, "q1.choiceValuesFromQuestion");
  assert.equal(propTexts.visibleIf(q1), false, "q1.choiceTextsFromQuestion");

  assert.equal(propMode.visibleIf(q3), true, "q3.choicesFromQuestionMode");
  assert.equal(propValues.visibleIf(q3), false, "q3.choiceValuesFromQuestion");
  assert.equal(propTexts.visibleIf(q3), false, "q3.choiceTextsFromQuestion");

  assert.equal(propMode.visibleIf(q4), false, "q4.choicesFromQuestionMode");
  assert.equal(propValues.visibleIf(q4), true, "q4.choiceValuesFromQuestion");
  assert.equal(propTexts.visibleIf(q4), true, "q4.choiceTextsFromQuestion");

  assert.equal(propMode.visibleIf(col1), true, "col1.choicesFromQuestionMode");
  assert.equal(propValues.visibleIf(col1), false, "col1.choiceValuesFromQuestion");
  assert.equal(propTexts.visibleIf(col1), false, "col1.choiceTextsFromQuestion");

  assert.equal(propMode.visibleIf(col2), false, "col2.choicesFromQuestionMode");
  assert.equal(propValues.visibleIf(col2), true, "col2.choiceValuesFromQuestion");
  assert.equal(propTexts.visibleIf(col2), true, "col2.choiceTextsFromQuestion");
});
QUnit.test("Allow to save empty string for localization strings", function (assert) {
  const survey = new SurveyModel({
    questions: [
      { name: "q1", type: "dropdown", choices: [1, 2, 3] }
    ]
  });
  const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
  assert.equal(q1.placeholder, "Select...", "Default string for placeholder");
  q1.placeholder = "test";
  assert.equal(q1.placeholder, "test", "set value for placeholder");
  q1.placeholder = "";
  assert.equal(q1.placeholder, "", "set empty string for placeholder");
  assert.strictEqual(q1.locPlaceholder.getJson(), "", "JSON has empty string");
  q1.placeholder = "test";
  assert.equal(q1.placeholder, "test", "set value for placeholder, #2");
  q1.locPlaceholder.clear();
  assert.equal(q1.placeholder, "Select...", "Clear value for placeholder");
  q1.placeholder = "test";
  assert.equal(q1.placeholder, "test", "set value for placeholder, #3");
  q1.locPlaceholder.clearLocale();
  assert.equal(q1.placeholder, "Select...", "ClearLocale for placeholder");
  q1.placeholder = "";
  assert.equal(q1.placeholder, "", "placeholder is empty");
  q1.locPlaceholder.clearLocale();
  assert.equal(q1.placeholder, "Select...", "ClearLocale for placeholder, #2");
});
QUnit.test("Allow to save empty string for trings with default value", function (assert) {
  const q = new QuestionTextModel("q1");
  assert.equal(q.minWidth, "300px", "Default value is 300px");
  q.minWidth = "";
  assert.equal(q.minWidth, "", "set empty width");
  const json = q.toJSON();
  assert.deepEqual(json, { name: "q1", minWidth: "" }, "Serialize empty minWidth");
  q.setPropertyValue("minWidth", undefined);
  assert.equal(q.minWidth, "300px", "Default value again");
  q.fromJSON({ name: "q1", minWidth: "" });
  assert.equal(q.minWidth, "", "empty width was in JSON");
});
QUnit.test("An infinitive loop occurs at e.removePosFromObj Bug#8224", function (assert) {
  ComponentCollection.Instance.add({
    name: "exampleComponentQuestion",
    elementsJSON: [
      {
        type: "checkbox",
        name: "exampleCheckbox",
      },
    ],
    onInit() {
      Serializer.addClass(
        "exampleOptions",
        [
          {
            name: "value",
            type: "dropdown",
            choices: [
              { value: 1, text: "Foo" },
              { value: 2, text: "Bar" },
              { value: 3, text: "Baz" },
            ],
          },
          { name: "text", type: "string", showMode: "form" },
          { name: "isSpecial", type: "boolean", showMode: "form" }
        ],
        undefined,
        "itemvalue"
      );
      Serializer.addProperty("exampleComponentQuestion", {
        name: "exampleOptions",
        type: "exampleOptions[]",
        visible: true,
        categoryIndex: 0,
        visibleIndex: 1,
        category: "Example Options",
      });
    },
    onLoaded(question) {
      const checkbox = question.contentPanel.getQuestionByName("exampleCheckbox");
      checkbox.choices = question.exampleOptions.map((option) => ({
        value: option.value,
        text: option.isSpecial ? option.text + " is special" : option.text,
      }));
    },
  });
  const survey = new SurveyModel({
    elements: [
      {
        type: "exampleComponentQuestion",
        name: "q1",
        exampleOptions: [
          { value: 1, text: "Foo" },
          { value: 2, text: "Bar Custom" },
          { value: 3, text: "Baz", isSpecial: true },
        ]
      },
    ],
  });
  const question = survey.getQuestionByName("q1");
  question.exampleOptions = [
    { value: 1, text: "Foo" },
    { value: 2, text: "Bar", isSpecial: true },
    { value: 3, text: "Baz Custom" }
  ];
  const json = question.toJSON();
  const opts = json.exampleOptions;
  assert.equal(opts.length, 3, "Three options");
  assert.equal(opts[0].text, "Foo", "opts[0].text");
  assert.equal(opts[1].isSpecial, true, "opts[1].isSpecial");
  assert.equal(opts[2].value, 3, "opts[2].value");

  Serializer.removeClass("exampleComponentQuestion");
  Serializer.removeClass("exampleOptions");
  ComponentCollection.Instance.clear();
});