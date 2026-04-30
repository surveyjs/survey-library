import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  ComponentCollection,
} from "../src/question_custom";
import { JsonObject, Serializer } from "../src/jsonobject";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionTextModel } from "../src/question_text";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { ItemValue } from "../src/itemvalue";
import { LocalizableString } from "../src/localizablestring";
import { PanelModel } from "../src/panel";
import { ArrayChanges, Base } from "../src/base";
import { QuestionFileModel } from "../src/question_file";
import { ConsoleWarnings } from "../src/console-warnings";
import { setOldTheme } from "./oldTheme";
import { SurveyElement } from "../src/survey-element";
import { ValueGetter } from "../src/conditions/conditionProcessValue";

import { describe, test, expect } from "vitest";
describe("custom questions", () => {
  test("Single: Register and load from json", () => {
    var json = {
      name: "newquestion",
      questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1", title: "my title" }],
    });
    expect(survey.getAllQuestions().length, "Question is created").toLooseEqual(1);
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.getType(), "type is correct").toLooseEqual("newquestion");
    expect(q.name, "name is correct").toLooseEqual("q1");
    const propName = Serializer.findProperty("newquestion", "name");
    expect(propName.getValue(q), "prop.name is correct").toLooseEqual("q1");
    expect(q.getPropertyValue("name"), "getPropertyValue is correct").toLooseEqual("q1");
    expect(Serializer.getObjPropertyValue(q, "name"), "getObjPropertyValue is correct, #name").toLooseEqual("q1");
    expect(Serializer.getObjPropertyValue(q, "title"), "getObjPropertyValue is correct, #title").toLooseEqual("my title");
    expect(q.contentQuestion.getType(), "Type for question is correct").toLooseEqual("dropdown");
    expect(q.contentQuestion.choices.length, "There are five choices").toLooseEqual(5);
    expect(survey.toJSON(), "Seralized correctly").toEqualValues({
      pages: [
        { name: "page1", elements: [{ type: "newquestion", name: "q1", title: "my title" }] },
      ],
    });
  });

  test("Composite: Register and load from json", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1" }],
    });
    expect(survey.getAllQuestions().length, "Question is created").toLooseEqual(1);
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.getType(), "type is correct").toLooseEqual("customerinfo");
    expect(q.name, "name is correct").toLooseEqual("q1");
    expect(q.contentPanel.elements.length, "There are two elements in panel").toLooseEqual(2);
  });

  test("Single: Create the wrapper question and sync the value", () => {
    var json = {
      name: "newquestion",
      questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.contentQuestion.getType(), "Question the type was created").toLooseEqual("dropdown");
    q.value = 1;
    expect(q.contentQuestion.value, "Set value to wrapper value").toLooseEqual(1);
    q.contentQuestion.value = 2;
    expect(q.value, "Set value to custom question").toLooseEqual(2);
  });

  test("Composite: sync values", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    var lastName = q.contentPanel.getQuestionByName("lastName");
    firstName.value = "John";
    expect(survey.data).toEqualValues({ q1: { firstName: "John" } });
    q.value = { firstName: "Andrew", lastName: "Telnov" };
    expect(firstName.value, "question value is replaced").toLooseEqual("Andrew");
    expect(lastName.value, "question value is set").toLooseEqual("Telnov");
  });
  test("Single: read-only", () => {
    var json = {
      name: "newquestion",
      questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1", readOnly: true }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.isReadOnly, "root is readOnly").toLooseEqual(true);
    expect(q.contentQuestion.isReadOnly, "contentQuestion is read Only").toLooseEqual(true);
    q.readOnly = false;
    expect(q.contentQuestion.isReadOnly, "contentQuestion is not read only").toLooseEqual(false);
    q.readOnly = true;
    expect(q.contentQuestion.isReadOnly, "contentQuestion is read only again").toLooseEqual(true);
  });
  test("Composite: read only", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1", readOnly: true }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    expect(q.isReadOnly, "root is readOnly").toLooseEqual(true);
    expect(q.contentPanel.isReadOnly, "contentPanel is read Only").toLooseEqual(true);
    expect(firstName.isReadOnly, "firstName is read Only").toLooseEqual(true);
    q.readOnly = false;
    expect(q.contentPanel.isReadOnly, "contentQuestion is not read only").toLooseEqual(false);
    expect(firstName.isReadOnly, "firstName is not read Only").toLooseEqual(false);
    q.readOnly = true;
    expect(q.contentPanel.isReadOnly, "contentPanel is read only again").toLooseEqual(true);
    expect(firstName.isReadOnly, "firstName is read Only again").toLooseEqual(true);
  });
  test("Single: hasError", () => {
    var json = {
      name: "newquestion",
      questionJSON: {
        type: "dropdown",
        choices: [1, 2, 3, 4, 5],
        isRequired: true,
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.validate(), "contentQuestion is required").toLooseEqual(false);
    expect(q.errors.length, "There is one error").toLooseEqual(1);
    q.contentQuestion.value = 1;
    expect(q.validate(), "contentQuestion has value").toLooseEqual(true);
  });
  test("Single: hasError/isRequired", () => {
    var json = {
      name: "newquestion",
      questionJSON: {
        type: "dropdown",
        choices: [1, 2, 3, 4, 5],
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1", isRequired: true }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.validate(), "contentQuestion is required").toLooseEqual(false);
    expect(q.errors.length, "There is one error").toLooseEqual(1);
    q.contentQuestion.value = 1;
    expect(q.validate(), "contentQuestion has value").toLooseEqual(true);
  });
  test("Composite: validate", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName", isRequired: true },
        { type: "text", name: "lastName" },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    expect(q.validate(), "firstName is required").toLooseEqual(false);
    firstName.value = "abc";
    expect(q.validate(), "firstName has value").toLooseEqual(true);
  });
  test("Composite: validate/errors/isRequired", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1", isRequired: true }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    expect(q.validate(), "question is empty").toLooseEqual(false);
    firstName.value = "abc";
    expect(q.validate(), "question is not empty").toLooseEqual(true);
  });

  test("Composite: onPropertyChanged", () => {
    var json = {
      name: "customerInfo",
      elementsJSON: [
        { type: "text", name: "firstName", isRequired: true },
        { type: "text", name: "lastName" },
      ],
      onInit() {
        Serializer.addProperty("customerInfo", {
          name: "showLastName:boolean",
          default: true,
        });
      },
      onPropertyChanged: function (question, propertyName, newValue) {
        if (propertyName == "showLastName") {
          question.contentPanel.getQuestionByName("lastName").visible = newValue;
        }
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var lastName = q.contentPanel.getQuestionByName("lastName");
    expect(lastName.visible, "It is visible by default").toLooseEqual(true);
    q.showLastName = false;
    expect(lastName.visible, "showLastName is false").toLooseEqual(false);
    q.showLastName = true;
    expect(lastName.visible, "showLastName is true").toLooseEqual(true);
  });
  test("Single: create from code", () => {
    var json = {
      name: "newquestion",
      createQuestion: function () {
        var res = new QuestionDropdownModel("question");
        res.choices = [1, 2, 3, 4, 5];
        return res;
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.contentQuestion.getType(), "content question created correctly").toLooseEqual("dropdown");
    expect(q.contentQuestion.choices.length, "content question choices are here").toLooseEqual(5);
  });
  test("Composite: create from code", () => {
    var json = {
      name: "customerinfo",
      createElements: function (panel) {
        panel.addNewQuestion("text", "firstName");
        panel.addNewQuestion("text", "lastName");
        panel.questions[0].isRequired = true;
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    var lastName = q.contentPanel.getQuestionByName("lastName");
    expect(firstName.getType(), "first name is creted").toLooseEqual("text");
    expect(lastName.getType(), "last name is creted").toLooseEqual("text");
    expect(firstName.isRequired, "first name is required").toLooseEqual(true);
  });
  test("Composite: content questions numbering", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName", isRequired: true },
        { type: "text", name: "lastName" },
      ],
      onCreated: function (question) {
        question.contentPanel.getQuestionByName(
          "lastName"
        ).startWithNewLine = false;
        question.contentPanel.showQuestionNumbers = "onpanel";
        question.contentPanel.questionStartIndex = "a.";
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        { type: "text", name: "q1" },
        { type: "customerinfo", name: "q2" },
        { type: "text", name: "q3" },
      ],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[1];
    var lastName = q.contentPanel.getQuestionByName("lastName");
    expect(lastName.startWithNewLine, "onCreated function is called").toLooseEqual(false);
    expect(lastName.visibleIndex, "second question").toLooseEqual(1);
    expect(lastName.no, "second question, no is 'b.'").toLooseEqual("b.");
  });
  test("Composite: content questions numbering, continues, Bug#10324", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName", isRequired: true },
        { type: "text", name: "lastName" },
      ],
      onCreated: function (question) {
        question.contentPanel.showQuestionNumbers = "default";
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        { type: "text", name: "q1" },
        { type: "customerinfo", name: "q2" },
        { type: "text", name: "q3" },
      ],
    });
    const q = <QuestionCompositeModel>survey.getQuestionByName("q2");
    const firstName = q.contentPanel.getQuestionByName("firstName");
    const lastName = q.contentPanel.getQuestionByName("lastName");
    const q3 = survey.getQuestionByName("q3");
    expect(q.no, "q no is '2.'").toLooseEqual("2.");
    expect(firstName.no, "first question, no is '3.'").toLooseEqual("3.");
    expect(lastName.no, "second question, no is '4.'").toLooseEqual("4.");
    expect(q3.no, "q3 no is '5.'").toLooseEqual("5.");
  });
  test("Composite: content questions recursive numbering, Bug#10218", () => {
    ComponentCollection.Instance.add({
      name: "customerinfo",
      elementsJSON: [
        { type: "panel", name: "contentPanel", showQuestionNumbers: "recursive", elements: [
          { type: "text", name: "firstName" },
          { type: "text", name: "lastName" }
        ] }
      ],
      onCreated: function (question) {
        question.contentPanel.showQuestionNumbers = "recursive";
        question.contentPanel.questionStartIndex = "a.";
      },
    });
    var survey = new SurveyModel({
      showQuestionNumbers: true,
      elements: [
        { type: "text", name: "q1" },
        { type: "customerinfo", name: "q2" },
        { type: "text", name: "q3" },
      ],
    });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[1];
    const firstName = q.contentPanel.getQuestionByName("firstName");
    const lastName = q.contentPanel.getQuestionByName("lastName");
    expect(q.visibleIndex, "q visibleIndex").toLooseEqual(1);
    expect(q.no, "q no is '2.'").toLooseEqual("2.");
    expect(q.contentPanel.no, "q contentPanel no is '2.'").toLooseEqual("2.");
    expect(firstName.no, "first question, no is '2a.'").toLooseEqual("2.a.");
    expect(lastName.no, "second question, no is '2b.'").toLooseEqual("2.b.");
  });
  test("Composite: content questions recursive numbering at design-time, Bug#10389 & Bug#10418", () => {
    ComponentCollection.Instance.add({
      name: "customerinfo",
      elementsJSON: [
        { type: "panel", name: "contentPanel", showQuestionNumbers: "recursive", elements: [
          { type: "text", name: "firstName" },
          { type: "text", name: "lastName" }
        ] }
      ],
      onCreated: function (question) {
        question.contentPanel.showQuestionNumbers = "recursive";
        question.contentPanel.questionStartIndex = "a";
      },
    });
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      showQuestionNumbers: "recursive",
      elements: [
        { type: "text", name: "q1" },
        { type: "customerinfo", name: "q2" },
        { type: "text", name: "q3" },
      ],
    });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[1];
    const firstName = q.contentPanel.getQuestionByName("firstName");
    const lastName = q.contentPanel.getQuestionByName("lastName");
    const q3 = survey.getQuestionByName("q3");
    expect(q.visibleIndex, "q visibleIndex").toLooseEqual(1);
    expect(q.no, "q no is '2.'").toLooseEqual("2.");
    expect(q.contentPanel.no, "q contentPanel no is '2.'").toLooseEqual("2.");
    expect(firstName.no, "first question, no is '2a.'").toLooseEqual("2.a");
    expect(lastName.no, "second question, no is '2b.'").toLooseEqual("2.b");
    expect(q3.no, "q3 no is '3.'").toLooseEqual("3.");
  });
  test("Composite: content questions recursive numbering in run-time, Bug#10389 & Bug#10418", () => {
    ComponentCollection.Instance.add({
      name: "customerinfo",
      elementsJSON: [
        { type: "panel", name: "contentPanel", showQuestionNumbers: "recursive", elements: [
          { type: "text", name: "firstName" },
          { type: "text", name: "lastName" }
        ] }
      ],
      onCreated: function (question) {
        question.contentPanel.showQuestionNumbers = "recursive";
        question.contentPanel.questionStartIndex = "a.";
      },
    });
    const survey = new SurveyModel({
      showQuestionNumbers: "recursive",
      elements: [
        { type: "text", name: "q1" },
        { type: "customerinfo", name: "q2" },
        { type: "text", name: "q3" },
      ],
    });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[1];
    const firstName = q.contentPanel.getQuestionByName("firstName");
    const lastName = q.contentPanel.getQuestionByName("lastName");
    const q3 = survey.getQuestionByName("q3");
    expect(q.visibleIndex, "q visibleIndex").toLooseEqual(1);
    expect(q.no, "q no is '2.'").toLooseEqual("2.");
    expect(q.contentPanel.no, "q contentPanel no is '2.'").toLooseEqual("2.");
    expect(firstName.no, "first question, no is '2a.'").toLooseEqual("2.a.");
    expect(lastName.no, "second question, no is '2b.'").toLooseEqual("2.b.");
    expect(q3.no, "q3 no is '3.'").toLooseEqual("3.");
  });
  test("Custom, get css from contentQuestion", () => {
    var survey = new SurveyModel();
    setOldTheme(survey);
    survey.css.dropdown.small = "small";
    survey.css.dropdown.title = "title";
    survey.css.question.titleOnAnswer = "onAnswer";
    var json = {
      name: "newquestion",
      createQuestion: function () {
        var res = new QuestionDropdownModel("question");
        res.choices = [1, 2, 3, 4, 5];
        return res;
      },
    };
    ComponentCollection.Instance.add(json);
    survey.fromJSON({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    var q1 = survey.getQuestionByName("q1");
    var defaultQuestionRoot = survey.css.question.mainRoot;
    expect(q1.cssRoot, "Default question root, take small from dropdown").toLooseEqual(defaultQuestionRoot + " small");
    expect(q1.cssTitle, "Default question title").toLooseEqual("title");
    q1.titleLocation = "left";
    var addLeft = " " + survey.css.question.titleLeftRoot;
    expect(q1.cssRoot, "titleLocation = left, take small from dropdown").toLooseEqual(defaultQuestionRoot + addLeft + " small");
    q1.titleLocation = "default";
    q1.value = 1;
    expect(q1.isEmpty(), "q1 is not empty").toLooseEqual(false);
    expect(q1.cssTitle, "q1 is not empty, show in title").toLooseEqual("title onAnswer");
    q1.clearValue();
    expect(q1.isEmpty(), "q1 is empty").toLooseEqual(true);
    expect(q1.cssTitle).toLooseEqual("title");
    q1.contentQuestion.value = 1;
    expect(q1.cssTitle, "q1 is not empty, show in title, via contentQuestion").toLooseEqual("title onAnswer");
  });
  test("Composite, update panel css", () => {
    var survey = new SurveyModel();
    setOldTheme(survey);
    survey.css.question.small = "small";
    survey.css.question.title = "title";
    survey.css.question.titleOnAnswer = "onAnswer";
    survey.css.customerinfo = { mainRoot: "customercss" };
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName", isRequired: true },
        { type: "text", name: "lastName" },
      ],
      onCreated: function (question) {
        question.contentPanel.getQuestionByName(
          "lastName"
        ).startWithNewLine = false;
      },
    };
    ComponentCollection.Instance.add(json);
    survey.fromJSON({
      elements: [{ type: "customerinfo", name: "q1" }],
    });
    var q1 = survey.getQuestionByName("q1");
    expect(q1.cssRoot, "apply style from customer info").toLooseEqual("customercss small");
    var lastName = q1.contentPanel.getQuestionByName("lastName");
    var defaultQuestionRoot = survey.css.question.mainRoot;
    expect(lastName.cssRoot, "Update content question css").toLooseEqual(defaultQuestionRoot + " small");
    lastName.value = "val";
    expect(q1.isEmpty(), "q1 is not empty").toLooseEqual(false);
    expect(q1.cssTitle, "q1 is not empty, show in title").toLooseEqual("title onAnswer");
    lastName.clearValue();
    expect(q1.isEmpty(), "q1 is empty").toLooseEqual(true);
    expect(q1.cssTitle, "q1 is clear").toLooseEqual("title");
    q1.value = { lastName: "val" };
    expect(q1.cssTitle, "q1 is not empty, show in title, via lastName").toLooseEqual("title onAnswer");
  });
  test("Single: defaultValue", () => {
    var json = {
      name: "newquestion",
      questionJSON: {
        type: "dropdown",
        choices: [1, 2, 3, 4, 5],
        defaultValue: 2,
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1", isRequired: true }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.value, "defaultValue is set").toLooseEqual(2);
    expect(q.contentQuestion.value, "defaultValue is set for contentQuestion").toLooseEqual(2);
    expect(survey.data, "set data into survey").toEqualValues({ q1: 2 });
  });
  test("Single: defaultValue + valueName", () => {
    var json = {
      name: "newquestion",
      questionJSON: {
        type: "dropdown",
        choices: [1, 2, 3, 4, 5],
        defaultValue: 2,
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1", isRequired: true, valueName: "QQQ1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.value, "defaultValue is set").toLooseEqual(2);
    expect(q.contentQuestion.value, "defaultValue is set for contentQuestion").toLooseEqual(2);
    expect(survey.data, "set data into survey").toEqualValues({ QQQ1: 2 });
  });
  test("Composite: defaultValue", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName", defaultValue: "Jon" },
        { type: "text", name: "lastName" },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1", isRequired: true }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    expect(firstName.value, "firstName defaultValue").toLooseEqual("Jon");
    expect(q.value, "question defaultValue").toEqualValues({ firstName: "Jon" });
    expect(survey.data, "survey.data").toEqualValues({ q1: { firstName: "Jon" } });
  });
  test("Composite: defaultValue and survey in design mode", () => {
    ComponentCollection.Instance.add({
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" },
      ],
    });
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [{ type: "customerinfo", name: "q1", isRequired: true, defaultValue: { firstName: "Jon", lastName: "Snow" } }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    expect(firstName.value, "firstName defaultValue").toLooseEqual("Jon");
    expect(q.value, "question defaultValue").toEqualValues({ firstName: "Jon", lastName: "Snow" });
  });

  test("Composite: defaultValue and question.valueChangedCallback", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "boolean", name: "bool", defaultValue: false },
        { type: "text", name: "firstName", defaultValue: "Jon" },
        { type: "text", name: "lastName" },
      ],
      onCreated(question: QuestionCustomModel) {
        const boolQuestion = question.contentPanel.getQuestionByName("bool");
        const firstQuestion = question.contentPanel.getQuestionByName("firstName");
        const lastQuestion = question.contentPanel.getQuestionByName("lastName");
        boolQuestion.valueChangedCallback = function() {
          if (boolQuestion.value === false) {
            firstQuestion.clearValue();
            lastQuestion.clearValue();
          }
        };
      }
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.value).toEqualValues({ bool: false, firstName: "Jon" });
    q.contentPanel.getQuestionByName("bool").value = true;
    q.contentPanel.getQuestionByName("bool").value = false;
    expect(q.value).toEqualValues({ bool: false });
  });

  var orderJSON = {
    type: "matrixdropdown",
    columns: [
      {
        name: "price",
        title: "Price",
        cellType: "expression",
        displayStyle: "currency",
      },
      {
        name: "qty",
        title: "Qty",
        isRequired: true,
        cellType: "dropdown",
        placeholder: "0",
        choices: [1, 2, 3, 4, 5],
      },
      {
        name: "total",
        title: "Total",
        cellType: "expression",
        displayStyle: "currency",
        expression: "{row.qty} * {row.price}",
        totalType: "sum",
        totalDisplayStyle: "currency",
      },
    ],
    rows: ["Steak", "Salmon", "Beer"],
    defaultValue: {
      Steak: { price: 23 },
      Salmon: { price: 19 },
      Beer: { price: 5 },
    },
  };

  test("Single: matrixdropdown.defaultValue", () => {
    var json = {
      name: "order",
      questionJSON: orderJSON,
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "order", name: "q1", isRequired: true }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    var value = {
      Steak: { price: 23, total: 0 },
      Salmon: { price: 19, total: 0 },
      Beer: { price: 5, total: 0 },
    };
    var rows = q.contentQuestion.visibleRows;
    expect(q.value, "defaultValue is set").toEqualValues(value);
    expect(q.contentQuestion.value, "defaultValue is set for contentQuestion").toEqualValues(value);
  });
  test("Single: defaultValueExpession, bug#4836", () => {
    var json = {
      name: "newquestion",
      questionJSON: {
        type: "dropdown",
        choices: [1, 2, 3, 4, 5]
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1", defaultValueExpression: "2" }, { type: "text", name: "q2" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.value, "defaultValue is set").toLooseEqual(2);
    expect(q.contentQuestion.value, "defaultValue is set for contentQuestion").toLooseEqual(2);
    q.contentQuestion.value = 3;
    expect(q.value, "defaultValue is set, #2").toLooseEqual(3);
    expect(q.contentQuestion.value, "defaultValue is set for contentQuestion, #2").toLooseEqual(3);
    survey.setValue("q2", 4);
    expect(q.value, "defaultValue is set, #3").toLooseEqual(3);
    expect(q.contentQuestion.value, "defaultValue is set for contentQuestion, #3").toLooseEqual(3);
    expect(survey.data, "set data into survey").toEqualValues({ q1: 3, q2: 4 });
    q.clearValue();
    survey.setValue("q2", 5);
    expect(q.value, "defaultValue is set, #4").toLooseEqual(2);
    expect(q.contentQuestion.value, "defaultValue is set for contentQuestion, #4").toLooseEqual(2);
    expect(survey.data, "set data into survey, #2").toEqualValues({ q1: 2, q2: 5 });
  });
  test("Single: defaultValueExpession & operations, bug#7280", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      questionJSON: {
        type: "text",
        inputType: "number"
      },
    });
    const survey = new SurveyModel({
      elements: [
        { type: "newquestion", name: "q1" },
        { type: "newquestion", name: "q2" },
        { type: "newquestion", name: "q3", defaultValueExpression: "{q1} + {q2}" }],
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCustomModel>survey.getQuestionByName("q2");
    const q3 = <QuestionCustomModel>survey.getQuestionByName("q3");
    q1.contentQuestion.value = 1;
    q2.contentQuestion.value = 2;
    expect(q3.contentQuestion.value, "q3.contentQuestion.value").toLooseEqual(3);
    expect(q3.value, "q3.value").toLooseEqual(3);
    expect(survey.data, "Survey data").toEqualValues({ q1: 1, q2: 2, q3: 3 });
    q1.value = 3;
    q2.value = 4;
    expect(q3.contentQuestion.value, "q3.contentQuestion.value, #2").toLooseEqual(7);
    expect(q3.value, "q3.value, #2").toLooseEqual(7);
    expect(survey.data, "Survey data, #2").toEqualValues({ q1: 3, q2: 4, q3: 7 });
    q3.contentQuestion.value = 9;
    expect(q3.contentQuestion.value, "q3.contentQuestion.value, #3").toLooseEqual(9);
    expect(q3.value, "q3.value, #3").toLooseEqual(9);
    expect(survey.data, "Survey data, #3").toEqualValues({ q1: 3, q2: 4, q3: 9 });
    q1.value = 5;
    q2.value = 7;
    expect(q3.contentQuestion.value, "q3.contentQuestion.value, #4").toLooseEqual(9);
    expect(q3.value, "q3.value, #4").toLooseEqual(9);
    expect(survey.data, "Survey data, #4").toEqualValues({ q1: 5, q2: 7, q3: 9 });
  });
  test("Single: matrixdropdown expressions", () => {
    var json = {
      name: "order",
      questionJSON: orderJSON,
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "order", name: "q1", isRequired: true }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    var value = {
      Steak: { price: 23, total: 0 },
      Salmon: { price: 19, total: 0 },
      Beer: { price: 5, total: 0 },
    };
    var matrix = <QuestionMatrixDropdownModel>q.contentQuestion;
    matrix.visibleRows[0].getQuestionByColumnName("qty").value = 1;
    expect(survey.data, "Set data corectly").toEqualValues({
      q1: {
        Steak: { price: 23, qty: 1, total: 23 },
        Salmon: { price: 19, total: 0 },
        Beer: { price: 5, total: 0 },
      },
      "q1-total": { total: 23 },
    });
  });
  test("Composite: expression, {composite} prefix", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        {
          type: "text",
          name: "lastName",
          visibleIf: "{composite.firstName} = 'Jon'",
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1", isRequired: true }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    var lastName = q.contentPanel.getQuestionByName("lastName");
    expect(lastName.isVisible, "lastName is hidden by default").toLooseEqual(false);
    firstName.value = "Jon";
    expect(lastName.isVisible, "lastName is showing now").toLooseEqual(true);
  });
  test("Composite: expression, visibleIf without {composite} prefix, Bug#10257", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        {
          type: "text",
          name: "lastName",
          visibleIf: "{composite.firstName} = 'Jon'",
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "text", name: "firstName" }, { type: "customerinfo", name: "q1", isRequired: true, visibleIf: "{firstName} = 'Jon'" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[1];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    var lastName = q.contentPanel.getQuestionByName("lastName");
    expect(lastName.isVisible, "lastName is hidden by default").toLooseEqual(false);
    firstName.value = "Jon";
    expect(lastName.isVisible, "lastName is showing now").toLooseEqual(true);
    expect(q.isVisible, "Composite question visibilty, #1").toLooseEqual(false);
    survey.setValue("firstName", "Jon");
    expect(q.isVisible, "Composite question visibilty, #2").toLooseEqual(true);
    firstName.value = "Not Jon";
    expect(lastName.isVisible, "lastName is not showing now").toLooseEqual(false);
    expect(q.isVisible, "Composite question visibilty, #3").toLooseEqual(true);
    survey.setValue("firstName", "Not Jon");
    expect(q.isVisible, "Composite question visibilty, #4").toLooseEqual(false);
  });
  test("Composite: remove invisible values", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        {
          type: "text",
          name: "lastName",
          visibleIf: "{composite.firstName} != 'Jon'",
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "customerinfo", name: "q1", isRequired: true }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var firstName = q.contentPanel.getQuestionByName("firstName");
    var lastName = q.contentPanel.getQuestionByName("lastName");
    firstName.value = "first";
    lastName.value = "last";
    expect(lastName.value, "value set correctly").toLooseEqual("last");
    firstName.value = "Jon";
    survey.tryComplete();
    expect(survey.data, "remove lastName").toEqualValues({ q1: { firstName: "Jon" } });
  });
  test("Single: matrixdropdown onCreated after load properties", () => {
    var json = {
      name: "order",
      questionJSON: {
        type: "matrixdropdown",
        columns: [
          {
            name: "price",
            title: "Price",
            cellType: "expression",
            displayStyle: "currency",
          },
          {
            name: "qty",
            title: "Qty",
            cellType: "dropdown",
            placeholder: "0",
            choices: [1, 2, 3, 4, 5],
          },
          {
            name: "total",
            title: "Total",
            cellType: "expression",
            displayStyle: "currency",
            expression: "{row.qty} * {row.price}",
            totalType: "sum",
            totalDisplayStyle: "currency",
          },
        ],
      },
      onInit() {
        Serializer.addClass(
          "itemorder",
          [
            { name: "text", visible: false },
            { name: "visibleIf", visible: false },
            { name: "enableIf", visible: false },
          ],
          function () {
            return new ItemValue(null, null, "itemorder");
          },
          "itemvalue"
        );
        Serializer.addProperty("itemorder", {
          name: "price:number",
          default: 0,
        });
        Serializer.addProperty("order", {
          name: "orders:itemorder[]",
          category: "general",
        });
      },
      onLoaded(question) {
        this.buildRows(question);
        this.setDefaultValues(question);
      },
      buildRows(question) {
        var rows = [];
        for (var i = 0; i < question.orders.length; i++) {
          var item = question.orders[i];
          if (!!item.value) {
            rows.push(question.orders[i].value);
          }
        }
        question.contentQuestion.rows = rows;
      },
      setDefaultValues(question) {
        var defaultValue = {};
        for (var i = 0; i < question.orders.length; i++) {
          var item = question.orders[i];
          if (!!item.value && !!item.price) {
            defaultValue[item.value] = { price: item.price };
          }
        }
        question.contentQuestion.defaultValue = defaultValue;
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [
        {
          type: "order",
          name: "q1",
          orders: [
            { value: "Steak", price: 25 },
            { value: "Salmon", price: 22 },
          ],
        },
      ],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    var value = {
      Steak: { price: 25, total: 0 },
      Salmon: { price: 22, total: 0 },
    };
    var matrix = <QuestionMatrixDropdownModel>q.contentQuestion;
    expect(matrix.rows.length, "There are two rows").toLooseEqual(2);
    expect(matrix.defaultValue, "Default value set correctly").toEqualValues({ Steak: { price: 25 }, Salmon: { price: 22 } });
    Serializer.removeClass("itemorder");
  });

  test("Complex: hide content question in designMode", () => {
    ComponentCollection.Instance.add(<any>{
      name: "fullname",
      elementsJSON: [
        {
          type: "text",
          name: "firstName",
        },
        {
          type: "text",
          name: "lastName",
        },
        {
          type: "text",
          name: "middleName",
          visible: false,
        },
      ],
      onInit() {
        Serializer.addProperty("fullname", {
          name: "showMiddleName:boolean",
        });
      },
      onLoaded(question) {
        this.changeMiddleVisibility(question);
      },
      onPropertyChanged(question, propertyName, newValue) {
        if (propertyName == "showMiddleName") {
          this.changeMiddleVisibility(question);
        }
      },
      changeMiddleVisibility(question) {
        let middle = question.contentPanel.getQuestionByName("middleName");
        if (!!middle) {
          middle.visible = question.showMiddleName === true;
        }
      },
    });
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          type: "fullname",
          question: "q1",
        },
      ],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var middleName = q.contentPanel.getQuestionByName("middleName");
    expect(middleName.isVisible, "It is invisible by default").toLooseEqual(false);
    expect(middleName.areInvisibleElementsShowing, "All invisible content elements are stay invisible").toLooseEqual(false);
    q.showMiddleName = true;
    expect(middleName.isVisible, "showMiddleName is true").toLooseEqual(true);
    q.showMiddleName = false;
    expect(middleName.isVisible, "showMiddleName is false").toLooseEqual(false);
  });
  test("Complex: hide content question in designMode inside dynamic panel, Bug#10421", () => {
    ComponentCollection.Instance.add(<any>{
      name: "test1",
      elementsJSON: [
        { type: "paneldynamic",
          name: "panel",
          templateElements: [
            {
              type: "text",
              name: "firstName",
            },
            {
              type: "text",
              name: "lastName",
            },
            {
              type: "text",
              name: "middleName",
              visible: false,
            },
          ]
        }
      ]
    });
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          type: "test1",
          question: "q1",
        },
      ],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const panel = <QuestionPanelDynamicModel>q.contentPanel.getQuestionByName("panel");
    const middleName = panel.template.getQuestionByName("middleName");
    expect(middleName.isVisible, "It is invisible by default").toLooseEqual(false);
    expect(middleName.areInvisibleElementsShowing, "All invisible content elements are stay invisible").toLooseEqual(false);
    expect(middleName.parentQuestion?.name, "The parent question is correct").toLooseEqual("panel");
    expect(panel.areInvisibleElementsShowing, "All invisible content elements are stay invisible, #2").toLooseEqual(false);
  });
  test("Single: onAfterRender and onAfterRenderContentElement", () => {
    var afterRenderQuestion = null;
    var afterRenderHtmlElement = 0;
    var afterRenderContentElementQuestion = null;
    var afterRenderContentElement = null;
    var afterRenderContentElementHtml = 0;
    var json = {
      name: "newquestion",
      onAfterRender(question, htmlElement) {
        afterRenderQuestion = question;
        afterRenderHtmlElement = htmlElement;
      },
      onAfterRenderContentElement(question, element, htmlElement) {
        afterRenderContentElementQuestion = question;
        afterRenderContentElement = element;
        afterRenderContentElementHtml = htmlElement;
      },
      questionJSON: {
        type: "dropdown",
        choices: [1, 2, 3, 4, 5],
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    const el: HTMLElement = <any>({ a: 5, querySelector: () => {} });
    q.afterRender(el);
    expect(afterRenderQuestion.name, "onAfterRender, question parameter is correct").toLooseEqual("q1");
    expect((<any>afterRenderHtmlElement).a, "onAfterRender, htmlElement parameter is correct").toLooseEqual(5);
    q.contentQuestion.afterRender({ b: 7, querySelector: () => {} } as any);
    expect(afterRenderContentElementQuestion.name, "afterRenderContentElement, question parameter is correct").toLooseEqual("q1");
    expect(afterRenderContentElement.getType(), "afterRenderContentElement, element parameter is correct").toLooseEqual("dropdown");
    expect((afterRenderContentElementHtml as any).b, "afterRenderContentElement, htmlElement parameter is correct").toLooseEqual(7);
  });

  test("Composite: onAfterRender and onAfterRenderContentElement", () => {
    var afterRenderQuestion = null;
    var afterRenderHtmlElement = 0;
    var afterRenderContentElementQuestion = null;
    var afterRenderContentElement = null;
    var afterRenderContentElementHtml = 0;
    var json = {
      name: "fullname",
      elementsJSON: [
        {
          type: "text",
          name: "firstName",
        },
        {
          type: "text",
          name: "lastName",
        },
      ],
      onAfterRender(question, htmlElement) {
        afterRenderQuestion = question;
        afterRenderHtmlElement = htmlElement;
      },
      onAfterRenderContentElement(question, element, htmlElement) {
        afterRenderContentElementQuestion = question;
        afterRenderContentElement = element;
        afterRenderContentElementHtml = htmlElement;
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "fullname", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const el: HTMLElement = <any>({ a: 5 });
    q.afterRender(el);
    expect(afterRenderQuestion.name, "onAfterRender, question parameter is correct").toLooseEqual("q1");
    expect((<any>afterRenderHtmlElement).a, "onAfterRender, htmlElement parameter is correct").toLooseEqual(5);
    (<Question>q.contentPanel.elements[0]).afterRender(<any>7);
    expect(afterRenderContentElementQuestion.name, "afterRenderContentElement, question parameter is correct").toLooseEqual("q1");
    expect(afterRenderContentElement.name, "afterRenderContentElement, element parameter is correct").toLooseEqual("firstName");
    expect(afterRenderContentElementHtml, "afterRenderContentElement, htmlElement parameter is correct").toLooseEqual(7);
  });
  test("Composite: update url, {composite} prefix", () => {
    var json = {
      name: "urltest",
      elementsJSON: [
        { type: "text", name: "name" },
        {
          type: "dropdown",
          name: "url",
          choicesByUrl: {
            url: "an_url/{composite.name}",
          },
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "urltest", name: "q1", isRequired: true }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var name = q.contentPanel.getQuestionByName("name");
    var url = <QuestionDropdownModel>q.contentPanel.getQuestionByName("url");
    var processedUrl = "";
    url.choicesByUrl.onProcessedUrlCallback = (url: string, path: string) => {
      processedUrl = url;
    };
    name.value = "newValue";
    expect(processedUrl, "Url proccessed correctly").toLooseEqual("an_url/newValue");
  });
  test("Composite: update url, {composite} prefix on loaded", () => {
    var processedUrl = "";
    var json = {
      name: "urltest",
      elementsJSON: [
        { type: "text", name: "name" },
        {
          type: "dropdown",
          name: "url",
          choicesByUrl: {
            url: "an_url/{composite.name}",
          },
        },
      ],
      onLoaded(question) {
        let name = question.contentPanel.getQuestionByName("name");
        name.value = "newValue";
        let url = question.contentPanel.getQuestionByName("url");
        url.choicesByUrl.onProcessedUrlCallback = (url: string, path: string) => {
          processedUrl = url;
        };
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "urltest", name: "q1", isRequired: true }],
    });
    expect(processedUrl, "Url proccessed correctly on load").toLooseEqual("an_url/newValue");
  });
  test("Composite: onValueChanged function", () => {
    var json = {
      name: "testquestion",
      elementsJSON: [
        { type: "text", name: "q1" },
        {
          type: "dropdown",
          name: "q2",
          choices: ["A", "B", "C"],
        },
      ],
      onValueChanged: (question: Question, name: string, value: any) => {
        if (name == "q2") {
          question.setValue("q1", value + value);
        }
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "testquestion", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    q.contentPanel.getQuestionByName("q2").value = "A";
    expect(q.contentPanel.getQuestionByName("q1").value, "onValueChanged works").toLooseEqual("AA");
  });
  test("Single: onValueChanged function, value is array", () => {
    var json = {
      name: "testquestion",
      questionJSON: {
        type: "html",
      },
      onValueChanged: (question: Question, name: string, value: any) => {
        if (!value) value = [];
        var res = "";
        for (var i = 0; i < value.length; i++) {
          res += value[i];
        }
        question.contentQuestion.html = res;
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "testquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    q.value = ["A", "B"];
    expect(q.contentQuestion.html, "onValueChanged works #1").toLooseEqual("AB");
    q.value = ["A", "B", "C"];
    expect(q.contentQuestion.html, "onValueChanged works #2").toLooseEqual("ABC");
    q.value = undefined;
    expect(q.contentQuestion.html, "onValueChanged works #3").toLooseEqual("");
  });
  test("Composite: onValueChanging function", () => {
    var json = {
      name: "testquestion",
      elementsJSON: [
        { type: "text", name: "q1" },
        {
          type: "dropdown",
          name: "q2",
          choices: ["A", "B", "C"],
        },
      ],
      onValueChanging: (question: Question, name: string, value: any): any => {
        if (name == "q2" && value === 1) {
          return 2;
        }
        return value;
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "testquestion", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    q.contentPanel.getQuestionByName("q2").value = 1;
    expect(q.contentPanel.getQuestionByName("q2").value, "onValueChanging works").toLooseEqual(2);
    expect(q.value, "onValueChanging works, composite value").toEqualValues({ q2: 2 });
  });
  test("Composite: onMatrixCellValueChanging function", () => {
    var json = {
      name: "testquestion",
      elementsJSON: [
        { type: "text", name: "q1" },
        {
          type: "matrixdynamic",
          name: "q2",
          rowCount: 1,
          columns: [{ name: "col1", cellType: "text" }]
        },
      ],
      onCreated: (question: Question): void => {
        const matrix = question.contentPanel.getQuestionByName("q2");
        matrix.cellValueChangingCallback = (row: any, columnName: string, value: any): any => {
          if (columnName === "col1" && value === 1) return 2;
          return value;
        };
      }
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "testquestion", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const matrix = q.contentPanel.getQuestionByName("q2");
    const rows = matrix.visibleRows;
    rows[0].cells[0].question.value = 1;
    expect(rows[0].cells[0].question.value, "change value in matrix cell").toLooseEqual(2);
    expect(q.value, "onValueChanging works, composite value").toEqualValues({ q2: [{ col1: 2 }] });
    expect(survey.data, "survey.data has correct values").toEqualValues({ q1: { q2: [{ col1: 2 }] } });
  });
  test("Single: onValueChanging function, value is array", () => {
    var json = {
      name: "testquestion",
      questionJSON: {
        type: "text",
      },
      onValueChanging: (question: Question, name: string, value: any) => {
        if (value === 1) {
          return 2;
        }
        return value;
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "testquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    q.value = 1;
    expect(q.contentQuestion.value, "onValueChanged works #1").toLooseEqual(2);
    expect(q.value, "onValueChanged works #2").toLooseEqual(2);
  });
  test("Composite: checkErrorsMode=onValueChanging", () => {
    var json = {
      name: "testquestion",
      elementsJSON: [
        { type: "text", name: "q1", validators: [{ type: "emailvalidator" }] },
        {
          type: "dropdown",
          name: "q2",
          choices: ["A", "B", "C"],
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      checkErrorsMode: "onValueChanging",
      elements: [{ type: "testquestion", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var q1 = q.contentPanel.getQuestionByName("q1");
    q1.value = "a";
    expect(q1.value, "keep the value").toLooseEqual("a");
    expect(q1.errors.length, "question has error").toLooseEqual(1);
    expect(q.value, "keep the value in composite question").toEqualValues({ q1: "a" });
    expect(survey.data, "survey data is empty").toEqualValues({});
    q1.value = "a@a.com";
    expect(q1.errors.length, "question has no errors").toLooseEqual(0);
    expect(survey.data, "survey data is empty").toEqualValues({ q1: { q1: "a@a.com" } });
  });
  test("Composite: set value from survey.data", () => {
    var json = {
      name: "testquestion",
      elementsJSON: [
        { type: "text", name: "q1" },
        {
          type: "dropdown",
          name: "q2",
          choices: ["A", "B", "C"],
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "testquestion", name: "q1" }],
    });
    survey.data = { q1: { q1: "BB", q2: "B" } };
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.contentPanel.getQuestionByName("q1").value, "set value into the first question in composite").toLooseEqual("BB");
    expect(q.contentPanel.getQuestionByName("q2").value, "set value into the second question in composite").toLooseEqual("B");
  });
  test("Use components in dynamic panel", () => {
    ComponentCollection.Instance.add({
      name: "singlequestion",
      createQuestion: function () {
        var res = new QuestionDropdownModel("question");
        res.choices = [1, 2, 3, 4, 5];
        return res;
      },
    });
    ComponentCollection.Instance.add({
      name: "compositequestion",
      elementsJSON: [
        { type: "text", name: "q1" },
        {
          type: "dropdown",
          name: "q2",
          choices: ["A", "B", "C"],
        },
      ],
    });

    var survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "q1",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "singlequestion", name: "q2" },
            { type: "compositequestion", name: "q3" },
          ],
        },
      ],
    });
    var panel = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    panel.panelCount = 1;
    panel.panels[0].getQuestionByName("q2").value = 1;
    panel.panels[0].getQuestionByName("q3").value = { q1: 1, q2: "B" };
    expect(survey.data).toEqualValues({ q1: [{ q2: 1, q3: { q1: 1, q2: "B" } }] });
  });

  test("Composite: addConditionObjectsByContext", () => {
    var json = {
      name: "testquestion",
      elementsJSON: [
        { type: "text", name: "q1" },
        {
          type: "dropdown",
          name: "q2",
          title: "Question 2",
          choices: ["A", "B", "C"],
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "testquestion", name: "cp_question" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var objs = [];
    q.addConditionObjectsByContext(objs, null);
    for (var i = 0; i < objs.length; i++) {
      objs[i].question = objs[i].question.getType();
    }
    expect(objs, "addConditionObjectsByContext work correctly for composite question").toEqualValues([
      { name: "cp_question.q1", text: "cp_question.q1", question: "text" },
      {
        name: "cp_question.q2",
        text: "cp_question.Question 2",
        question: "dropdown",
      },
    ]);
  });
  test("Composite: getNestedQuestions", () => {
    var json = {
      name: "testquestion",
      elementsJSON: [
        { type: "text", name: "q1" },
        {
          type: "dropdown",
          name: "q2"
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "testquestion", name: "cp_question" }],
    });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const questions = q.getNestedQuestions();
    expect(questions.length, "#1").toLooseEqual(2);
    expect(questions[0].name, "#2").toLooseEqual("q1");
    expect(questions[1].name, "#3").toLooseEqual("q2");
  });
  test("Composite: visibleIf and showPreview, Bug#2674", () => {
    ComponentCollection.Instance.add(<any>{
      name: "fullname",
      title: "Full Name",
      elementsJSON: [
        {
          type: "text",
          name: "firstName",
          isRequired: true,
        },
        {
          type: "text",
          name: "lastName",
          visibleIf: "{composite.firstName} notempty",
          isRequired: true,
        },
      ],
    });
    var survey = new SurveyModel({
      showPreviewBeforeComplete: true,
      elements: [{ type: "fullname", name: "name" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.contentPanel.getQuestionByName("lastName").isVisible, "The second question is invisible").toLooseEqual(false);
    q.contentPanel.getQuestionByName("firstName").value = "Jon";
    expect(q.contentPanel.getQuestionByName("lastName").isVisible, "The second question is visible").toLooseEqual(true);
    q.contentPanel.getQuestionByName("lastName").value = "Snow";
    survey.showPreview();
    q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.contentPanel.getQuestionByName("lastName").isVisible, "The second question is still visible").toLooseEqual(true);
    survey.cancelPreview();
    q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.contentPanel.getQuestionByName("lastName").isVisible, "The second question is still visible").toLooseEqual(true);
  });
  test("Composite: visibleIf and showPreview and clearInvisibleValues = 'onHiddenContainer', Bug#2718", () => {
    ComponentCollection.Instance.add(<any>{
      name: "fullname",
      title: "Full Name",
      elementsJSON: [
        {
          type: "text",
          name: "firstName",
          isRequired: true,
        },
        {
          type: "text",
          name: "lastName",
          visibleIf: "{composite.firstName} notempty",
          isRequired: true,
        },
      ],
    });
    var survey = new SurveyModel({
      showPreviewBeforeComplete: true,
      clearInvisibleValues: "onHiddenContainer",
      elements: [{ type: "fullname", name: "name" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.contentPanel.getQuestionByName("lastName").isVisible, "The second question is invisible").toLooseEqual(false);
    q.contentPanel.getQuestionByName("firstName").value = "Jon";
    expect(q.contentPanel.getQuestionByName("lastName").isVisible, "The second question is visible").toLooseEqual(true);
    q.contentPanel.getQuestionByName("lastName").value = "Snow";
    survey.showPreview();
    q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.contentPanel.getQuestionByName("lastName").isVisible, "The second question is still visible").toLooseEqual(true);
    expect(q.contentPanel.getQuestionByName("lastName").value, "The value is still the same").toLooseEqual("Snow");
    survey.cancelPreview();
    q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.contentPanel.getQuestionByName("lastName").isVisible, "The second question is visible after canceling Preview").toLooseEqual(true);
    expect(q.contentPanel.getQuestionByName("lastName").value, "The value is still the same after canceling Preview").toLooseEqual("Snow");

  });

  test("Single: displayValue function, Bug#2678", () => {
    var json = {
      name: "newquestion",
      questionJSON: {
        type: "checkbox",
        choices: [
          { value: 1, text: "text 1" },
          { value: 2, text: "text 2" },
          { value: 3, text: "text 3" },
        ],
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    q.value = [1, 3];
    expect(q.displayValue).toLooseEqual("text 1, text 3");
  });
  test("Composite: displayValue function, Bug#2678", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      elementsJSON: [
        {
          type: "checkbox",
          name: "q1",
          title: "question 1",
          choices: [
            { value: 1, text: "text 1" },
            { value: 2, text: "text 2" },
            { value: 3, text: "text 3" },
          ],
        },
        {
          type: "dropdown",
          name: "q2",
          title: "question 2",
          choices: [
            { value: 1, text: "text 1" },
            { value: 2, text: "text 2" },
            { value: 3, text: "text 3" },
          ],
        },
      ],
    });
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    q.value = { q1: [1, 3], q2: 2 };
    expect(q.displayValue).toEqualValues({
      "question 1": "text 1, text 3",
      "question 2": "text 2",
    });
  });
  test("Single: in matrix dynamic question, Bug#2695", () => {
    var json = {
      name: "newquestion",
      questionJSON: {
        type: "dropdown",
        choices: ["a", "b", "c"],
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          columns: [{ name: "col1", cellType: "newquestion" }],
          rowCount: 1,
        },
      ],
    });
    var matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    var rows = matrix.visibleRows;
    expect(rows[0].cells[0].question.getType(), "cell question has correct type").toLooseEqual("newquestion");
    rows[0].cells[0].question.contentQuestion.value = "b";
    expect(rows[0].cells[0].question.value, "set value into cell question").toLooseEqual("b");
    expect(rows[0].cells[0].value, "set value into cell").toLooseEqual("b");
    expect(matrix.value, "set value into matrix").toEqualValues([{ col1: "b" }]);
  });
  test("Single: change locale, Bug#2730", () => {
    var json = {
      name: "newquestion",
      questionJSON: {
        type: "dropdown",
      },
      onLoaded: (question) => {
        var item = new ItemValue(1);
        item.locText.setJson({ default: "item en", de: "item de" });
        question.contentQuestion.choices = [item];
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    survey.currentPageNo = 0;
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    var locText = <LocalizableString>q.contentQuestion.choices[0].locText;
    expect(locText.renderedHtml, "en locale").toLooseEqual("item en");
    var hasChanged = false;
    locText.onChanged = () => {
      hasChanged = true;
    };
    survey.locale = "de";
    expect(hasChanged, "Call notification about changing locale").toLooseEqual(true);
    expect(locText.renderedHtml, "de locale").toLooseEqual("item de");
    survey.locale = "";
  });
  test("Composite: change locale, Bug#2730", () => {
    var json = {
      name: "newquestion",
      elementsJSON: [
        {
          type: "dropdown",
          choices: [{ value: 1, text: { default: "item en", de: "item de" } }],
        },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    survey.currentPageNo = 0;
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var dropdown = <QuestionDropdownModel>q.contentPanel.questions[0];
    expect(dropdown, "Question is here").toBeTruthy();
    var locText = <LocalizableString>dropdown.choices[0].locText;
    expect(locText.renderedHtml, "en locale").toLooseEqual("item en");
    var hasChanged = false;
    locText.onChanged = () => {
      hasChanged = true;
    };
    survey.locale = "de";
    expect(hasChanged, "Call notification about changing locale").toLooseEqual(true);
    expect(locText.renderedHtml, "de locale").toLooseEqual("item de");
    survey.locale = "";
  });
  test("getUsedLocale, Bug#7510", () => {
    ComponentCollection.Instance.add({
      name: "comp1",
      questionJSON: {
        type: "text",
        title: { en: "Title en", de: "Title de" }
      }
    });
    ComponentCollection.Instance.add({
      name: "comp2",
      elementsJSON: [
        {
          type: "text",
          name: "q1",
          title: { en: "Title en", fr: "Title fr" }
        },
        {
          type: "text",
          name: "q2",
          title: { en: "Title en", it: "Title it" }
        },
      ]
    });
    const survey = new SurveyModel({
      elements: [{ type: "comp1", name: "q1" }, { type: "comp2", name: "q2" }],
    });
    expect(survey.getUsedLocales(), "Pick-up locales from components").toEqualValues(["en", "de", "fr", "it"]);
  });
  test("getDisplayValue from component JSON function", () => {
    var json = {
      name: "fullname",
      title: "Full Name",
      elementsJSON: [
        {
          type: "text",
          name: "firstName",
          isRequired: true,
        },
        {
          type: "text",
          name: "lastName",
          visibleIf: "{composite.firstName} notempty",
          isRequired: true,
        },
      ],
      getDisplayValue: (composite: PanelModel) => composite.getValue().firstName + " " + composite.getValue().lastName
    };
    ComponentCollection.Instance.add(<any>json);
    var survey = new SurveyModel({
      elements: [{ type: "fullname", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const value = { "firstName": "First", "lastName": "Last" };
    q.value = value;
    expect(q.value, "Value should be assigned").toEqualValues(value);
    expect(q.displayValue, "Obtain passed getDisplayValue function result").toLooseEqual("First Last");
  });
  test("Complex: panel dynamic should duplicate rows in designMode", () => {
    ComponentCollection.Instance.add({
      name: "multiple_panel",
      elementsJSON: [
        {
          type: "paneldynamic",
          name: "panel",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2" }
          ]
        }
      ]
    });
    var survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({
      elements: [
        {
          type: "multiple_panel",
          question: "q1",
        },
      ],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    var panel = <QuestionPanelDynamicModel>q.contentPanel.getQuestionByName("panel");
    panel.panelCount = 1;
    panel.panels[0].getQuestionByName("q1").value = "val";
    expect(q.value, "Set value correctly").toEqualValues({ panel: [{ q1: "val" }] });
    q.defaultValue = { panel: [{ q1: "val1" }, { q2: "val2" }] };
    expect(panel.panelCount, "We have two panels in default value").toLooseEqual(2);
    expect(panel.panels.length, "We have two panels").toLooseEqual(2);
  });
  test("Check updateElementCss for custom question", () => {
    var json = {
      name: "newquestion",
      questionJSON: { type: "text" },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    const question = <QuestionCustomModel>survey.getAllQuestions()[0];
    const css1 = question.cssClassesValue;
    const css2 = question.contentQuestion.cssClassesValue;
    expect(css1).toBeTruthy();
    expect(css2).toBeTruthy();
    question.updateElementCss();
    expect(question.cssClassesValue).not.toBe(css1);
    expect(question.contentQuestion.cssClassesValue).not.toBe(css2);
  });
  test("onvalueChanging/Changed events", () => {
    const json = {
      name: "newquestion",
      questionJSON: { type: "text" },
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    let counterChanging = 0;
    let counterChanged = 0;
    survey.onValueChanging.add((sender, options) => {
      counterChanging ++;
    });
    survey.onValueChanged.add((sender, options) => {
      counterChanged ++;
    });
    const question = <QuestionCustomModel>survey.getAllQuestions()[0];
    question.contentQuestion.value = "a";
    expect(question.value, "component value is changed").toLooseEqual("a");
    expect(counterChanging, "counterChanging = 1").toLooseEqual(1);
    expect(counterChanged, "counterChanged = 1").toLooseEqual(1);
    question.value = "b";
    expect(question.contentQuestion.value, "contentQuestion value is changed").toLooseEqual("b");
    expect(counterChanging, "counterChanging = 2").toLooseEqual(2);
    expect(counterChanged, "counterChanged = 2").toLooseEqual(2);
  });
  test("Single: survey.questionsOnPageMode = `singlePage`", () => {
    const json = {
      name: "newquestion",
      questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    survey.data = { q1: 3 };
    survey.questionsOnPageMode = "singlePage";
    const q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.getType(), "type is correct").toLooseEqual("newquestion");
    expect(q.name, "name is correct").toLooseEqual("q1");
    expect(q.value, "value is correct").toLooseEqual(3);
    expect(q.contentQuestion.value, "content question value is correct").toLooseEqual(3);
  });
  test("Composite: in matrices cells", () => {
    var json = {
      name: "customerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" },
      ],
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic",
        name: "matrix",
        rowCount: 1,
        columns: [
          { cellType: "customerinfo", name: "col1" },
        ]
      }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    let row = matrix.visibleRows[0];
    let q = row.cells[0].question;
    expect(q.getType(), "The correct type is created").toLooseEqual("customerinfo");
    expect(q.contentPanel.elements.length, "There are two elements in panel").toLooseEqual(2);
    q.contentPanel.getQuestionByName("firstName").value = "Jon";
    q.contentPanel.getQuestionByName("lastName").value = "Snow";
    expect(q.value, "Set value to composite question correctly").toEqualValues({ firstName: "Jon", lastName: "Snow" });
    expect(row.value, "Row value is correct").toEqualValues({ col1: { firstName: "Jon", lastName: "Snow" } });
    expect(matrix.value, "Matrix value is correct").toEqualValues([{ col1: { firstName: "Jon", lastName: "Snow" } }]);
    expect(survey.data, "survey.data is correct").toEqualValues({ matrix: [{ col1: { firstName: "Jon", lastName: "Snow" } }] });

    survey.data = { matrix: [
      { col1: { firstName: "Jaime", lastName: "Lannister" } },
      { col1: { firstName: "Jon", lastName: "Snow" } }] };

    row = matrix.visibleRows[0];
    q = row.cells[0].question;
    expect(q.contentPanel.getQuestionByName("firstName").value, "row 0, firstName").toLooseEqual("Jaime");
    expect(q.contentPanel.getQuestionByName("lastName").value, "row 0, lastname").toLooseEqual("Lannister");
    row = matrix.visibleRows[1];
    q = row.cells[0].question;
    expect(q.contentPanel.getQuestionByName("firstName").value, "row 1, firstName").toLooseEqual("Jon");
    expect(q.contentPanel.getQuestionByName("lastName").value, "row 1, lastname").toLooseEqual("Snow");
  });

  test("Single: isContentElement property", () => {
    var json = {
      name: "newquestion",
      questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.isContentElement, "Design is available for root").toLooseEqual(false);
    expect(q.contentQuestion.isContentElement, "Design is disabled for contentQuestion").toLooseEqual(true);

    const page2 = survey.addNewPage("newPage2");
    const q2 = page2.addNewQuestion("newquestion", "q2");
    expect(q2.isContentElement, "Design is available for root q2").toLooseEqual(false);
    expect(q2.contentQuestion.isContentElement, "Design is disabled for contentQuestion q2").toLooseEqual(true);

  });

  test("Single: matrixdropdown & getProgressInfo", () => {
    var json = {
      name: "order",
      questionJSON: orderJSON,
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "order", name: "q1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    var rows = q.contentQuestion.visibleRows;
    expect(q.getProgressInfo()).toEqualValues({
      questionCount: 3,
      answeredQuestionCount: 0,
      requiredQuestionCount: 3,
      requiredAnsweredQuestionCount: 0,
    });
  });
  test("Single: text & getProgressInfo", () => {
    ComponentCollection.Instance.add({
      name: "test1",
      questionJSON: { type: "text" }
    });
    ComponentCollection.Instance.add({
      name: "test2",
      questionJSON: { type: "text", isRequired: true }
    });
    const survey = new SurveyModel({
      elements: [{ type: "test1", name: "q1", isRequired: true },
        { type: "test2", name: "q2" }],
    });
    const q1 = <QuestionCustomModel>survey.getAllQuestions()[0];
    const q2 = <QuestionCustomModel>survey.getAllQuestions()[1];
    expect(q1.getProgressInfo(), "q1").toEqualValues({
      questionCount: 1,
      answeredQuestionCount: 0,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 0,
    });
    expect(q2.getProgressInfo(), "q2").toEqualValues({
      questionCount: 1,
      answeredQuestionCount: 0,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 0,
    });
  });
  test("Composite: getProgressInfo", () => {
    ComponentCollection.Instance.add(<any>{
      name: "test1",
      elementsJSON: [
        {
          type: "text",
          name: "firstName",
          isRequired: true
        },
        {
          type: "text",
          name: "lastName",
        }]
    });
    ComponentCollection.Instance.add(<any>{
      name: "test2",
      elementsJSON: [
        {
          type: "text",
          name: "firstName",
        },
        {
          type: "text",
          name: "lastName",
        }]
    });
    const survey = new SurveyModel({
      elements: [{ type: "test1", name: "q1", isRequired: true },
        { type: "test1", name: "q2" },
        { type: "test2", name: "q3" },
        { type: "test2", name: "q4", isRequired: true }]
    });
    const q1 = <QuestionCustomModel>survey.getAllQuestions()[0];
    const q2 = <QuestionCustomModel>survey.getAllQuestions()[1];
    const q3 = <QuestionCustomModel>survey.getAllQuestions()[2];
    const q4 = <QuestionCustomModel>survey.getAllQuestions()[3];
    expect(q1.getProgressInfo(), "q1").toEqualValues({
      questionCount: 2,
      answeredQuestionCount: 0,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 0,
    });
    expect(q2.getProgressInfo(), "q2").toEqualValues({
      questionCount: 2,
      answeredQuestionCount: 0,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 0,
    });
    expect(q3.getProgressInfo(), "q3").toEqualValues({
      questionCount: 2,
      answeredQuestionCount: 0,
      requiredQuestionCount: 0,
      requiredAnsweredQuestionCount: 0,
    });
    expect(q4.getProgressInfo(), "q4").toEqualValues({
      questionCount: 2,
      answeredQuestionCount: 0,
      requiredQuestionCount: 1,
      requiredAnsweredQuestionCount: 0,
    });
  });
  test("Composite: Support carry-forward", () => {
    const json = {
      name: "newquestion",
      elementsJSON: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
        { type: "radiogroup", name: "q2", choicesFromQuestion: "q1", choicesFromQuestionMode: "selected" }
      ]
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const q1 = q.contentPanel.getQuestionByName("q1");
    const q2 = q.contentPanel.getQuestionByName("q2");
    expect(q2.choicesFromQuestion, "choicesFromQuestion is loaded").toLooseEqual("q1");
    expect(q2.choicesFromQuestionMode, "choicesFromQuestionMode is loaded").toLooseEqual("selected");
    expect(q2.visibleChoices.length, "There is no visible choices").toLooseEqual(0);
    q1.value = [1, 3, 5];
    expect(q2.visibleChoices.length, "Choices are here").toLooseEqual(3);
    expect(q2.visibleChoices[1].value, "A choice value is correct").toLooseEqual(3);
  });
  test("Composite: isContentElement property", () => {
    var json = {
      name: "newquestion",
      elementsJSON: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
        { type: "radiogroup", name: "q2", choicesFromQuestion: "q1", choicesFromQuestionMode: "selected" }
      ]
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "qu1" }],
    });
    var q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.isContentElement, "Design is available for root").toLooseEqual(false);
    expect(q.contentPanel.isContentElement, "Design is disabled for contentQuestion").toLooseEqual(true);

    const page2 = survey.addNewPage("newPage2");
    const q2 = page2.addNewQuestion("newquestion", "qu2");
    expect(q2.isContentElement, "Design is available for root qu2").toLooseEqual(false);
    expect(q2.contentPanel.isContentElement, "Design is disabled for contentQuestion qu2").toLooseEqual(true);

  });
  test("Composite: merge data, Bug#5583", () => {
    var json = {
      name: "fullname",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" },
      ],
      onLoaded: (question) => {
        const firstName = question.contentPanel.getQuestionByName("firstName");
        firstName.value = "Jon";
      },
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "fullname", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(survey.data, "Survey data is correct").toEqualValues({ q1: { firstName: "Jon" } });
    survey.mergeData({ q1: { lastName: "Snow" } });
    expect(q.value).toEqualValues({ firstName: "Jon", lastName: "Snow" });
    survey.mergeData({ q1: { firstName: "John", lastName: "Doe" } });
    expect(q.value).toEqualValues({ firstName: "John", lastName: "Doe" });
  });
  test("Single: Change css rules for content question", () => {
    ComponentCollection.Instance.add({
      name: "test",
      questionJSON: { type: "text" },
      onUpdateQuestionCssClasses: (question: Question, element: Question, css: any) => {
        css.root = "css_question";
      }
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "q1" }]
    });
    const q = <QuestionCustomModel>survey.getAllQuestions()[0];
    expect(q.contentQuestion.cssClasses.root, "Set the css correctly").toLooseEqual("css_question");
  });
  test("Composite: Change css rules for content questions", () => {
    const json = {
      name: "fullname",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "text", name: "lastName" },
      ],
      onLoaded: (question) => {
        const firstName = question.contentPanel.getQuestionByName("firstName");
        firstName.value = "Jon";
      },
      onUpdateQuestionCssClasses: (question: Question, element: Question, css: any) => {
        if (element.name === "firstName") {
          css.root = "css_question1";
        }
        if (element.name === "lastName") {
          css.root = "css_question2";
        }
      }
    };
    ComponentCollection.Instance.add(json);
    var survey = new SurveyModel({
      elements: [{ type: "fullname", name: "q1" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    expect(q.contentPanel.questions[0].cssClasses.root, "Set the css correctly, #1").toLooseEqual("css_question1");
    expect(q.contentPanel.questions[1].cssClasses.root, "Set the css correctly, #2").toLooseEqual("css_question2");
  });
  test("Composite: with expression", () => {
    const json = {
      name: "elementsettings",
      elementsJSON: [
        {
          name: "corner",
          type: "text",
          inputType: "number",
          defaultValue: 0
        },
        {
          type: "expression",
          name: "cornerRadius",
          expression: "{composite.corner}+'px'",
          visible: false
        }
      ],
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({ elements: [{ type: "elementsettings", name: "q1" }] });
    let _data = new Array<any>();
    let onValueChangedCounter = 0;
    survey.onValueChanged.add((sender, options) => {
      onValueChangedCounter++;
      _data.push(options.value);
    });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[0];

    expect(_data.length, "#1").toLooseEqual(0);
    expect(onValueChangedCounter, "#2").toLooseEqual(0);
    expect(q.value, "#3").toEqualValues({ corner: 0, cornerRadius: "0px" });

    q.contentPanel.getQuestionByName("corner").value = 5;
    expect(onValueChangedCounter, "#4").toLooseEqual(2);
    expect(q.value, "#5").toEqualValues({ corner: 5, cornerRadius: "5px" });
    expect(_data[0], "#6").toEqualValues({ corner: 5, cornerRadius: "0px" });
    expect(_data[1], "#7").toEqualValues({ corner: 5, cornerRadius: "5px" });

    q.value = { corner: 4 };
    expect(q.value, "#8").toEqualValues({ corner: 4, cornerRadius: "4px" });

  });
  test("Composite: with setValueIf & setValueExpression, bug#7888", () => {
    const json = {
      name: "comp1",
      elementsJSON: [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2",
          "enableIf": "{composite.q1} notempty",
          "setValueIf": "{composite.q1} notempty",
          "setValueExpression": "{composite.q1} + {composite.q1}"
        }
      ],
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({ elements: [{ type: "comp1", name: "question1" }] });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const q1 = q.contentPanel.getQuestionByName("q1");
    const q2 = q.contentPanel.getQuestionByName("q2");
    expect(q2.isEmpty(), "#1").toLooseEqual(true);
    q1.value = 1;
    expect(q2.value, "#2").toLooseEqual(2);
    q1.value = 3;
    expect(q2.value, "#3").toLooseEqual(6);
    q1.clearValue();
    expect(q2.value, "#4").toLooseEqual(6);

  });
  test("Composite: with enableIf", () => {
    const json = {
      name: "comp1",
      elementsJSON: [
        {
          "type": "text",
          "name": "q1"
        },
        {
          "type": "text",
          "name": "q2",
          "enableIf": "{composite.q1} notempty"
        }
      ],
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({ elements: [{ type: "comp1", name: "question1" }] });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const q1 = q.contentPanel.getQuestionByName("q1");
    const q2 = q.contentPanel.getQuestionByName("q2");
    expect(q2.isReadOnly, "readOnly - #1").toLooseEqual(true);
    q1.value = 1;
    expect(q2.isReadOnly, "readOnly - #2").toLooseEqual(false);
    q1.clearValue();
    expect(q2.isReadOnly, "readOnly - #3").toLooseEqual(true);

  });
  test("Composite: with enableIf & survey editing object", () => {
    class TestNested extends Base {
      public get prop1(): string { return this.getPropertyValue("prop1"); }
      public set prop1(val: string) { this.setPropertyValue("prop1", val); }
      public get prop2(): string { return this.getPropertyValue("prop2"); }
      public set prop2(val: string) { this.setPropertyValue("prop2", val); }
    }
    class TestRoot extends Base {
      public nested: TestNested;
      constructor() {
        super();
        this.nested = new TestNested();
      }
    }
    const json = {
      name: "comp1",
      elementsJSON: [
        {
          "type": "text",
          "name": "prop1"
        },
        {
          "type": "text",
          "name": "prop2",
          "enableIf": "{composite.prop1} notempty"
        }
      ],
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({ elements: [{ type: "comp1", name: "nested" }] });
    const obj = new TestRoot();
    survey.editingObj = obj;
    const q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    const q1 = q.contentPanel.getQuestionByName("prop1");
    const q2 = q.contentPanel.getQuestionByName("prop2");
    expect(q2.isReadOnly, "readOnly - #1").toLooseEqual(true);
    q1.value = 1;
    expect(q2.isReadOnly, "readOnly - #2").toLooseEqual(false);
    q1.clearValue();
    expect(q2.isReadOnly, "readOnly - #3").toLooseEqual(true);

  });
  test("Composite: check valueToData and valueFromData callbacks", () => {
    const json = {
      name: "test",
      questionJSON:
      {
        type: "text",
        name: "test"
      }
      ,
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({ elements: [{ type: "test", name: "q1" }] });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    q.valueToDataCallback = (newValue: string) => {
      return newValue.split(" ");
    };
    q.valueFromDataCallback = (newValue: Array<string>) => {
      return !!newValue ? newValue.join(" ") : "";
    };
    survey.data = { "q1": ["a", "b", "c"] };
    expect(q.value).toLooseEqual("a b c");
    q.value = "a b c d";
    expect(survey.data["q1"]).toEqualValues(["a", "b", "c", "d"]);
  });
  test("Composite & onValueChanged", () => {
    const json = {
      name: "elementsettings",
      showInToolbox: false,
      elementsJSON: [
        {
          type: "text",
          name: "backcolor"
        },
        {
          type: "text",
          name: "hovercolor"
        },
        {
          type: "text",
          name: "corner",
          defaultValue: 4
        },
        {
          type: "expression",
          name: "cornerRadius",
          expression: "{composite.corner}+\"px\"",
          visible: false
        }, {
          type: "text",
          name: "border"
        }
      ],
      onInit() {
      },
      onCreated(question) {
      },
      onValueChanged(question, name, newValue) {
      },
    };
    ComponentCollection.Instance.add(json);
    const survey = new SurveyModel({ elements: [{ type: "elementsettings", name: "q1" }] });
    const q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    q.contentPanel.getQuestionByName("backcolor").value = "#f8f8f8";

    let onValueChangedCounter = 0;
    survey.onValueChanged.add((sender, options) => {
      onValueChangedCounter++;
    });
    q.value = { backcolor: "#ffffff", hovercolor: "#f8f8f8", corner: 4, border: "0 1 2 rgba(0, 0, 0, 0.15)" };
    expect(onValueChangedCounter).toLooseEqual(1);
    expect(survey.data).toEqualValues({ q1: { backcolor: "#ffffff", hovercolor: "#f8f8f8", corner: 4, cornerRadius: "4px", border: "0 1 2 rgba(0, 0, 0, 0.15)" } });

  });
  test("Composite & valueToQuestion/valueFromQuestion, #6475", () => {
    ComponentCollection.Instance.add({
      name: "elementsettings",
      showInToolbox: false,
      elementsJSON: [
        {
          type: "text",
          name: "item1"
        },
        {
          type: "text",
          name: "item2"
        }
      ],
      valueToQuestion(val: any): any {
        if (!val) return "";
        let res = !!val.item1 ? val.item1 : "";
        res += ",";
        res += !!val.item2 ? val.item2 : "";
        return res;
      },
      valueFromQuestion(val: any): any {
        if (!val) return {};
        const res = val.split(",");
        if (res.length < 2) res.push("");
        return { item1: res[0], item2: res[1] };
      }
    });
    ComponentCollection.Instance.add({
      name: "rootquestion",
      showInToolbox: false,
      elementsJSON: [
        {
          type: "elementsettings",
          name: "settings"
        }
      ]
    });
    const survey = new SurveyModel({
      elements: [
        { type: "elementsettings", name: "q1" },
        { type: "rootquestion", name: "q2" }
      ] });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const qItem1 = q1.contentPanel.getQuestionByName("item1");
    const qItem2 = q1.contentPanel.getQuestionByName("item2");
    qItem1.value = "val1";
    qItem2.value = "val2";
    expect(qItem1.value, "item1 question value is correct, #1").toLooseEqual("val1");
    expect(qItem2.value, "item2 question value is correct, #1").toLooseEqual("val2");
    expect(q1.value, "composite question value is correct, #1").toLooseEqual("val1,val2");
    expect(survey.data, "survey data is correct, #1").toEqualValues({ q1: "val1,val2" });
    q1.value = "val3,val4";
    expect(qItem1.value, "item1 question value is correct, #2").toLooseEqual("val3");
    expect(qItem2.value, "item2 question value is correct, #2").toLooseEqual("val4");
    expect(q1.value, "composite question value is correct, #2").toLooseEqual("val3,val4");
    expect(survey.data, "survey data is correct, #2").toEqualValues({ q1: "val3,val4" });

    const q2 = <QuestionCompositeModel>survey.getQuestionByName("q2");
    const q2Settings = <QuestionCompositeModel>(q2.contentPanel.getQuestionByName("settings"));
    const q2SettingsItem1 = q2Settings.contentPanel.getQuestionByName("item1");
    const q2SettingsItem2 = q2Settings.contentPanel.getQuestionByName("item2");
    q2SettingsItem1.value = "val5";
    q2SettingsItem2.value = "val6";
    expect(q2SettingsItem1.value, "item1 question value is correct, #3").toLooseEqual("val5");
    expect(q2SettingsItem2.value, "item2 question value is correct, #3").toLooseEqual("val6");
    expect(q2Settings.value, "composite question value is correct, #3").toLooseEqual("val5,val6");
    expect(q2.value, "composite root question value is correct, #3").toEqualValues({ settings: "val5,val6" });
    expect(survey.data, "survey data is correct, #3").toEqualValues({ q1: "val3,val4", q2: { settings: "val5,val6" } });
    q2Settings.value = "val7,val8";
    expect(q2SettingsItem1.value, "item1 question value is correct, #4").toLooseEqual("val7");
    expect(q2SettingsItem2.value, "item2 question value is correct, #4").toLooseEqual("val8");
    expect(q2Settings.value, "composite question value is correct, #4").toLooseEqual("val7,val8");
    expect(q2.value, "composite root question value is correct, #4").toEqualValues({ settings: "val7,val8" });
    expect(survey.data, "survey data is correct, #4").toEqualValues({ q1: "val3,val4", q2: { settings: "val7,val8" } });
    q2.value = { settings: "val9,val10" };
    expect(q2SettingsItem1.value, "item1 question value is correct, #5").toLooseEqual("val9");
    expect(q2SettingsItem2.value, "item2 question value is correct, #5").toLooseEqual("val10");
    expect(q2Settings.value, "composite question value is correct, #5").toLooseEqual("val9,val10");
    expect(q2.value, "composite root question value is correct, #5").toEqualValues({ settings: "val9,val10" });
    expect(survey.data, "survey data is correct, #5").toEqualValues({ q1: "val3,val4", q2: { settings: "val9,val10" } });

  });
  test("needResponsiveWidth", () => {
    ComponentCollection.Instance.add({
      name: "comp1",
      internal: true,
      questionJSON: { type: "matrixdropdown" },
    });
    ComponentCollection.Instance.add({
      name: "comp2",
      questionJSON: { type: "text" },
    });
    ComponentCollection.Instance.add({
      name: "comp3",
      elementsJSON: [{ type: "text", name: "q1" }]
    });
    ComponentCollection.Instance.add({
      name: "comp4",
      elementsJSON: [{ type: "matrixdropdown", name: "q1" }]
    });
    const survey = new SurveyModel({
      elements: [
        { type: "comp1", name: "q1" },
        { type: "comp2", name: "q2" },
        { type: "comp3", name: "q3" },
        { type: "comp4", name: "q4" }
      ]
    });
    expect(survey.getQuestionByName("q1").needResponsiveWidth(), "single - matrix").toLooseEqual(true);
    expect(survey.getQuestionByName("q2").needResponsiveWidth(), "single - text").toLooseEqual(false);
    expect(survey.getQuestionByName("q3").needResponsiveWidth(), "complex - text").toLooseEqual(false);
    expect(survey.getQuestionByName("q4").needResponsiveWidth(), "single - matrix").toLooseEqual(true);
  });
  test("Single & getValue/setValue, #6475", () => {
    ComponentCollection.Instance.add({
      name: "singleq",
      showInToolbox: false,
      questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
      getValue(val: any): any {
        if (!val) return val;
        return "val:" + val.toString();
      },
      setValue(val: any): any {
        if (!val) return val;
        val = val.replace("val:", "");
        return Number.parseInt(val);
      }
    });
    const survey = new SurveyModel({
      elements: [
        { type: "singleq", name: "q1" }
      ] });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    q1.contentQuestion.value = 2;
    expect(q1.value, "#1").toLooseEqual("val:2");
    q1.value = "val:4";
    expect(q1.contentQuestion.value, "#2").toLooseEqual(4);
  });
  test("Single: onHidingContent", () => {
    let counter = 0;
    ComponentCollection.Instance.add({
      name: "test",
      questionJSON: { type: "text" },
      onCreated: (question: Question): void => {
        question.contentQuestion.onHidingContent = (): void => { counter ++; };
      }
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "q1" }],
    });
    expect(counter, "Initial").toLooseEqual(0);
    survey.doComplete();
    expect(counter, "onComplete").toLooseEqual(1);
  });
  test("Complex: onHidingContent", () => {
    let counter = 0;
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        {
          type: "text",
          name: "item1"
        },
        {
          type: "text",
          name: "item2"
        }
      ],
      onCreated: (question: Question): void => {
        const questions = question.contentPanel.questions;
        questions[0].onHidingContent = (): void => { counter ++; };
        questions[1].onHidingContent = (): void => { counter ++; };
      }
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "q1" }],
    });
    expect(counter, "Initial").toLooseEqual(0);
    survey.doComplete();
    expect(counter, "onComplete").toLooseEqual(2);
  });
  test("Single: Apply error css", () => {
    const json = {
      name: "newquestion",
      questionJSON: { type: "text" },
    };
    ComponentCollection.Instance.add(json);
    const errorCss = "single_error";
    const survey = new SurveyModel();
    survey.css = { text: { onError: errorCss } };
    survey.fromJSON({
      elements: [{ type: "newquestion", name: "q1", isRequired: true }],
    });
    const q = <QuestionCustomModel>survey.getAllQuestions()[0];
    const qText = <QuestionTextModel>q.contentQuestion;
    expect(qText.cssClasses.onError, "error css is correct").toLooseEqual(errorCss);
    expect(qText.getControlClass().indexOf(errorCss) < 0, "errors is not here").toLooseEqual(true);
    q.validate(true);
    expect(qText.getControlClass().indexOf(errorCss) > -1, "errors is here").toLooseEqual(true);
  });
  test("ComponentCollection.Instance.remove", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      questionJSON: { type: "text" },
    });
    expect(ComponentCollection.Instance.getCustomQuestionByName("newquestion").name, "it exists").toLooseEqual("newquestion");
    expect(ComponentCollection.Instance.remove("aaa"), "aaa is not exists").toLooseEqual(false);
    expect(ComponentCollection.Instance.remove("newquestion"), "newquestion is removed").toLooseEqual(true);
    expect(ComponentCollection.Instance.getCustomQuestionByName("newquestion"), "newquestion is not here").toBeFalsy();
  });
  test("internal boolean flag", () => {
    ComponentCollection.Instance.add({
      name: "newquestion1",
      internal: true,
      questionJSON: { type: "text" },
    });
    ComponentCollection.Instance.add({
      name: "newquestion2",
      questionJSON: { type: "text" },
    });
    expect(ComponentCollection.Instance.getCustomQuestionByName("newquestion1").name, "newquestion1 is here").toLooseEqual("newquestion1");
    expect(ComponentCollection.Instance.getCustomQuestionByName("newquestion2").name, "newquestion2 is here").toLooseEqual("newquestion2");
    ComponentCollection.Instance.clear();
    expect(ComponentCollection.Instance.getCustomQuestionByName("newquestion1").name, "newquestion1 is here").toLooseEqual("newquestion1");
    expect(ComponentCollection.Instance.getCustomQuestionByName("newquestion2"), "newquestion2 is not here, #1").toBeFalsy();
    ComponentCollection.Instance.clear(true);
    expect(ComponentCollection.Instance.getCustomQuestionByName("newquestion1"), "newquestion1 is not here, #2").toBeFalsy();
    expect(ComponentCollection.Instance.getCustomQuestionByName("newquestion2"), "newquestion2 is not here, #2").toBeFalsy();
  });
  test("Set title from single component into question", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      questionJSON: { type: "text", title: "Title from Component" },
    });
    const survey = new SurveyModel({
      elements: [
        { type: "newquestion", name: "q1" },
        { type: "newquestion", name: "q2", title: "Q2 title" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.pages[0].addNewQuestion("newquestion", "q3");
    expect(q1.locTitle.renderedHtml, "q1 title").toLooseEqual("Title from Component");
    expect(q2.locTitle.renderedHtml, "q2 title").toLooseEqual("Q2 title");
    expect(q3.name, "q3 name").toLooseEqual("q3");
    expect(q3.locTitle.renderedHtml, "q3 title").toLooseEqual("Title from Component");
    expect(q1.toJSON(), "Do not serialize title").toEqualValues({ name: "q1" });
  });
  test("Allow to add question via addNewQuestion for component, but not for abstract classes", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      questionJSON: { type: "text", title: "Title from Component" },
    });
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" }
      ]
    });
    const q2 = survey.pages[0].addNewQuestion("newquestion", "q2");
    const q3 = survey.pages[0].addNewQuestion("matrixdropdownbase", "q3");
    expect(q2, "component created").toBeTruthy();
    expect(q3, "matrixdropdownbase is not created").toBeFalsy();
  });
  test("text placeholder is not updated on changing locale", () => {
    ComponentCollection.Instance.add({
      name: "customtext",
      questionJSON: {
        type: "text",
        placeholder: { en: "en-TextPH", de: "de-TextPH" },
      },
    });
    const survey = new SurveyModel({
      elements: [
        { type: "customtext", name: "q1" }
      ]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    const contentQuestion = <QuestionTextModel>q1.contentQuestion;
    expect(contentQuestion.renderedPlaceholder, "en placeholder").toLooseEqual("en-TextPH");
    survey.locale = "de";
    expect(contentQuestion.renderedPlaceholder, "de placeholder").toLooseEqual("de-TextPH");
  });
  test("showPreview & default value, #7508", () => {
    ComponentCollection.Instance.add({
      name: "customtext",
      questionJSON: {
        type: "text",
        defaultValue: "abc"
      },
    });
    const survey = new SurveyModel({
      elements: [
        { type: "customtext", name: "q1" }
      ]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    const contentQuestion = <QuestionTextModel>q1.contentQuestion;
    expect(q1.value, "q1.value #1").toLooseEqual("abc");
    expect(contentQuestion.value, "contentQuestion.value #1").toLooseEqual("abc");
    contentQuestion.value = "edf";
    expect(q1.value, "q1.value #2").toLooseEqual("edf");
    expect(contentQuestion.value, "contentQuestion.value #2").toLooseEqual("edf");
    survey.showPreview();
    expect(q1.value, "q1.value #3").toLooseEqual("edf");
    expect(contentQuestion.value, "contentQuestion.value #3").toLooseEqual("edf");
    const q1Preview = <QuestionCustomModel>survey.getQuestionByName("q1");
    const contentQuestionPreview = <QuestionTextModel>q1.contentQuestion;
    expect(q1Preview.value, "q1Preview.value #3").toLooseEqual("edf");
    expect(contentQuestionPreview.value, "contentQuestionPreview.value #3").toLooseEqual("edf");
    survey.cancelPreview();
    expect(q1.value, "q1.value #4").toLooseEqual("edf");
    expect(contentQuestion.value, "contentQuestion.value #4").toLooseEqual("edf");
  });
  test("showPreview & default value, #7640", () => {
    ComponentCollection.Instance.add({
      name: "customtext",
      questionJSON: {
        type: "text",
        title: "abc={abc}"
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customtext", name: "q1" }
      ]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    const contentQuestion = <QuestionTextModel>q1.contentQuestion;
    survey.setVariable("abc", 123);
    expect(contentQuestion.locTitle.renderedHtml, "contentQuestion.title").toLooseEqual("abc=123");
    expect(q1.locTitle.renderedHtml, "q1.title").toLooseEqual("abc=123");

  });
  test("single component: defaultQuestionTitle", () => {
    ComponentCollection.Instance.add({
      name: "customtext",
      defaultQuestionTitle: {
        en: "abc={abc} en",
        de: "abc={abc} de",
      },
      questionJSON: {
        type: "text"
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customtext", name: "q1" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    survey.setVariable("abc", 123);
    expect(q1.locTitle.renderedHtml, "q1.title en").toLooseEqual("abc=123 en");
    survey.locale = "de";
    expect(q1.locTitle.renderedHtml, "q1.title de").toLooseEqual("abc=123 de");

  });
  test("single component: defaultQuestionTitle & editor placeholder", () => {
    ComponentCollection.Instance.add({
      name: "customtext",
      defaultQuestionTitle: "abc",
      questionJSON: {
        type: "text"
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customtext", name: "q1" },
        { type: "text", name: "q2" },
        { type: "text", name: "q3" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const q3 = survey.getQuestionByName("q3");
    const prop = Serializer.findProperty("text", "title");
    prop.onPropertyEditorUpdate(q1, q3);
    expect(q3.placeholder, "#1").toLooseEqual("abc");
    prop.onPropertyEditorUpdate(q2, q3);
    expect(q3.placeholder, "#2").toLooseEqual("q2");
  });
  test("composite component: defaultQuestionTitle", () => {
    ComponentCollection.Instance.add({
      name: "customtext",
      defaultQuestionTitle: {
        en: "abc={abc} en",
        de: "abc={abc} de",
      },
      elementsJSON: {
        type: "text"
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customtext", name: "q1" }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    survey.setVariable("abc", 123);
    expect(q1.locTitle.renderedHtml, "q1.title en").toLooseEqual("abc=123 en");
    survey.locale = "de";
    expect(q1.locTitle.renderedHtml, "q1.title de").toLooseEqual("abc=123 de");

  });
  test("single component: inheritBaseProps: array<string>", () => {
    ComponentCollection.Instance.add({
      name: "customdropdown",
      inheritBaseProps: ["allowClear", "showOtherItem"],
      questionJSON: {
        type: "dropdown",
        choices: [1, 2, 3]
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customdropdown", name: "q1", allowClear: false, showOtherItem: true }
      ]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    const content = <QuestionDropdownModel>q1.contentQuestion;
    expect(q1.allowClear, "q1.allowClear #1").toLooseEqual(false);
    expect(content.allowClear, "content.allowClear #1").toLooseEqual(false);
    q1.allowClear = true;
    expect(q1.allowClear, "q1.allowClear #2").toLooseEqual(true);
    expect(content.allowClear, "content.allowClear #2").toLooseEqual(true);
    content.allowClear = false;
    expect(q1.allowClear, "q1.allowClear #3").toLooseEqual(false);
    expect(content.allowClear, "content.allowClear #3").toLooseEqual(false);

    expect(q1.showOtherItem, "q1.showOtherItem #1").toLooseEqual(true);
    expect(content.showOtherItem, "content.showOtherItem #1").toLooseEqual(true);
    q1.showOtherItem = false;
    expect(q1.showOtherItem, "q1.showOtherItem #2").toLooseEqual(false);
    expect(content.showOtherItem, "content.showOtherItem #2").toLooseEqual(false);
    content.showOtherItem = true;
    expect(q1.showOtherItem, "q1.showOtherItem #3").toLooseEqual(true);
    expect(content.showOtherItem, "content.showOtherItem #3").toLooseEqual(true);
    const json = q1.toJSON();
    expect(json.allowClear, "json.allowClear").toLooseEqual(false);
    expect(json.showOtherItem, "json.showOtherItem").toLooseEqual(true);

  });
  test("single component: inheritBaseProps: array<string> #2 + check property change notification #", () => {
    ComponentCollection.Instance.add({
      name: "customtext",
      inheritBaseProps: ["placeholder"],
      questionJSON: {
        type: "text",
        placeholder: "abc"
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customtext", name: "q1" }
      ]
    });
    let propertyName = "";
    let counter = 0;
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    const content = <QuestionTextModel>q1.contentQuestion;
    expect(q1.placeholder, "q1.placeholder #1").toLooseEqual("abc");
    expect(content.placeholder, "content.placeholder #1").toLooseEqual("abc");
    survey.onPropertyValueChangedCallback = (name: string, oldValue: any, newValue: any, sender: Base, arrayChanges: ArrayChanges): void => {
      propertyName = name;
      counter ++;
    };
    q1.placeholder = "bcd";
    expect(propertyName, "send notification, propertyname").toLooseEqual("placeholder");
    expect(counter, "send notification, counter").toLooseEqual(1);
    expect(q1.placeholder, "q1.placeholder #2").toLooseEqual("bcd");
    expect(content.placeholder, "content.placeholder #2").toLooseEqual("bcd");
    content.placeholder = "cde";
    expect(q1.placeholder, "q1.placeholder #3").toLooseEqual("cde");
    expect(content.placeholder, "content.placeholder #3").toLooseEqual("cde");

    const prop = Serializer.getOriginalProperty(q1, "placeholder");
    expect(prop.name, "prop.className is correct").toLooseEqual("placeholder");
    expect(prop.isVisible("form", q1), "it is visible").toLooseEqual(true);
  });
  test("single component: inheritBaseProps: true, Issue#10060 & Bug#10460", () => {
    ComponentCollection.Instance.add({
      name: "customdropdown",
      inheritBaseProps: true,
      questionJSON: {
        type: "dropdown",
        choices: [1, 2, 3]
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customdropdown", name: "q1", title: "my title", allowClear: false, showOtherItem: true }
      ]
    });
    const dropdownChoicesProp = Serializer.findProperty("dropdown", "choices");
    expect(dropdownChoicesProp, "dropdown.choices prop is here").toBeTruthy();
    expect(dropdownChoicesProp.visible, "dropdown.choices.visible is true").toLooseEqual(true);
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    const props = Serializer.getDynamicPropertiesByObj(q1);
    const propChoices = props.find((prop) => prop.name === "choices");
    expect(propChoices, "propChoices is here").toBeTruthy();
    expect(propChoices?.visible, "propChoices.visible is false").toLooseEqual(false);
    expect(propChoices?.isSerializable, "propChoices.isSerializable is false").toLooseEqual(false);

    expect(Serializer.getObjPropertyValue(q1, "name"), "getObjPropertyValue is correct, #name").toLooseEqual("q1");
    expect(Serializer.getObjPropertyValue(q1, "title"), "getObjPropertyValue is correct, #title").toLooseEqual("my title");
    expect(Serializer.getObjPropertyValue(q1, "showOtherItem"), "getObjPropertyValue is correct, #showOtherItem").toLooseEqual(true);
    const content = <QuestionDropdownModel>q1.contentQuestion;
    expect(q1.getDynamicType(), "q1.getDynamicType()").toLooseEqual("dropdown");
    expect(content.choices.length, "content.choices").toLooseEqual(3);
    expect(q1.choices, "q1.choices").toBeTruthy();
    expect(q1.allowClear, "q1.allowClear #1").toLooseEqual(false);
    expect(content.allowClear, "content.allowClear #1").toLooseEqual(false);
    q1.allowClear = true;
    expect(q1.allowClear, "q1.allowClear #2").toLooseEqual(true);
    expect(content.allowClear, "content.allowClear #2").toLooseEqual(true);
    content.allowClear = false;
    expect(q1.allowClear, "q1.allowClear #3").toLooseEqual(false);
    expect(content.allowClear, "content.allowClear #3").toLooseEqual(false);

    expect(q1.showOtherItem, "q1.showOtherItem #1").toLooseEqual(true);
    expect(content.showOtherItem, "content.showOtherItem #1").toLooseEqual(true);
    q1.showOtherItem = false;
    expect(q1.showOtherItem, "q1.showOtherItem #2").toLooseEqual(false);
    expect(content.showOtherItem, "content.showOtherItem #2").toLooseEqual(false);
    content.showOtherItem = true;
    expect(q1.showOtherItem, "q1.showOtherItem #3").toLooseEqual(true);
    expect(content.showOtherItem, "content.showOtherItem #3").toLooseEqual(true);
    const json = q1.toJSON();
    expect(json.allowClear, "json.allowClear").toLooseEqual(false);
    expect(json.showOtherItem, "json.showOtherItem").toLooseEqual(true);

  });
  test("single component, file: inheritBaseProps: true, Bug #8757", () => {
    ComponentCollection.Instance.add({
      name: "customfile",
      inheritBaseProps: true,
      questionJSON: {
        type: "file",
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customfile", name: "q1", showCommentArea: true }
      ]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    expect(Serializer.getObjPropertyValue(q1, "name"), "getObjPropertyValue is correct, #name").toLooseEqual("q1");
    expect(Serializer.getObjPropertyValue(q1, "showCommentArea"), "getObjPropertyValue is correct, #showCommentArea").toLooseEqual(true);

  });
  test("Bug with visibleIf with composite.question and panel dynamic. Bug#7771", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        {
          "name": "q1",
          "type": "boolean",
        },
        {
          "name": "q2",
          "type": "paneldynamic",
          "visibleIf": "{composite.q1} = true",
          "minPanelCount": 1,
          "templateElements": [
            {
              "name": "q3",
              "type": "text"
            }
          ]
        }
      ]
    });

    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "q1" }
      ]
    });
    const compQuestion = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const q1 = <QuestionPanelDynamicModel>compQuestion.contentPanel.getQuestionByName("q1");
    const q2 = <QuestionPanelDynamicModel>compQuestion.contentPanel.getQuestionByName("q2");
    expect(q2.isVisible, "isVisible #1").toLooseEqual(false);
    q1.value = true;
    expect(q2.isVisible, "isVisible #2").toLooseEqual(true);
    q2.addPanel();
    expect(q2.isVisible, "isVisible #3").toLooseEqual(true);
  });
  test("file question in composite component doesn't show preview in preview mode. Bug#7826", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        {
          type: "file",
          name: "file_q",
          allowMultiple: true,
          storeDataAsText: false
        },
      ]
    });

    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "q1" },
        { type: "file", name: "q2", storeDataAsText: false }
      ]
    });
    survey.onUploadFiles.add((survey, options) => {
      options.callback(
        "success",
        options.files.map((file) => {
          return { file: file, content: file.name + "_url" };
        })
      );
    });

    const compQuestion = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const file_q1 = <QuestionFileModel>compQuestion.contentPanel.getQuestionByName("file_q");
    const file_q2 = <QuestionFileModel>survey.getQuestionByName("q2");
    file_q1.loadFiles([{ name: "f1", type: "t1" } as any]);
    file_q2.loadFiles([{ name: "f1", type: "t1" } as any]);
    expect(file_q1.showPreviewContainer, "file_q1 #1").toLooseEqual(true);
    expect(file_q2.showPreviewContainer, "file_q2 #1").toLooseEqual(true);

    survey.showPreview();
    expect(survey.state, "state #1").toLooseEqual("preview");
    const compQuestion_preview = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const file_q1_preview = <QuestionFileModel>compQuestion_preview.contentPanel.getQuestionByName("file_q");
    const file_q2_preview = <QuestionFileModel>survey.getQuestionByName("q2");
    expect(file_q1_preview.showPreviewContainer, "file_q1_preview #1").toLooseEqual(true);
    expect(file_q2_preview.showPreviewContainer, "file_q2_preview #1").toLooseEqual(true);

    survey.cancelPreview();
    expect(survey.state, "state #2").toLooseEqual("running");
    expect(file_q1.showPreviewContainer, "file_q1 #1").toLooseEqual(true);
    expect(file_q2.showPreviewContainer, "file_q2 #1").toLooseEqual(true);

  });

  test("Composite + Ranking", () => {
    const json = {
      "elements": [{
        "name": "q_composite",
        "type": "compostite_witn_ranking"
      }]
    };
    const comp_json = {
      name: "compostite_witn_ranking",
      showInToolbox: false,
      internal: true,
      elementsJSON: [
        {
          name: "q_ranking",
          type: "ranking",
          selectToRankEnabled: true,
        }
      ]
    };
    ComponentCollection.Instance.add(comp_json);

    const survey = new SurveyModel(json);
    const q_composite = survey.getQuestionByName("q_composite");
    const q_ranking = q_composite.contentPanel.getQuestionByName("q_ranking");
    q_ranking.choices = ["a", "b", "c", "d", "e"];
    q_ranking.value = ["a", "b", "c"];

    expect(q_ranking.unRankingChoices.length, "ranking value is correct (unrank list length) ['d', 'e']").toLooseEqual(2);
    expect(q_ranking.rankingChoices.length, "ranking value is correct (rank list length) ['a', 'b', 'c'").toLooseEqual(3);

  });
  test("Single: showPreviewBeforeComplete Bug#8005", () => {
    ComponentCollection.Instance.add({
      name: "test",
      questionJSON: { type: "dropdown", choices: [1, 2, 3] },
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "question1" }],
      showPreviewBeforeComplete: true,
    });
    survey.getQuestionByName("question1").value = 1;
    survey.showPreview();
    expect(survey.data, "survey.data #2").toEqualValues({ question1: 1 });
    survey.tryComplete();
    expect(survey.data, "survey.data #2").toEqualValues({ question1: 1 });
  });
  test("Single: validate", () => {
    let errorText = "";
    ComponentCollection.Instance.add({
      name: "test",
      questionJSON: { type: "dropdown", choices: [1, 2, 3] },
      getErrorText: (question): string => {
        if (question.value !== 1) {
          errorText = "val";
          return "value should be 1";
        }
        return "";
      }
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "question1" }],
      showPreviewBeforeComplete: true,
    });
    const q = survey.getQuestionByName("question1");
    q.value = 2;
    survey.validate();
    expect(errorText, "errorText").toLooseEqual("val");
    expect(q.errors.length, "Errors length #1").toLooseEqual(1);
    expect(q.errors[0].text, "Error text").toLooseEqual("value should be 1");
    q.value = 1;
    expect(q.errors.length, "Errors length #2").toLooseEqual(0);
  });
  test("Composite: validate", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", choices: [1, 2, 3], visibleIf: "{composite.q1} notempty" },
        { type: "text", name: "q3", choices: [1, 2, 3], visibleIf: "{composite.q2} notempty" }
      ],
      onValueChanged(question, name, newValue) {
        if (name === "q1") {
          question.contentPanel.getQuestionByName("q2").clearValue();
        }
        if (name === "q2") {
          question.contentPanel.getQuestionByName("q3").value = newValue;
        }
      },
      getErrorText: (question): string => {
        const q1 = question.contentPanel.getQuestionByName("q1");
        const q3 = question.contentPanel.getQuestionByName("q3");
        if (!q1.isEmpty() && q3.isEmpty()) return "Select q2";
        return "";
      }
    });
    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "q1" },
        { type: "test", name: "q2", isRequired: true }
      ]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCompositeModel>survey.getQuestionByName("q2");
    survey.validate();
    expect(q1.errors.length, "q1 errors #1").toLooseEqual(0);
    expect(q2.errors.length, "q2 errors #1").toLooseEqual(1);
    q1.contentPanel.getQuestionByName("q1").value = "val";
    q2.contentPanel.getQuestionByName("q1").value = "val";
    survey.validate();
    expect(q1.errors.length, "q1 errors #2").toLooseEqual(1);
    expect(q1.errors[0].text, "q1 errors text #2").toLooseEqual("Select q2");
    expect(q2.errors.length, "q2 errors #2").toLooseEqual(1);
    expect(q2.errors[0].text, "q2 errors text #2").toLooseEqual("Select q2");
    q1.contentPanel.getQuestionByName("q2").value = 1;
    q2.contentPanel.getQuestionByName("q2").value = 2;
    expect(q1.contentPanel.getQuestionByName("q3").value, "q1.q3 value").toLooseEqual(1);
    expect(q2.contentPanel.getQuestionByName("q3").value, "q2.q3 value").toLooseEqual(2);
    survey.validate();
    expect(q1.errors.length, "q1 errors #3").toLooseEqual(0);
    expect(q2.errors.length, "q2 errors #3").toLooseEqual(0);
  });
  test("Composite: update questions on a value change", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2" },
        { type: "text", name: "q3" }
      ],
      onValueSet: (question, newValue: any): void => {
        if (!!newValue && !!newValue.q3) {
          question.contentPanel.getQuestionByName("q2").choices = [newValue.q3];
        }
      }
    });
    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "q1" },
      ]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const internalQ2 = q1.contentPanel.getQuestionByName("q2");
    survey.data = { q1: { q1: 1, q3: 2 } };
    expect(internalQ2.choices.length, "choices.length #1").toLooseEqual(1);
    expect(internalQ2.choices[0].value, "choices[0].value #1").toLooseEqual(2);
    q1.value = { q1: 1, q3: 3 };
    expect(internalQ2.choices.length, "choices.length #2").toLooseEqual(1);
    expect(internalQ2.choices[0].value, "choices[0].value #2").toLooseEqual(3);
  });
  test("Composite: onValueChanging and survey.onValueChanging", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", choices: [1, 2, 3] },
        { type: "text", name: "q3", choices: [1, 2, 3] }
      ],
      onValueChanging(question, name, newValue) {
        if (name === "q1") {
          question.contentPanel.getQuestionByName("q2").clearValue();
        }
        if (name === "q2") {
          question.contentPanel.getQuestionByName("q3").value = newValue;
        }
        return newValue;
      },
    });
    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "q1" }
      ]
    });
    let onValueChangingData: any = undefined;
    survey.onValueChanging.add((sender, options) => {
      onValueChangingData = options.value;
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    q1.contentPanel.getQuestionByName("q1").value = "test1";
    expect(onValueChangingData, "test #1").toEqualValues({ q1: "test1" });
    q1.contentPanel.getQuestionByName("q2").value = 2;
    expect(onValueChangingData, "test #2").toEqualValues({ q1: "test1", q2: 2, q3: 2 });
    q1.contentPanel.getQuestionByName("q1").value = "test2";
    expect(onValueChangingData, "test #3").toEqualValues({ q1: "test2" });

  });
  test("Composite: onValueChanged and survey.data", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", choices: [1, 2, 3] },
        { type: "text", name: "q3", choices: [1, 2, 3] }
      ],
      onValueChanged(question, name, newValue) {
        if (name === "q1") {
          question.contentPanel.getQuestionByName("q2").clearValue();
          question.contentPanel.getQuestionByName("q3").clearValue();
        }
        if (name === "q2") {
          question.contentPanel.getQuestionByName("q3").value = newValue;
        }
      },
    });
    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "q1" }
      ]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    q1.contentPanel.getQuestionByName("q1").value = "test1";
    expect(survey.data, "test #1").toEqualValues({ q1: { q1: "test1" } });
    q1.contentPanel.getQuestionByName("q2").value = 2;
    expect(survey.data, "test #2").toEqualValues({ q1: { q1: "test1", q2: 2, q3: 2 } });
    q1.contentPanel.getQuestionByName("q1").value = "test2";
    expect(survey.data, "test #3").toEqualValues({ q1: { q1: "test2" } });

  });
  test("Single: use incorrect json", () => {
    const prev = ConsoleWarnings.error;
    const reportTexts = new Array<string>();
    ConsoleWarnings.error = (text: string) => {
      reportTexts.push(text);
    };
    ComponentCollection.Instance.add({
      name: "test1",
      questionJSON: { type: "panel", elements: [{ type: "dropdown", name: "q1", choices: [1, 2, 3] }, { type: "text", name: "q2" }] },
    });
    ComponentCollection.Instance.add({
      name: "test2",
      questionJSON: { type: "page" },
    });
    const survey = new SurveyModel({
      elements: [{ type: "test1", name: "q1" }, { type: "test2", name: "q2" }]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    const q2 = <QuestionCustomModel>survey.getQuestionByName("q2");

    expect(q1.contentQuestion.getType(), "q1 content type").toLooseEqual("dropdown");
    expect(q2.contentQuestion.getType(), "q2 content type").toLooseEqual("text");
    expect(reportTexts, "check console errors").toEqualValues(["Could not create component: 'test1'. questionJSON should be a question.",
      "Could not create component: 'test2'. questionJSON should be a question."]);

    ComponentCollection.Instance.clear();
    ConsoleWarnings.error = prev;
  });
  test("single component: inheritBaseProps - do not duplicate description property", () => {
    ComponentCollection.Instance.add({
      name: "customdropdown",
      inheritBaseProps: ["description"],
      questionJSON: {
        type: "dropdown",
        description: {
          en: "Custom Question",
          de: "Aangepaste vraag"
        },
        choices: [1, 2, 3]
      },
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customdropdown", name: "q1" }
      ]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    expect(q1.description, "Get description from internal description").toLooseEqual("Custom Question");
    survey.locale = "de";
    expect(q1.description, "Get description from internal description for 'de'").toLooseEqual("Aangepaste vraag");
    const props = Serializer.getPropertiesByObj(q1);
    let descriptionCounter = 0;
    props.forEach(prop => {
      if (prop.name === "description") {
        descriptionCounter ++;
      }
    });
    expect(descriptionCounter, "We have one description property").toLooseEqual(1);
  });
  test("composite component: do not reset dynamic panels/dynamic rows, Bug#8612", () => {
    ComponentCollection.Instance.add({
      name: "customquestion",
      elementsJSON: [
        {
          type: "text",
          name: "qText",
        },
        {
          "type": "paneldynamic",
          "name": "panel",
          "templateElements": [
            {
              "type": "text",
              "name": "question2"
            }
          ]
        },
        {
          "type": "matrixdynamic",
          "name": "matrix",
          "rowCount": 0,
          "columns": [
            {
              "cellType": "text",
              "name": "col1"
            }
          ]
        }
      ]
    });

    const survey = new SurveyModel({
      elements: [
        { type: "customquestion", name: "q1" }
      ]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const panel = <QuestionPanelDynamicModel>q1.contentPanel.getQuestionByName("panel");
    const matrix = <QuestionMatrixDynamicModel>q1.contentPanel.getQuestionByName("matrix");
    const text = q1.contentPanel.getQuestionByName("qText");
    panel.addPanel();
    panel.addPanel();
    panel.addPanel();
    matrix.addRow();
    matrix.addRow();
    matrix.addRow();
    text.value = "abc";
    expect(matrix.rowCount, "There are 3 rows").toLooseEqual(3);
    expect(panel.panelCount, "There are 3 panels").toLooseEqual(3);

  });

  test("a11y", () => {
    ComponentCollection.Instance.add({
      name: "customquestion",
      elementsJSON: [
        {
          type: "text",
          name: "qText",
        }
      ]
    });
    const survey = new SurveyModel({
      elements: [
        { type: "customquestion", name: "q1" }
      ]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    expect(q1.ariaRole, "check role attribute").toLooseEqual("group");

  });
  test("Dynamic serializable properties, bug#8852", () => {
    ComponentCollection.Instance.add({
      name: "nps",
      questionJSON: {
        "type": "rating",
        "rateMin": 0,
        "rateMax": 10
      },
      inheritBaseProps: ["minRateDescription", "maxRateDescription"]
    });
    const survey = new SurveyModel({
      elements: [
        { type: "nps", name: "q1", minRateDescription: "val1", maxRateDescription: "val2" }
      ]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    expect(q1.contentQuestion.locMinRateDescription.text, "minRateDescription").toLooseEqual("val1");
    expect(q1.contentQuestion.maxRateDescription, "maxRateDescription").toLooseEqual("val2");
    expect(q1.contentQuestion.hasMinRateDescription, "hasMinRateDescription").toLooseEqual(true);
    expect(q1.contentQuestion.hasMaxRateDescription, "hasMaxRateDescription").toLooseEqual(true);

  });
  test("Dynamic serializable properties, bug#8852", () => {
    ComponentCollection.Instance.add({
      name: "dropdownWithComment",
      inheritBaseProps: ["choices"],
      questionJSON: {
        type: "dropdown",
        name: "dropdownElement",
        choices: [
          { value: 0, text: "Item 1 (with comments)", comments: true },
          { value: 1, text: "Item 2 (without comments)", comments: false },
          { value: 2, text: "Item 3 (with comments)", comments: true },
        ],
      },
    });
    const survey = new SurveyModel({
      elements: [
        { type: "dropdownWithComment", name: "q1", choices: [1] }
      ]
    });
    expect(survey.jsonErrors, "There is not errors").toBeFalsy();

  });
  test("Composite: clearIfInvisible='onHidden'", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", choices: [1, 2, 3] },
        { type: "text", name: "q3", clearIfInvisible: "onHidden", visibleIf: "{composite.q2}=2" }
      ]
    });
    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "q1" }
      ]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    q1.contentPanel.getQuestionByName("q1").value = "test1";
    q1.contentPanel.getQuestionByName("q2").value = 2;
    q1.contentPanel.getQuestionByName("q3").value = "abc";
    expect(q1.value, "test #1").toEqualValues({ q1: "test1", q2: 2, q3: "abc" });
    q1.contentPanel.getQuestionByName("q2").value = 3;
    expect(q1.value, "test #1").toEqualValues({ q1: "test1", q2: 3 });

  });
  test("Composite: with dropdown & showOtherItem, Bug#9378", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        { type: "text", name: "q1" },
        { type: "dropdown", name: "q2", choices: [1, 2, 3], showOtherItem: true }
      ]
    });
    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "question1" }
      ]
    });
    const q = <QuestionCompositeModel>survey.getQuestionByName("question1");
    const q1 = q.contentPanel.getQuestionByName("q1");
    const q2 = q.contentPanel.getQuestionByName("q2");
    q1.value = "test1";
    q2.value = "other";
    q2.otherValue = "abc";
    expect(q.value, "q.value #1").toEqualValues({ q1: "test1", q2: "other", "q2-Comment": "abc" });
    survey.data = {};
    expect(q.isEmpty(), "q.value #2").toBeTruthy();
    survey.data = { question1: { q1: "test2", q2: "other", "q2-Comment": "def" } };
    expect(q.value, "q.value #3").toEqualValues({ q1: "test2", q2: "other", "q2-Comment": "def" });

  });
  test("Single: with checkbox & showOtherItem, Bug#9929", () => {
    ComponentCollection.Instance.add({
      name: "test",
      questionJSON: { type: "checkbox", choices: [1, 2, 3], showOtherItem: true }
    });
    const survey = new SurveyModel({
      elements: [
        { type: "test", name: "question1" }
      ]
    });
    survey.data = { question1: [2, "other"], "question1-Comment": "abc" };
    const q = <QuestionCustomModel>survey.getQuestionByName("question1");
    const cQ = <QuestionCheckboxModel>q.contentQuestion;
    expect(cQ.value, "q.value #1").toEqualValues([2, "other"]);
    expect(cQ.comment, "q.comment #1").toEqualValues("abc");
    cQ.otherValue = "def";
    expect(survey.data, "survey.data #2").toEqualValues({ question1: [2, "other"], "question1-Comment": "def" });

  });

  test("Composite: checkErrorsMode: `onComplete` with several elements, Bug#9361", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        { type: "text", name: "q1", isRequired: true },
        { type: "text", name: "q2", isRequired: true }
      ]
    });
    const survey = new SurveyModel({
      checkErrorsMode: "onComplete",
      pages: [{ name: "page1", elements: [{ type: "test", name: "question1" }] },
        { name: "page2", elements: [{ type: "test", name: "question2" }] }]
    });
    const question1 = <QuestionCompositeModel>survey.getQuestionByName("question1");
    const q1 = question1.contentPanel.getQuestionByName("q1");
    expect(q1.parentQuestion?.name, "q1.parentQuestion").toLooseEqual("question1");
    expect(q1.page?.name, "q1.page").toLooseEqual("page1");
    survey.nextPage();
    expect(survey.currentPageNo, "currentPageNo #1").toLooseEqual(1);
    survey.tryComplete();
    expect(survey.currentPageNo, "currentPageNo #2").toLooseEqual(0);

  });
  test("Composite: survey.onPanelVisibleChanged, Bug#9698", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        { type: "text", name: "q1" },
        { type: "panel", name: "panel1", visibleIf: "{composite.q1} = 'a'", elements: [{ type: "text", name: "q2" }] }
      ]
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "question1" }, { type: "panel", name: "panel2", elements: [{ type: "text", name: "q3" }] }, { type: "text", name: "q4" }]
    });
    const logs: Array<any> = [];
    survey.onPanelVisibleChanged.add((survey, options) => {
      logs.push({ panel: options.panel.name, visible: options.visible });
    });
    let questionNumberCounter = 0;
    survey.onGetQuestionNumber.add((survey, options) => {
      if (options.question.name === "q4") {
        questionNumberCounter ++;
      }
    });
    const question1 = <QuestionCompositeModel>survey.getQuestionByName("question1");
    const q1 = question1.contentPanel.getQuestionByName("q1");
    const panel2 = <PanelModel>survey.getPanelByName("panel2");
    panel2.visible = false;
    panel2.visible = true;
    const maxQuestionNumberCounter = questionNumberCounter;
    q1.value = "a";
    q1.value = "b";
    expect(questionNumberCounter, "questionNumberCounter #2").toLooseEqual(maxQuestionNumberCounter);
    expect(logs.length, "logs.length").toLooseEqual(4);
    expect(logs, "logs").toEqualValues([
      { panel: "panel2", visible: false },
      { panel: "panel2", visible: true },
      { panel: "panel1", visible: true },
      { panel: "panel1", visible: false }
    ]);

  });
  test("Composite: survey set data & set comment, Bug#9747", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        {
          type: "text",
          name: "item1"
        },
        {
          type: "dropdown",
          name: "item2",
          choices: [1, 2],
          showOtherItem: true
        },
        {
          type: "text",
          name: "item3"
        }
      ]
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "q1" }]
    });
    survey.data = {
      "q1": {
        "item1": "val1",
        "item2": "other",
        "item2-Comment": "comment",
        "item3": "val3"
      }
    };
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    expect(q1.contentPanel.getQuestionByName("item3").value, "item3 value").toLooseEqual("val3");

  });

  test("Custom: isMobile flag, Bug#9927", () => {
    ComponentCollection.Instance.add(
      {
        name: "test",
        questionJSON: { type: "text" }
      }
    );
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "q1" }]
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");

    expect(q1.contentQuestion.isMobile).toLooseEqual(false);

    survey.setIsMobile(true);
    expect(q1.contentQuestion.isMobile).toLooseEqual(true);

    survey.setIsMobile(false);
    expect(q1.contentQuestion.isMobile).toLooseEqual(false);
  });

  test("Composite: isMobile flag, Bug#9927", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        {
          type: "text",
          name: "item1"
        },
        {
          type: "text",
          name: "item2"
        }
      ]
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "q1" }]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");

    expect(q1.contentPanel.getQuestionByName("item1").isMobile).toLooseEqual(false);
    expect(q1.contentPanel.getQuestionByName("item2").isMobile).toLooseEqual(false);

    survey.setIsMobile(true);
    expect(q1.contentPanel.getQuestionByName("item1").isMobile).toLooseEqual(true);
    expect(q1.contentPanel.getQuestionByName("item2").isMobile).toLooseEqual(true);

    survey.setIsMobile(false);
    expect(q1.contentPanel.getQuestionByName("item1").isMobile).toLooseEqual(false);
    expect(q1.contentPanel.getQuestionByName("item2").isMobile).toLooseEqual(false);
  });
  test("Single: Do not focus element on setting defaultValue & on setting value to survey.data, Bug#10016", () => {
    const oldFunc = SurveyElement.FocusElement;
    let counter = 0;
    SurveyElement.FocusElement = function (elId: string): boolean {
      counter ++;
      return true;
    };
    ComponentCollection.Instance.add({
      name: "customcheckbox",
      questionJSON: {
        "type": "checkbox",
        "choices": [
          "Item 1",
          "Item 2",
          "Item 3"
        ],
        "showOtherItem": true
      }
    });
    const survey = new SurveyModel({
      elements: [{ type: "customcheckbox", name: "q1" }]
    });

    survey.data = { "q1-Comment": "3",
      "q1": [
        "Item 2",
        "Item 3",
        "other"
      ],
    };

    expect(counter, "Do not focus element on setting value from survey.data").toLooseEqual(0);
    const q1 = survey.getQuestionByName("q1");
    const question = <QuestionCheckboxModel>q1.contentQuestion;
    question.clearValue();
    question.clickItemHandler(question.choices[0], true);
    expect(counter, "It is not other item").toLooseEqual(0);
    question.clickItemHandler(question.otherItem, true);
    expect(counter, "Focus on setting the question value").toLooseEqual(1);
    expect(question.renderedValue, "check question initial value").toEqualValues(["Item 1", "other"]);

    ComponentCollection.Instance.clear();
    SurveyElement.FocusElement = oldFunc;
  });
  test("Composite: Do not focus element on setting defaultValue & on setting value to survey.data, Bug#10016", () => {
    const oldFunc = SurveyElement.FocusElement;
    let counter = 0;
    SurveyElement.FocusElement = function (elId: string): boolean {
      counter ++;
      return true;
    };
    ComponentCollection.Instance.add({
      name: "customcheckbox",
      elementsJSON: [{
        "type": "checkbox",
        "name": "check",
        "choices": [
          "Item 1",
          "Item 2",
          "Item 3"
        ],
        "showOtherItem": true
      },
      { type: "text", name: "comment" }
      ]
    });
    const survey = new SurveyModel({
      elements: [{ type: "customcheckbox", name: "q1" }]
    });

    survey.data = { q1: { "check-Comment": "3",
      "check": [
        "Item 2",
        "Item 3",
        "other"
      ],
    } };

    expect(counter, "Do not focus element on setting value from survey.data").toLooseEqual(0);
    const q1 = survey.getQuestionByName("q1");
    const question = <QuestionCheckboxModel>(q1.contentPanel.getQuestionByName("check"));
    expect(question.renderedValue, "check question initial value").toEqualValues(["Item 2", "Item 3", "other"]);
    expect(question.comment, "check question comment").toLooseEqual("3");
    question.clearValue();
    question.clickItemHandler(question.choices[0], true);
    expect(counter, "It is not other item").toLooseEqual(0);
    question.clickItemHandler(question.otherItem, true);
    expect(counter, "Focus on setting the question value").toLooseEqual(1);
    expect(question.renderedValue, "check question initial value").toEqualValues(["Item 1", "other"]);

    ComponentCollection.Instance.clear();
    SurveyElement.FocusElement = oldFunc;
  });
  test("Composite: contentAriaHidden", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        {
          type: "text",
          name: "item1"
        },
        {
          type: "text",
          name: "item2"
        }
      ]
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "q1" }]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    expect(q1.contentAriaHidden).toBe(null);
    survey.setDesignMode(true);
    expect(q1.contentAriaHidden).toBe(true);
    survey.setDesignMode(false);
    expect(q1.contentAriaHidden).toBe(null);
  });
  test("Composite: text piping", () => {
    ComponentCollection.Instance.add({
      name: "test",
      elementsJSON: [
        {
          type: "text",
          name: "item1"
        },
        {
          type: "text",
          name: "item2"
        }
      ]
    });
    const survey = new SurveyModel({
      elements: [{ type: "test", name: "q1" }, { type: "text", name: "q2", title: "item: {q1.item1}" }]
    });
    const q1 = <QuestionCompositeModel>survey.getQuestionByName("q1");
    const q2 = <QuestionTextModel>survey.getQuestionByName("q2");
    q2.value = "test2";
    expect(q2.locTitle.renderedHtml, "q2 title is correct before piping").toLooseEqual("item: ");
    q1.contentPanel.getQuestionByName("item1").value = "test1";
    expect(q2.locTitle.renderedHtml, "q2 title is correct after piping").toLooseEqual("item: test1");

    const getter = new ValueGetter();
    const context = q1.getValueGetterContext();
    expect(getter.getValue("q2", context), "valueGetter #1").toLooseEqual("test2");
    expect(getter.getValue("composite.item1", context), "valueGetter #2").toLooseEqual("test1");
    expect(getter.getValue("q1.item1", context), "valueGetter #3").toLooseEqual("test1");

  });
  test("Single: supportAutoAdvance, bug#10149", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      questionJSON: { type: "radiogroup", choices: [1, 2, 3], showOtherItem: true },
    });
    const survey = new SurveyModel({
      elements: [{ type: "newquestion", name: "q1" }],
    });
    const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
    expect(q1.supportAutoAdvance(), "supportAutoAdvance #1").toLooseEqual(false);
    q1.contentQuestion.onMouseDown();
    expect(q1.supportAutoAdvance(), "supportAutoAdvance #2").toLooseEqual(true);
    q1.contentQuestion.value = "other";
    expect(q1.supportAutoAdvance(), "supportAutoAdvance #3").toLooseEqual(false);
  });
  test("Composite: survey instance in onLoad method", () => {
    let surveyInstance;
    let onLoadCallCount = 0;
    ComponentCollection.Instance.add({
      name: "ordertabledynamic",
      questionJSON: {
        type: "matrixdynamic",
      },
      onLoaded (question) {
        onLoadCallCount++;
        surveyInstance = question.survey;
      },
    });
    const survey = new SurveyModel({ pages: [{ "name": "p1" }] });
    const json = { type: "ordertabledynamic" };
    const question = Serializer.createClass(json["type"]);
    new JsonObject().toObject(json, question);
    expect(onLoadCallCount).toLooseEqual(0);
    expect(!surveyInstance).toBeTruthy();
    survey.pages[0].addQuestion(question);
    expect(onLoadCallCount).toLooseEqual(1);
    expect(!!surveyInstance).toBeTruthy();
  });
  test("Composite: panel dynamic & changing panel count, Bug#10403", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      elementsJSON: {
        type: "paneldynamic",
        name: "panel",
        templateElements: [{ type: "text", name: "q1" }],
        panelCount: 3
      }
    });
    const survey = new SurveyModel({ elements: [{ "name": "question1", type: "newquestion" }] });
    const question1 = <QuestionCompositeModel>survey.getQuestionByName("question1");
    const pd = <QuestionPanelDynamicModel>question1.contentPanel.getQuestionByName("panel");
    expect(pd.panelCount, "panel count #1").toLooseEqual(3);
    pd.panels[0].getQuestionByName("q1").value = "val1";
    expect(pd.panelCount, "panel count #2").toLooseEqual(3);
    expect(question1.value, "question. value #1").toEqualValues({ panel: [{ q1: "val1" }, {}, {}] });

  });
  test("Single: PanelDynamic, showQuestionNumbers recursive & questionStartIndex, Bug#10288", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      questionJSON: {
        type: "paneldynamic",
        showQuestionNumbers: "recursive",
        questionStartIndex: " a",
        templateTitle: "Panel Title #{panelIndex}",
        panelCount: 2,
        templateElements: [
          { type: "text", name: "q2" },
          { type: "text", name: "q3" }
        ]
      } });

    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "newquestion",
          name: "panel",
        },
        { type: "text", name: "q4" }
      ],
      showQuestionNumbers: "recursive",
      questionStartIndex: "1.1"
    });
    const singleQuestion = <QuestionCustomModel>survey.getQuestionByName("panel");
    expect(singleQuestion.wasRendered, "single question was rendered").toLooseEqual(true);
    const panel = singleQuestion.contentQuestion;
    expect(panel.showQuestionNumbers, "content question showQuestionNumbers").toLooseEqual("recursive");
    expect(panel.wasRendered, "panel was rendered").toLooseEqual(true);
    const panel1 = panel.panels[0];
    const panel2 = panel.panels[1];
    const q1 = survey.getQuestionByName("q1");
    const q4 = survey.getQuestionByName("q4");
    expect(q1.no, "q1 number").toLooseEqual("1.1");
    expect(panel.no, "panel number").toLooseEqual("1.2");
    expect(singleQuestion.no, "single question number").toLooseEqual("1.2");
    expect(panel1.locTitle.textOrHtml, "panel1 title").toLooseEqual("Panel Title #1");
    expect(panel2.locTitle.textOrHtml, "panel2 title").toLooseEqual("Panel Title #2");
    expect(panel1.getQuestionByName("q2").no, "panel1.q2 number").toLooseEqual("1.2 a");
    expect(panel1.getQuestionByName("q3").no, "panel1.q3 number").toLooseEqual("1.2 b");
    expect(panel2.getQuestionByName("q2").no, "panel2.q2 number").toLooseEqual("1.2 a");
    expect(panel2.getQuestionByName("q3").no, "panel2.q3 number").toLooseEqual("1.2 b");
    expect(q4.no, "q4 number").toLooseEqual("1.3");
  });
  test("Composite: allow to make the custom number rendering", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      elementsJSON: [
        { type: "text", name: "q1", title: "Question 1. {$parent.no}" },
        { type: "text", name: "q2", title: "Question 2. {$self.no}" }
      ],
      onCreated: function (question) {
        question.contentPanel.showQuestionNumbers = "recursive";
        question.contentPanel.getQuestionByName("q1").onGetNoCallback = (no: string): string => question.no;
      },
      numberQuestionsWithHiddenTitle: true
    });
    const survey = new SurveyModel({
      showQuestionNumbers: "recursive",
      elements: [
        { type: "text", name: "q1" },
        { "name": "question1", type: "newquestion", titleLocation: "hidden" },
        { type: "text", name: "q2" }
      ] });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    const compQuestion = <QuestionCompositeModel>survey.getQuestionByName("question1");
    const cq1 = compQuestion.contentPanel.getQuestionByName("q1");
    const cq2 = compQuestion.contentPanel.getQuestionByName("q2");
    expect(q1.no, "q1 number").toLooseEqual("1.");
    expect(q2.no, "q2 number").toLooseEqual("3.");
    expect(compQuestion.no, "composite question number").toLooseEqual("2.");
    expect(cq1.no, "cq1 number").toLooseEqual("2.");
    expect(cq2.no, "cq2 number").toLooseEqual("2.2.");
    expect(compQuestion.visibleIndex, "q2 visibleIndex").toLooseEqual(1);
    expect(cq1.visibleIndex, "cq1 visibleIndex").toLooseEqual(0);
    expect(cq2.visibleIndex, "cq2 visibleIndex").toLooseEqual(1);

    expect(cq1.locTitle.textOrHtml, "cq1 title").toLooseEqual("Question 1. 2.");
    expect(cq2.locTitle.textOrHtml, "cq2 title").toLooseEqual("Question 2. 2.2.");

  });
  test("Single: Merge with separate locale strings, Bug#10771", () => {
    ComponentCollection.Instance.add({
      name: "newquestion",
      inheritBaseProps: ["choices"],
      questionJSON:
      {
        type: "dropdown",
      }
    });
    var survey = new SurveyModel({
      elements: [{
        type: "newquestion",
        name: "q1",
        title: { default: "Title", de: "Titel" },
        description: { default: "Description", de: "Beschreibung" },
        choices: [{ value: 1, text: { default: "item en", de: "item de" } }]
      }]
    });
    const plainJSON = survey.toJSON({ storeLocaleStrings: false });
    expect(plainJSON.pages[0].elements[0], "check plain json").toEqualValues({
      type: "newquestion",
      name: "q1",
      choices: [1]
    });
    const enJSON = survey.getLocalizationJSON(["default"]);
    expect(enJSON.pages[0].elements[0], "check en json").toEqualValues({
      type: "newquestion",
      name: "q1",
      title: "Title",
      description: "Description",
      choices: [{ value: 1, text: "item en" }]
    });
    const deJSON = survey.getLocalizationJSON(["de"]);
    expect(deJSON.pages[0].elements[0], "check de json").toEqualValues({
      type: "newquestion",
      name: "q1",
      title: "Titel",
      description: "Beschreibung",
      choices: [{ value: 1, text: "item de" }]
    });
    const mergedSurvey = new SurveyModel(plainJSON);
    mergedSurvey.mergeLocalizationJSON(enJSON);
    mergedSurvey.mergeLocalizationJSON(deJSON);
    expect(mergedSurvey.toJSON().pages[0].elements[0], "check merged json").toEqualValues({
      type: "newquestion",
      name: "q1",
      title: { default: "Title", de: "Titel" },
      description: { default: "Description", de: "Beschreibung" },
      choices: [{ value: 1, text: { default: "item en", de: "item de" } }]
    });
  });
  test("Composite: Merge with separate locale strings, Bug#10771", () => {
    ComponentCollection.Instance.add(<any>{
      name: "newquestion",
      elementsJSON:
      [{
        type: "dropdown",
        name: "myQuestion",
      }],
      onInit() {
        Serializer.addProperty("newquestion", {
          name: "myChoices:choiceitem[]",
        });
      },
      onLoaded(question: QuestionCompositeModel) {
        this.setChoices(question);
      },
      onPropertyChanged(question: QuestionCompositeModel, propertyName: string) {
        if (propertyName == "myChoices") {
          this.setChoices(question);
        }
      },
      setChoices: (question: QuestionCompositeModel) => {
        const choices = question.myChoices;
        const dropdown = question.contentPanel.getQuestionByName("myQuestion") as QuestionDropdownModel;
        dropdown.choices = choices;
      }
    });
    var survey = new SurveyModel({
      elements: [{
        type: "newquestion",
        name: "q1",
        title: { default: "Title", de: "Titel" },
        description: { default: "Description", de: "Beschreibung" },
        myChoices: [{ value: 1, text: { default: "item en", de: "item de" } }]
      }]
    });
    const plainJSON = survey.toJSON({ storeLocaleStrings: false });
    expect(plainJSON.pages[0].elements[0], "check plain json").toEqualValues({
      type: "newquestion",
      name: "q1",
      myChoices: [1]
    });
    const enJSON = survey.getLocalizationJSON(["default"]);
    expect(enJSON.pages[0].elements[0], "check en json").toEqualValues({
      type: "newquestion",
      name: "q1",
      title: "Title",
      description: "Description",
      myChoices: [{ value: 1, text: "item en" }]
    });
    const deJSON = survey.getLocalizationJSON(["de"]);
    expect(deJSON.pages[0].elements[0], "check de json").toEqualValues({
      type: "newquestion",
      name: "q1",
      title: "Titel",
      description: "Beschreibung",
      myChoices: [{ value: 1, text: "item de" }]
    });
    const mergedSurvey = new SurveyModel(plainJSON);
    mergedSurvey.mergeLocalizationJSON(enJSON);
    mergedSurvey.mergeLocalizationJSON(deJSON);
    expect(mergedSurvey.toJSON().pages[0].elements[0], "check merged json").toEqualValues({
      type: "newquestion",
      name: "q1",
      title: { default: "Title", de: "Titel" },
      description: { default: "Description", de: "Beschreibung" },
      myChoices: [{ value: 1, text: { default: "item en", de: "item de" } }]
    });
    ComponentCollection.Instance.clear();
  });
});
