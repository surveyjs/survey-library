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
import { Base } from "../src/base";

import { describe, test, expect } from "vitest";
describe("SurveySerialization", () => {
  test("Serialize two pages", () => {
    var survey = new SurveyModel();
    survey.addNewPage("Page 1");
    survey.addNewPage("Page 2");
    var jsObj = new JsonObject().toJsonObject(survey);
    expect(JSON.stringify(jsObj), "serialize two pages").toBe("{\"pages\":[{\"name\":\"Page 1\"},{\"name\":\"Page 2\"}]}");
  });
  test("Deserialize two pages", () => {
    var survey = new SurveyModel();
    new JsonObject().toObject(
      { pages: [{ name: "Page1" }, { name: "Page2" }] },
      survey
    );
    expect(survey.pages.length, "Two pages from json").toBe(2);
    expect(survey.pages[0].name, "property name is set").toBe("Page1");
    expect(survey.pages[0].data, "data interface is set").toBe(survey);
    expect(survey.pages[1].getType(), "it is a live object").toBe("page");
  });
  test("Serialize two questions", () => {
    var page = new PageModel("Page1");
    var textQuestion = new QuestionTextModel("textQuestion");
    textQuestion.isRequired = true;
    var checkBoxQuestion = new QuestionCheckboxModel("checkboxQuestion");
    checkBoxQuestion.choices = ["red", "white"];
    checkBoxQuestion.isRequired = true;
    checkBoxQuestion.showCommentArea = true;
    page.addQuestion(textQuestion);
    page.addQuestion(checkBoxQuestion);
    var jsObj = new JsonObject().toJsonObject(page);
    expect(JSON.stringify(jsObj), "serialize two questions").toBe("{\"name\":\"Page1\",\"elements\":[{\"type\":\"text\",\"name\":\"textQuestion\",\"isRequired\":true},{\"type\":\"checkbox\",\"name\":\"checkboxQuestion\",\"isRequired\":true,\"showCommentArea\":true,\"choices\":[\"red\",\"white\"]}]}");
  });
  test("Deserialize two questions", () => {
    var survey = new SurveyModel();
    var page = new PageModel("Page1");
    survey.addPage(page);
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
      page
    );
    var checkbox: any = page.questions[1];
    expect(page.questions.length, "Two questions from json").toBe(2);
    expect(page.questions[0].name, "property name is set").toBe("textQuestion");
    expect(page.questions[1].getType(), "it is a live object").toBe("checkbox");
    expect(checkbox.choices.length, "property choices is set correctly: length").toBe(2);
    expect(checkbox.choices[0].value, "property choices is set correctly: value").toBe("red");
    expect(checkbox.choices[0].locText.renderedHtml, "property choices is set correctly: text").toBe("red");
    expect(checkbox.choices[1].value, "property choices is set correctly: value").toBe("white");
    expect(checkbox.choices[1].locText.renderedHtml, "property choices is set correctly: text").toBe("white");
    survey.setValue("textQuestion", "newValue");
    expect((<Question>page.questions[0]).value, "data interface is working").toBe("newValue");
  });
  test("Full survey deserialize with one question", () => {
    var survey = new SurveyModel();
    new JsonObject().toObject(
      {
        pages: [
          {
            name: "page1",
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
        ],
      },
      survey
    );
    survey.setValue("textQuestion", "newValue");
    expect((<Question>survey.pages[0].questions[0]).value, "data interface is working").toBe("newValue");
  });
  test("Full survey deserialize with one question bypass pages object", () => {
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
    expect((<Question>survey.pages[0].questions[0]).value, "data interface is working").toBe("newValue");
  });
  test("Full survey deserialize with one element bypass pages object", () => {
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
    expect((<Question>survey.pages[0].elements[0]).value, "data interface is working").toBe("newValue");
  });
  test("Serialize survey data", () => {
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
    expect(data, "check if get data works correctly").toEqualValues(expectedData);
  });
  test("Deserialize survey data", () => {
    var survey = new SurveyModel();
    var data = {
      question1: "value1",
      question2: true,
      question3: ["red", "white"],
    };
    survey.data = data;
    expect(survey.getValue("question1"), "survey data for question 1").toBe("value1");
    expect(survey.getValue("question2"), "survey data for question 2").toBe(true);
    expect(survey.getValue("question3"), "survey data for question 3").toEqualValues(["red", "white"]);
  });
  test("Serialize mutltiple text question", () => {
    var mtQuestion = new QuestionMultipleTextModel("q1");
    mtQuestion.items.push(new MultipleTextItemModel("item1"));
    mtQuestion.items.push(new MultipleTextItemModel("item2", "text2"));
    var jsObj = new JsonObject().toJsonObject(mtQuestion);
    expect(JSON.stringify(jsObj), "serialize multiple text question").toBe("{\"name\":\"q1\",\"items\":[{\"name\":\"item1\"},{\"name\":\"item2\",\"title\":\"text2\"}]}");
  });
  test("Deserialize/serialize mutltiple text question default value", () => {
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
    expect(q.defaultValue, "Default value is in object").toEqualValues(json.defaultValue);
    expect(q.toJSON(), "Default value serialized correctly").toEqualValues(json);
  });
  test("Serialize restful choices", () => {
    var question = new QuestionDropdownModel("q1");
    question.choicesByUrl.path = "name";
    var jsObj = new JsonObject().toJsonObject(question);
    expect(JSON.stringify(jsObj), "serialize choicesByUrl").toBe("{\"name\":\"q1\",\"choicesByUrl\":{\"path\":\"name\"}}");
  });
  test("Deserialize question with missing name", () => {
    var survey = new SurveyModel();
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      {
        elements: [{ type: "text", isRequired: "true" }],
      },
      survey
    );
    expect(survey.pages[0].questions.length, "one question is deserialize.").toBe(1);
    expect(jsonObj.errors.length, "one serialization error").toBe(1);
    expect(jsonObj.errors[0].type, "The required property error").toBe("requiredproperty");
  });
  test("Deserialize choicesByUrl", () => {
    var question = new QuestionDropdownModel("q1");
    expect(question.choicesByUrl.isEmpty, "It is created, but no data").toBe(true);
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
    expect(question.choicesByUrl.getType(), "It is the real object").toBe("choicesByUrl");
    expect(question.choicesByUrl.isEmpty, "There are data").toBe(false);
    expect(question.choicesByUrl.path, "data is copied correctly").toBe("RestResponse;result");
  });
  test("Change choicesByUrl.path default value", () => {
    const prop = Serializer.findProperty("choicesByUrl", "path");
    expect(prop, "Property is here").toBeTruthy();
    prop.defaultValue = "list";
    let question = new QuestionDropdownModel("q1");
    expect(question.choicesByUrl.path, "Get value from property default value").toBe("list");
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
    expect(question.choicesByUrl.path, "Get value from property default value, #2").toBe("list");
    prop.defaultValue = undefined;
  });
  test("MatrixDropdown serialize and deserialize", () => {
    var matrix = new QuestionMatrixDropdownModelBase("q1");
    matrix.columns.push(new MatrixDropdownColumn("col1"));
    matrix.columns.push(new MatrixDropdownColumn("col2"));
    var json = new JsonObject().toJsonObject(matrix);
    var matrix2 = new QuestionMatrixDropdownModelBase("q2");
    matrix2.columns.push(new MatrixDropdownColumn("col3"));
    new JsonObject().toObject(json, matrix2);
    expect(matrix2.columns.length, "There are two columns").toBe(2);
    expect(matrix2.columns[0].name, "Name is correct").toBe("col1");
    expect(matrix2.columns[0].getType(), "Name is correct").toBe("matrixdropdowncolumn");
  });

  test("Survey serialize dropdown.choices localization", () => {
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
    expect(json, "Jsons should be the same").toEqualValues(checkedJson);
  });

  test("Survey deserialize checkbox.choices localization", () => {
  //{ pages: [{elements: [], name: "page1"}]}
    var question = new QuestionCheckboxModel("q1");
    var jsonObj = new JsonObject();
    jsonObj.toObject(
      { type: "checkbox", choices: [{ value: "2", text: { de: "item" } }] },
      question
    );
    expect((<ItemValue>question.choices[0]).locText.renderedHtml, "The default locale is 2").toBe("2");
    expect((<ItemValue>question.choices[0]).locText.getLocaleText("de"), "The de locale is item").toBe("item");
  });

  test("Survey deserialize/serialize localization survey", () => {
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
    expect(newJsonObj, "Two json objects should be equal").toEqualValues(origionalJson);
  });

  test("Survey deserialize dynamic matrix with different locale, Issue #507", () => {
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
    expect(survey.getQuestionByName("q1").name, "Matrix deserialized successful").toBe("q1");
  });

  test("Survey checkbox.choices serialize/deserialize custom properties", () => {
    Serializer.addProperty("itemvalue", "imageLink");
    var question = new QuestionCheckboxModel("q1");
    var jsonObj = new JsonObject();
    var originalJson = {
      name: "q1",
      choices: [{ value: "2", imageLink: "link to image" }],
    };
    jsonObj.toObject(originalJson, question);
    expect((<ItemValue>question.choices[0]).locText.renderedHtml, "The default locale is 2").toBe("2");
    expect((<ItemValue>question.choices[0])["imageLink"], "Custom property is deserialized").toBe("link to image");
    var json = jsonObj.toJsonObject(question);
    expect(json, "Custom property has serialized correctly").toEqualValues(originalJson);
    Serializer.removeProperty("itemvalue", "imageLink");
  });
  test("Serialize numeric validation, minValue=0, Editor#239", () => {
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
    expect(json, "minValue should be here").toEqualValues(originalJson);
  });

  test("Expressions + markup https://surveyjs.answerdesk.io/ticket/details/T909", () => {
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

    expect(q2.visibleChoices[0].locText.renderedHtml).toBe(" text");

    q1.value = "1";
    expect(q2.visibleChoices[0].locText.renderedHtml).toBe("1 text");
  });

  test("Do not deseriabled default comment text - 'Other text:'", () => {
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
    expect(survey.toJSON(), "in questions we should have only type and name").toEqualValues(originalJson);
  });

  test("Test fromJSON/clone/ensureUniqueNames functionalities", () => {
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
    expect(page.questions.length, "There are two questions").toBe(2);
    expect(page.questions[0].name, "The fist question is q11").toBe("q11");
    expect(page.questions[0].getType(), "The fist question type is text").toBe("text");
    expect(page.title, "Reset the title").toBe("Test title");
    var clonePage = <PageModel>page.clone();
    expect(clonePage.name, "Clone page: name").toBe("page1");
    expect(clonePage.title, "Clone page: title").toBe("Test title");
    expect(clonePage.questions.length, "Clone page: There are two questions").toBe(2);
    expect(clonePage.questions[0].name, "Clone page: The fist question is q11").toBe("q11");
    expect(clonePage.questions[0].getType(), "Clone page: The fist question type is text").toBe("text");
    survey.ensureUniqueNames(clonePage);
    expect(clonePage.name, "Clone page - unique: name").toBe("page2");
    expect(clonePage.questions[0].name, "Clone page - unique: The fist question is q12").toBe("q12");
    expect(clonePage.questions[1].name, "Clone page - unique: The fist question is q23").toBe("q23");

    var clonePage2 = <PageModel>page.clone();
    survey.addPage(clonePage2);
    survey.ensureUniqueNames();
    expect(survey.getPageByName("page2"), "Renamed page1->page2").toBeTruthy();
    expect(survey.getQuestionByName("q12"), "Renamed q11->q12").toBeTruthy();
    expect(survey.getQuestionByName("q23"), "Renamed q22->q23").toBeTruthy();
  });

  test("html and expression questions should not have errors, Bug#2359", () => {
    var survey = new SurveyModel({
      elements: [
        { name: "q1", type: "html", html: "text", isRequired: true },
        { name: "q2", type: "expression", isRequired: true },
      ],
    });
    var q1 = survey.getQuestionByName("q1");
    expect(q1.validate(), "html question doesn't have errors").toBe(true);
    var q2 = survey.getQuestionByName("q2");
    expect(q2.validate(), "expression question doesn't have isRequired errors").toBe(true);
  });
  test("choiceValuesFromQuestion properties visibility", () => {
    const survey = new SurveyModel({
      elements: [
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

    expect(propMode.visibleIf(q1), "q1.choicesFromQuestionMode").toBe(false);
    expect(propValues.visibleIf(q1), "q1.choiceValuesFromQuestion").toBe(false);
    expect(propTexts.visibleIf(q1), "q1.choiceTextsFromQuestion").toBe(false);

    expect(propMode.visibleIf(q3), "q3.choicesFromQuestionMode").toBe(true);
    expect(propValues.visibleIf(q3), "q3.choiceValuesFromQuestion").toBe(false);
    expect(propTexts.visibleIf(q3), "q3.choiceTextsFromQuestion").toBe(false);

    expect(propMode.visibleIf(q4), "q4.choicesFromQuestionMode").toBe(false);
    expect(propValues.visibleIf(q4), "q4.choiceValuesFromQuestion").toBe(true);
    expect(propTexts.visibleIf(q4), "q4.choiceTextsFromQuestion").toBe(true);

    expect(propMode.visibleIf(col1), "col1.choicesFromQuestionMode").toBe(true);
    expect(propValues.visibleIf(col1), "col1.choiceValuesFromQuestion").toBe(false);
    expect(propTexts.visibleIf(col1), "col1.choiceTextsFromQuestion").toBe(false);

    expect(propMode.isVisible("", col1), "col1.choicesFromQuestionMode, isVisible").toBe(true);
    expect(propValues.isVisible("", col1), "col1.choiceValuesFromQuestion, isVisible").toBe(false);
    expect(propTexts.isVisible("", col1), "col1.choiceTextsFromQuestion, isVisible").toBe(false);

    expect(propMode.visibleIf(col2), "col2.choicesFromQuestionMode").toBe(false);
    expect(propValues.visibleIf(col2), "col2.choiceValuesFromQuestion").toBe(true);
    expect(propTexts.visibleIf(col2), "col2.choiceTextsFromQuestion").toBe(true);

    expect(propMode.isVisible("", col2), "col2.choicesFromQuestionMode, isVisible").toBe(false);
    expect(propValues.isVisible("", col2), "col2.choiceValuesFromQuestion, isVisible").toBe(true);
    expect(propTexts.isVisible("", col2), "col2.choiceTextsFromQuestion, isVisible").toBe(true);
  });
  test("choiceValuesFromQuestion properties visibility for column in design time, bug#9741", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        { name: "q1", type: "dropdown", choices: [1, 2, 3] },
        { name: "q2", type: "matrixdynamic" },
        { name: "q3", type: "matrixdropdown",
          columns: [
            { name: "col1", cellType: "dropdown", choicesFromQuestion: "q1" },
            { name: "col2", cellType: "dropdown", choicesFromQuestion: "q2" },
            { name: "col3", cellType: "dropdown" },
            { name: "col4", cellType: "dropdown" }
          ]
        }
      ],
    });
    const q3 = <QuestionMatrixDropdownModelBase>survey.getQuestionByName("q3");
    const col1 = q3.columns[0];
    const col2 = q3.columns[1];
    const col3 = q3.columns[2];
    const col4 = q3.columns[3];
    col3.choicesFromQuestion = "q1";
    col4.choicesFromQuestion = "q2";
    const propMode = Serializer.findProperty("dropdown", "choicesFromQuestionMode");
    const propValues = Serializer.findProperty("dropdown", "choiceValuesFromQuestion");
    const propTexts = Serializer.findProperty("dropdown", "choiceTextsFromQuestion");

    expect(propMode.isVisible("", col1), "col1.choicesFromQuestionMode, isVisible").toBe(true);
    expect(propValues.isVisible("", col1), "col1.choiceValuesFromQuestion, isVisible").toBe(false);
    expect(propTexts.isVisible("", col1), "col1.choiceTextsFromQuestion, isVisible").toBe(false);

    expect(propMode.isVisible("", col2), "col2.choicesFromQuestionMode, isVisible").toBe(false);
    expect(propValues.isVisible("", col2), "col2.choiceValuesFromQuestion, isVisible").toBe(true);
    expect(propTexts.isVisible("", col2), "col2.choiceTextsFromQuestion, isVisible").toBe(true);

    expect(propMode.isVisible("", col3), "col3.choicesFromQuestionMode, isVisible").toBe(true);
    expect(propValues.isVisible("", col3), "col3.choiceValuesFromQuestion, isVisible").toBe(false);
    expect(propTexts.isVisible("", col3), "col3.choiceTextsFromQuestion, isVisible").toBe(false);

    expect(propMode.isVisible("", col4), "col4.choicesFromQuestionMode, isVisible").toBe(false);
    expect(propValues.isVisible("", col4), "col4.choiceValuesFromQuestion, isVisible").toBe(true);
    expect(propTexts.isVisible("", col4), "col4.choiceTextsFromQuestion, isVisible").toBe(true);
  });
  test("Allow to save empty string for localization strings", () => {
    const survey = new SurveyModel({
      elements: [
        { name: "q1", type: "dropdown", choices: [1, 2, 3] }
      ]
    });
    const q1 = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(q1.placeholder, "Default string for placeholder").toBe("Select...");
    q1.placeholder = "test";
    expect(q1.placeholder, "set value for placeholder").toBe("test");
    q1.placeholder = "";
    expect(q1.placeholder, "set empty string for placeholder").toBe("");
    expect(q1.locPlaceholder.getJson(), "JSON has empty string").toBe("");
    q1.placeholder = "test";
    expect(q1.placeholder, "set value for placeholder, #2").toBe("test");
    q1.locPlaceholder.clear();
    expect(q1.placeholder, "Clear value for placeholder").toBe("Select...");
    q1.placeholder = "test";
    expect(q1.placeholder, "set value for placeholder, #3").toBe("test");
    q1.locPlaceholder.clearLocale();
    expect(q1.placeholder, "ClearLocale for placeholder").toBe("Select...");
    q1.placeholder = "";
    expect(q1.placeholder, "placeholder is empty").toBe("");
    q1.locPlaceholder.clearLocale();
    expect(q1.placeholder, "ClearLocale for placeholder, #2").toBe("Select...");
  });
  test("Allow to save empty string for trings with default value", () => {
    const q = new QuestionTextModel("q1");
    expect(q.minWidth, "Default value is 300px").toBe("300px");
    q.minWidth = "";
    expect(q.minWidth, "set empty width").toBe("");
    const json = q.toJSON();
    expect(json, "Serialize empty minWidth").toEqualValues({ name: "q1", minWidth: "" });
    q.setPropertyValue("minWidth", undefined);
    expect(q.minWidth, "Default value again").toBe("300px");
    q.fromJSON({ name: "q1", minWidth: "" });
    expect(q.minWidth, "empty width was in JSON").toBe("");
  });
  test("An infinitive loop occurs at e.removePosFromObj Bug#8224", () => {
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
    expect(opts.length, "Three options").toBe(3);
    expect(opts[0].text, "opts[0].text").toBe("Foo");
    expect(opts[1].isSpecial, "opts[1].isSpecial").toBe(true);
    expect(opts[2].value, "opts[2].value").toBe(3);

    Serializer.removeClass("exampleComponentQuestion");
    Serializer.removeClass("exampleOptions");
  });
  test("Create custom property in multiple text item, Issue#10706", () => {
    Serializer.addProperty("multipletextitem", "customProp1");

    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "q1",
          items: [
            { name: "item1", customProp1: "value1" }
          ]
        }
      ]
    });
    const q = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    expect((<any>q.items[0])["customProp1"], "custom property is deserialized").toBe("value1");
    expect(q.items[0].getPropertyValue("customProp1"), "custom property is deserialized by getPropertyByName").toBe("value1");

    const changes: any[] = [];
    survey.onPropertyValueChangedCallback = (
      name: string,
      oldValue: any,
      newValue: any,
      sender: Base
    ): void => {
      changes.push({ type: sender.getType(), name: name, oldValue: oldValue, newValue: newValue });
    };
    (<any>q.items[0])["customProp1"] = "value2";
    const json = q.toJSON();
    expect(json.items[0]["customProp1"], "custom property is serialized").toBe("value2");
    expect(changes, "one property changed event is fired").toEqualValues([{ type: "multipletextitem", name: "customProp1", oldValue: "value1", newValue: "value2" }
    ]);

    Serializer.removeProperty("multipletextitem", "customProp1");
  });
});
