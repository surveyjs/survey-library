import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  ComponentCollection,
} from "../src/question_custom";
import { Serializer } from "../src/jsonobject";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionTextModel } from "../src/question_text";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { ItemValue } from "../src/itemvalue";
import { LocalizableString } from "../src/localizablestring";
import { PanelModel } from "../src/panel";
import { ArrayChanges, Base } from "../src/base";
import { QuestionFileModel } from "../src/question_file";
import { ConsoleWarnings } from "../src/console-warnings";
import { setOldTheme } from "./oldTheme";

export default QUnit.module("custom questions");

QUnit.test("Single: Register and load from json", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1", title: "my title" }],
  });
  assert.equal(survey.getAllQuestions().length, 1, "Question is created");
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.getType(), "newquestion", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
  const propName = Serializer.findProperty("newquestion", "name");
  assert.equal(propName.getValue(q), "q1", "prop.name is correct");
  assert.equal(q.getPropertyValue("name"), "q1", "getPropertyValue is correct");
  assert.equal(Serializer.getObjPropertyValue(q, "name"), "q1", "getObjPropertyValue is correct, #name");
  assert.equal(Serializer.getObjPropertyValue(q, "title"), "my title", "getObjPropertyValue is correct, #title");
  assert.equal(
    q.contentQuestion.getType(),
    "dropdown",
    "Type for question is correct"
  );
  assert.equal(q.contentQuestion.choices.length, 5, "There are five choices");
  assert.deepEqual(
    survey.toJSON(),
    {
      pages: [
        { name: "page1", elements: [{ type: "newquestion", name: "q1", title: "my title" }] },
      ],
    },
    "Seralized correctly"
  );
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: Register and load from json", function (assert) {
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
  assert.equal(survey.getAllQuestions().length, 1, "Question is created");
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(q.getType(), "customerinfo", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
  assert.equal(
    q.contentPanel.elements.length,
    2,
    "There are two elements in panel"
  );
  ComponentCollection.Instance.clear();
});

QUnit.test("Single: Create the wrapper question and sync the value", function (
  assert
) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentQuestion.getType(),
    "dropdown",
    "Question the type was created"
  );
  q.value = 1;
  assert.equal(q.contentQuestion.value, 1, "Set value to wrapper value");
  q.contentQuestion.value = 2;
  assert.equal(q.value, 2, "Set value to custom question");
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: sync values", function (assert) {
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
  assert.deepEqual(survey.data, { q1: { firstName: "John" } });
  q.value = { firstName: "Andrew", lastName: "Telnov" };
  assert.equal(firstName.value, "Andrew", "question value is replaced");
  assert.equal(lastName.value, "Telnov", "question value is set");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: disableDesignActions property", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.disableDesignActions,
    false,
    "Design action is available for root"
  );
  assert.equal(
    q.contentQuestion.disableDesignActions,
    true,
    "Design action is disabled for contentQuestion"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: disableDesignActions property", function (assert) {
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
  assert.equal(
    q.disableDesignActions,
    false,
    "Design action is available for root"
  );
  assert.equal(
    q.contentPanel.disableDesignActions,
    true,
    "Design action is disabled for contentPanel"
  );
  assert.equal(
    firstName.disableDesignActions,
    true,
    "Design action is disabled for firstName"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: read-only", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1", readOnly: true }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.isReadOnly, true, "root is readOnly");
  assert.equal(
    q.contentQuestion.isReadOnly,
    true,
    "contentQuestion is read Only"
  );
  q.readOnly = false;
  assert.equal(
    q.contentQuestion.isReadOnly,
    false,
    "contentQuestion is not read only"
  );
  q.readOnly = true;
  assert.equal(
    q.contentQuestion.isReadOnly,
    true,
    "contentQuestion is read only again"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: read only", function (assert) {
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
  assert.equal(q.isReadOnly, true, "root is readOnly");
  assert.equal(q.contentPanel.isReadOnly, true, "contentPanel is read Only");
  assert.equal(firstName.isReadOnly, true, "firstName is read Only");
  q.readOnly = false;
  assert.equal(
    q.contentPanel.isReadOnly,
    false,
    "contentQuestion is not read only"
  );
  assert.equal(firstName.isReadOnly, false, "firstName is not read Only");
  q.readOnly = true;
  assert.equal(
    q.contentPanel.isReadOnly,
    true,
    "contentPanel is read only again"
  );
  assert.equal(firstName.isReadOnly, true, "firstName is read Only again");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: hasError", function (assert) {
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
  assert.equal(q.hasErrors(), true, "contentQuestion is required");
  assert.equal(q.errors.length, 1, "There is one error");
  q.contentQuestion.value = 1;
  assert.equal(q.hasErrors(), false, "contentQuestion has value");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: hasError/isRequired", function (assert) {
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
  assert.equal(q.hasErrors(), true, "contentQuestion is required");
  assert.equal(q.errors.length, 1, "There is one error");
  q.contentQuestion.value = 1;
  assert.equal(q.hasErrors(), false, "contentQuestion has value");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: hasErrors", function (assert) {
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
  assert.equal(q.hasErrors(), true, "firstName is required");
  firstName.value = "abc";
  assert.equal(q.hasErrors(), false, "firstName has value");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: hasErrors/isRequired", function (assert) {
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
  assert.equal(q.hasErrors(), true, "question is empty");
  firstName.value = "abc";
  assert.equal(q.hasErrors(), false, "question is not empty");
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: onPropertyChanged", function (assert) {
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
  assert.equal(lastName.visible, true, "It is visible by default");
  q.showLastName = false;
  assert.equal(lastName.visible, false, "showLastName is false");
  q.showLastName = true;
  assert.equal(lastName.visible, true, "showLastName is true");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: create from code", function (assert) {
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
  assert.equal(
    q.contentQuestion.getType(),
    "dropdown",
    "content question created correctly"
  );
  assert.equal(
    q.contentQuestion.choices.length,
    5,
    "content question choices are here"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: create from code", function (assert) {
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
  assert.equal(firstName.getType(), "text", "first name is creted");
  assert.equal(lastName.getType(), "text", "last name is creted");
  assert.equal(firstName.isRequired, true, "first name is required");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: content questions numbering", function (assert) {
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
    showQuestionNumbers: "on",
    elements: [
      { type: "text", name: "q1" },
      { type: "customerinfo", name: "q2" },
      { type: "text", name: "q3" },
    ],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[1];
  var lastName = q.contentPanel.getQuestionByName("lastName");
  assert.equal(
    lastName.startWithNewLine,
    false,
    "onCreated function is called"
  );
  assert.equal(lastName.visibleIndex, 1, "second question");
  assert.equal(lastName.no, "b.", "second question, no is 'b.'");
  ComponentCollection.Instance.clear();
});
QUnit.test("Custom, get css from contentQuestion", function (assert) {
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
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot + " small",
    "Default question root, take small from dropdown"
  );
  assert.equal(q1.cssTitle, "title", "Default question title");
  q1.titleLocation = "left";
  var addLeft = " " + survey.css.question.titleLeftRoot;
  assert.equal(
    q1.cssRoot,
    defaultQuestionRoot + addLeft + " small",
    "titleLocation = left, take small from dropdown"
  );
  q1.titleLocation = "default";
  q1.value = 1;
  assert.equal(q1.isEmpty(), false, "q1 is not empty");
  assert.equal(q1.cssTitle, "title onAnswer", "q1 is not empty, show in title");
  q1.clearValue();
  assert.equal(q1.isEmpty(), true, "q1 is empty");
  assert.equal(q1.cssTitle, "title");
  q1.contentQuestion.value = 1;
  assert.equal(
    q1.cssTitle,
    "title onAnswer",
    "q1 is not empty, show in title, via contentQuestion"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite, update panel css", function (assert) {
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
  assert.equal(q1.cssRoot, "customercss small", "apply style from customer info");
  var lastName = q1.contentPanel.getQuestionByName("lastName");
  var defaultQuestionRoot = survey.css.question.mainRoot;
  assert.equal(
    lastName.cssRoot,
    defaultQuestionRoot + " small",
    "Update content question css"
  );
  lastName.value = "val";
  assert.equal(q1.isEmpty(), false, "q1 is not empty");
  assert.equal(q1.cssTitle, "title onAnswer", "q1 is not empty, show in title");
  lastName.clearValue();
  assert.equal(q1.isEmpty(), true, "q1 is empty");
  assert.equal(q1.cssTitle, "title", "q1 is clear");
  q1.value = { lastName: "val" };
  assert.equal(
    q1.cssTitle,
    "title onAnswer",
    "q1 is not empty, show in title, via lastName"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: defaultValue", function (assert) {
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
  assert.equal(q.value, 2, "defaultValue is set");
  assert.equal(
    q.contentQuestion.value,
    2,
    "defaultValue is set for contentQuestion"
  );
  assert.deepEqual(survey.data, { q1: 2 }, "set data into survey");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: defaultValue + valueName", function (assert) {
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
  assert.equal(q.value, 2, "defaultValue is set");
  assert.equal(
    q.contentQuestion.value,
    2,
    "defaultValue is set for contentQuestion"
  );
  assert.deepEqual(survey.data, { QQQ1: 2 }, "set data into survey");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: defaultValue", function (assert) {
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
  assert.equal(firstName.value, "Jon", "firstName defaultValue");
  assert.deepEqual(q.value, { firstName: "Jon" }, "question defaultValue");
  assert.deepEqual(survey.data, { q1: { firstName: "Jon" } }, "survey.data");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: defaultValue and survey in design mode", function (assert) {
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
  assert.equal(firstName.value, "Jon", "firstName defaultValue");
  assert.deepEqual(q.value, { firstName: "Jon", lastName: "Snow" }, "question defaultValue");
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: defaultValue and question.valueChangedCallback", function (assert) {
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
        if(boolQuestion.value === false) {
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
  assert.deepEqual(q.value, { bool: false, firstName: "Jon" });
  q.contentPanel.getQuestionByName("bool").value = true;
  q.contentPanel.getQuestionByName("bool").value = false;
  assert.deepEqual(q.value, { bool: false });
  ComponentCollection.Instance.clear();
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
      optionsCaption: "0",
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

QUnit.test("Single: matrixdropdown.defaultValue", function (assert) {
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
  assert.deepEqual(q.value, value, "defaultValue is set");
  assert.deepEqual(
    q.contentQuestion.value,
    value,
    "defaultValue is set for contentQuestion"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: defaultValueExpession, bug#4836", function (assert) {
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
  assert.equal(q.value, 2, "defaultValue is set");
  assert.equal(q.contentQuestion.value, 2, "defaultValue is set for contentQuestion");
  q.contentQuestion.value = 3;
  assert.equal(q.value, 3, "defaultValue is set, #2");
  assert.equal(q.contentQuestion.value, 3, "defaultValue is set for contentQuestion, #2");
  survey.setValue("q2", 4);
  assert.equal(q.value, 3, "defaultValue is set, #3");
  assert.equal(q.contentQuestion.value, 3, "defaultValue is set for contentQuestion, #3");
  assert.deepEqual(survey.data, { q1: 3, q2: 4 }, "set data into survey");
  q.clearValue();
  survey.setValue("q2", 5);
  assert.equal(q.value, 2, "defaultValue is set, #4");
  assert.equal(q.contentQuestion.value, 2, "defaultValue is set for contentQuestion, #4");
  assert.deepEqual(survey.data, { q1: 2, q2: 5 }, "set data into survey, #2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: defaultValueExpession & operations, bug#7280", function (assert) {
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
  assert.equal(q3.contentQuestion.value, 3, "q3.contentQuestion.value");
  assert.equal(q3.value, 3, "q3.value");
  assert.deepEqual(survey.data, { q1: 1, q2: 2, q3: 3 }, "Survey data");
  q1.value = 3;
  q2.value = 4;
  assert.equal(q3.contentQuestion.value, 7, "q3.contentQuestion.value, #2");
  assert.equal(q3.value, 7, "q3.value, #2");
  assert.deepEqual(survey.data, { q1: 3, q2: 4, q3: 7 }, "Survey data, #2");
  q3.contentQuestion.value = 9;
  assert.equal(q3.contentQuestion.value, 9, "q3.contentQuestion.value, #3");
  assert.equal(q3.value, 9, "q3.value, #3");
  assert.deepEqual(survey.data, { q1: 3, q2: 4, q3: 9 }, "Survey data, #3");
  q1.value = 5;
  q2.value = 7;
  assert.equal(q3.contentQuestion.value, 9, "q3.contentQuestion.value, #4");
  assert.equal(q3.value, 9, "q3.value, #4");
  assert.deepEqual(survey.data, { q1: 5, q2: 7, q3: 9 }, "Survey data, #4");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: matrixdropdown expressions", function (assert) {
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
  assert.deepEqual(
    survey.data,
    {
      q1: {
        Steak: { price: 23, qty: 1, total: 23 },
        Salmon: { price: 19, total: 0 },
        Beer: { price: 5, total: 0 },
      },
      "q1-total": { total: 23 },
    },
    "Set data corectly"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: expression, {composite} prefix", function (assert) {
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
  assert.equal(lastName.isVisible, false, "lastName is hidden by default");
  firstName.value = "Jon";
  assert.equal(lastName.isVisible, true, "lastName is showing now");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: remove invisible values", function (assert) {
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
  assert.equal(lastName.value, "last", "value set correctly");
  firstName.value = "Jon";
  survey.tryComplete();
  assert.deepEqual(
    survey.data,
    { q1: { firstName: "Jon" } },
    "remove lastName"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: matrixdropdown onCreated after load properties", function (
  assert
) {
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
          optionsCaption: "0",
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
  assert.equal(matrix.rows.length, 2, "There are two rows");
  assert.deepEqual(
    matrix.defaultValue,
    { Steak: { price: 25 }, Salmon: { price: 22 } },
    "Default value set correctly"
  );
  Serializer.removeClass("itemorder");
  ComponentCollection.Instance.clear();
});

QUnit.test("Complex: hide content question in designMode", function (assert) {
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
  assert.equal(middleName.isVisible, false, "It is invisible by default");
  assert.equal(
    middleName.areInvisibleElementsShowing,
    false,
    "All invisible content elements are stay invisible"
  );
  q.showMiddleName = true;
  assert.equal(middleName.isVisible, true, "showMiddleName is true");
  q.showMiddleName = false;
  assert.equal(middleName.isVisible, false, "showMiddleName is false");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: onAfterRender and onAfterRenderContentElement", function (
  assert
) {
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
  const el: HTMLElement = <any>({ a: 5 });
  q.afterRender(el);
  assert.equal(
    afterRenderQuestion.name,
    "q1",
    "onAfterRender, question parameter is correct"
  );
  assert.equal(
    (<any>afterRenderHtmlElement).a,
    5,
    "onAfterRender, htmlElement parameter is correct"
  );
  q.contentQuestion.afterRender(<any>7);
  assert.equal(
    afterRenderContentElementQuestion.name,
    "q1",
    "afterRenderContentElement, question parameter is correct"
  );
  assert.equal(
    afterRenderContentElement.getType(),
    "dropdown",
    "afterRenderContentElement, element parameter is correct"
  );
  assert.equal(
    afterRenderContentElementHtml,
    7,
    "afterRenderContentElement, htmlElement parameter is correct"
  );
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: onAfterRender and onAfterRenderContentElement", function (
  assert
) {
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
  assert.equal(
    afterRenderQuestion.name,
    "q1",
    "onAfterRender, question parameter is correct"
  );
  assert.equal(
    (<any>afterRenderHtmlElement).a,
    5,
    "onAfterRender, htmlElement parameter is correct"
  );
  (<Question>q.contentPanel.elements[0]).afterRender(<any>7);
  assert.equal(
    afterRenderContentElementQuestion.name,
    "q1",
    "afterRenderContentElement, question parameter is correct"
  );
  assert.equal(
    afterRenderContentElement.name,
    "firstName",
    "afterRenderContentElement, element parameter is correct"
  );
  assert.equal(
    afterRenderContentElementHtml,
    7,
    "afterRenderContentElement, htmlElement parameter is correct"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: update url, {composite} prefix", function (assert) {
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
  assert.equal(processedUrl, "an_url/newValue", "Url proccessed correctly");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: update url, {composite} prefix on loaded", function (
  assert
) {
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
  assert.equal(
    processedUrl,
    "an_url/newValue",
    "Url proccessed correctly on load"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: onValueChanged function", function (assert) {
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
  assert.equal(
    q.contentPanel.getQuestionByName("q1").value,
    "AA",
    "onValueChanged works"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: onValueChanged function, value is array", function (assert) {
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
  assert.equal(q.contentQuestion.html, "AB", "onValueChanged works #1");
  q.value = ["A", "B", "C"];
  assert.equal(q.contentQuestion.html, "ABC", "onValueChanged works #2");
  q.value = undefined;
  assert.equal(q.contentQuestion.html, "", "onValueChanged works #3");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: onValueChanging function", function (assert) {
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
  assert.equal(q.contentPanel.getQuestionByName("q2").value, 2, "onValueChanging works");
  assert.deepEqual(q.value, { q2: 2 }, "onValueChanging works, composite value");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: onMatrixCellValueChanging function", function (assert) {
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
        if(columnName === "col1" && value === 1) return 2;
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
  assert.equal(rows[0].cells[0].question.value, 2, "change value in matrix cell");
  assert.deepEqual(q.value, { q2: [{ col1: 2 }] }, "onValueChanging works, composite value");
  assert.deepEqual(survey.data, { q1: { q2: [{ col1: 2 }] } }, "survey.data has correct values");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: onValueChanging function, value is array", function (assert) {
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
  assert.equal(q.contentQuestion.value, 2, "onValueChanged works #1");
  assert.equal(q.value, 2, "onValueChanged works #2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: checkErrorsMode=onValueChanging", function (assert) {
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
  assert.equal(q1.value, "a", "keep the value");
  assert.equal(q1.errors.length, 1, "question has error");
  assert.deepEqual(
    q.value,
    { q1: "a" },
    "keep the value in composite question"
  );
  assert.deepEqual(survey.data, {}, "survey data is empty");
  q1.value = "a@a.com";
  assert.equal(q1.errors.length, 0, "question has no errors");
  assert.deepEqual(
    survey.data,
    { q1: { q1: "a@a.com" } },
    "survey data is empty"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: set value from survey.data", function (assert) {
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
  assert.equal(
    q.contentPanel.getQuestionByName("q1").value,
    "BB",
    "set value into the first question in composite"
  );
  assert.equal(
    q.contentPanel.getQuestionByName("q2").value,
    "B",
    "set value into the second question in composite"
  );
});
QUnit.test("Use components in dynamic panel", function (assert) {
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
  assert.deepEqual(survey.data, { q1: [{ q2: 1, q3: { q1: 1, q2: "B" } }] });
  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: addConditionObjectsByContext", function (assert) {
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
  assert.deepEqual(
    objs,
    [
      { name: "cp_question.q1", text: "cp_question.q1", question: "text" },
      {
        name: "cp_question.q2",
        text: "cp_question.Question 2",
        question: "dropdown",
      },
    ],
    "addConditionObjectsByContext work correctly for composite question"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: getNestedQuestions", function (assert) {
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
  assert.equal(questions.length, 2, "#1");
  assert.equal(questions[0].name, "q1", "#2");
  assert.equal(questions[1].name, "q2", "#3");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: visibleIf and showPreview, Bug#2674", function (assert) {
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
    showPreviewBeforeComplete: "showAllQuestions",
    elements: [{ type: "fullname", name: "name" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentPanel.getQuestionByName("lastName").isVisible,
    false,
    "The second question is invisible"
  );
  q.contentPanel.getQuestionByName("firstName").value = "Jon";
  assert.equal(
    q.contentPanel.getQuestionByName("lastName").isVisible,
    true,
    "The second question is visible"
  );
  q.contentPanel.getQuestionByName("lastName").value = "Snow";
  survey.showPreview();
  q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentPanel.getQuestionByName("lastName").isVisible,
    true,
    "The second question is still visible"
  );
  survey.cancelPreview();
  q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(
    q.contentPanel.getQuestionByName("lastName").isVisible,
    true,
    "The second question is still visible"
  );
  ComponentCollection.Instance.clear();
});
QUnit.test(
  "Composite: visibleIf and showPreview and clearInvisibleValues = 'onHiddenContainer', Bug#2718",
  function (assert) {
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
      showPreviewBeforeComplete: "showAllQuestions",
      clearInvisibleValues: "onHiddenContainer",
      elements: [{ type: "fullname", name: "name" }],
    });
    var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").isVisible,
      false,
      "The second question is invisible"
    );
    q.contentPanel.getQuestionByName("firstName").value = "Jon";
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").isVisible,
      true,
      "The second question is visible"
    );
    q.contentPanel.getQuestionByName("lastName").value = "Snow";
    survey.showPreview();
    q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").isVisible,
      true,
      "The second question is still visible"
    );
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").value,
      "Snow",
      "The value is still the same"
    );
    survey.cancelPreview();
    q = <QuestionCompositeModel>survey.getAllQuestions()[0];
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").isVisible,
      true,
      "The second question is visible after canceling Preview"
    );
    assert.equal(
      q.contentPanel.getQuestionByName("lastName").value,
      "Snow",
      "The value is still the same after canceling Preview"
    );

    ComponentCollection.Instance.clear();
  }
);

QUnit.test("Single: displayValue function, Bug#2678", function (assert) {
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
  assert.equal(q.displayValue, "text 1, text 3");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: displayValue function, Bug#2678", function (assert) {
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
  assert.deepEqual(q.displayValue, {
    "question 1": "text 1, text 3",
    "question 2": "text 2",
  });
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: in matrix dynamic question, Bug#2695", function (assert) {
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
  assert.equal(
    rows[0].cells[0].question.getType(),
    "newquestion",
    "cell question has correct type"
  );
  rows[0].cells[0].question.contentQuestion.value = "b";
  assert.equal(
    rows[0].cells[0].question.value,
    "b",
    "set value into cell question"
  );
  assert.equal(rows[0].cells[0].value, "b", "set value into cell");
  assert.deepEqual(matrix.value, [{ col1: "b" }], "set value into matrix");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: change locale, Bug#2730", function (assert) {
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
  assert.equal(locText.renderedHtml, "item en", "en locale");
  var hasChanged = false;
  locText.onChanged = () => {
    hasChanged = true;
  };
  survey.locale = "de";
  assert.equal(hasChanged, true, "Call notification about changing locale");
  assert.equal(locText.renderedHtml, "item de", "de locale");
  survey.locale = "";
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: change locale, Bug#2730", function (assert) {
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
  assert.ok(dropdown, "Question is here");
  var locText = <LocalizableString>dropdown.choices[0].locText;
  assert.equal(locText.renderedHtml, "item en", "en locale");
  var hasChanged = false;
  locText.onChanged = () => {
    hasChanged = true;
  };
  survey.locale = "de";
  assert.equal(hasChanged, true, "Call notification about changing locale");
  assert.equal(locText.renderedHtml, "item de", "de locale");
  survey.locale = "";
  ComponentCollection.Instance.clear();
});
QUnit.test("getUsedLocale, Bug#7510", function (assert) {
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
  assert.deepEqual(survey.getUsedLocales(), ["en", "de", "fr", "it"], "Pick-up locales from components");
  ComponentCollection.Instance.clear();
});
QUnit.test("getDisplayValue from component JSON function", function (assert) {
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
  assert.deepEqual(q.value, value, "Value should be assigned");
  assert.equal(q.displayValue, "First Last", "Obtain passed getDisplayValue function result");
  ComponentCollection.Instance.clear();
});
QUnit.test("Complex: panel dynamic should duplicate rows in designMode", function (assert) {
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
  assert.deepEqual(q.value, { panel: [{ q1: "val" }] }, "Set value correctly");
  q.defaultValue = { panel: [{ q1: "val1" }, { q2: "val2" }] };
  assert.equal(panel.panelCount, 2, "We have two panels in default value");
  assert.equal(panel.panels.length, 2, "We have two panels");
  ComponentCollection.Instance.clear();
});
QUnit.test("Check updateElementCss for custom question", function (assert) {
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
  assert.ok(css1);
  assert.ok(css2);
  question.updateElementCss();
  assert.notStrictEqual(question.cssClassesValue, css1);
  assert.notStrictEqual(question.contentQuestion.cssClassesValue, css2);
  ComponentCollection.Instance.clear();
});
QUnit.test("onvalueChanging/Changed events", function (assert) {
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
  assert.equal(question.value, "a", "component value is changed");
  assert.equal(counterChanging, 1, "counterChanging = 1");
  assert.equal(counterChanged, 1, "counterChanged = 1");
  question.value = "b";
  assert.equal(question.contentQuestion.value, "b", "contentQuestion value is changed");
  assert.equal(counterChanging, 2, "counterChanging = 2");
  assert.equal(counterChanged, 2, "counterChanged = 2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: survey.questionsOnPageMode = `singlePage`", function (assert) {
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
  assert.equal(q.getType(), "newquestion", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
  assert.equal(q.value, 3, "value is correct");
  assert.equal(q.contentQuestion.value, 3, "content question value is correct");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: in matrices cells", function (assert) {
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
  assert.equal(q.getType(), "customerinfo", "The correct type is created");
  assert.equal(q.contentPanel.elements.length, 2, "There are two elements in panel");
  q.contentPanel.getQuestionByName("firstName").value = "Jon";
  q.contentPanel.getQuestionByName("lastName").value = "Snow";
  assert.deepEqual(q.value, { firstName: "Jon", lastName: "Snow" }, "Set value to composite question correctly");
  assert.deepEqual(row.value, { col1: { firstName: "Jon", lastName: "Snow" } }, "Row value is correct");
  assert.deepEqual(matrix.value, [{ col1: { firstName: "Jon", lastName: "Snow" } }], "Matrix value is correct");
  assert.deepEqual(survey.data, { matrix: [{ col1: { firstName: "Jon", lastName: "Snow" } }] }, "survey.data is correct");

  survey.data = { matrix: [
    { col1: { firstName: "Jaime", lastName: "Lannister" } },
    { col1: { firstName: "Jon", lastName: "Snow" } }] };

  row = matrix.visibleRows[0];
  q = row.cells[0].question;
  assert.equal(q.contentPanel.getQuestionByName("firstName").value, "Jaime", "row 0, firstName");
  assert.equal(q.contentPanel.getQuestionByName("lastName").value, "Lannister", "row 0, lastname");
  row = matrix.visibleRows[1];
  q = row.cells[0].question;
  assert.equal(q.contentPanel.getQuestionByName("firstName").value, "Jon", "row 1, firstName");
  assert.equal(q.contentPanel.getQuestionByName("lastName").value, "Snow", "row 1, lastname");
  ComponentCollection.Instance.clear();
});

QUnit.test("Single: isContentElement property", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(
    q.isContentElement,
    false,
    "Design is available for root"
  );
  assert.equal(
    q.contentQuestion.isContentElement,
    true,
    "Design is disabled for contentQuestion"
  );
  ComponentCollection.Instance.clear();
});

QUnit.test("Single: matrixdropdown & getProgressInfo", function (assert) {
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
  assert.deepEqual(q.getProgressInfo(), {
    questionCount: 3,
    answeredQuestionCount: 0,
    requiredQuestionCount: 3,
    requiredAnsweredQuestionCount: 0,
  });
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: text & getProgressInfo", function (assert) {
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
  assert.deepEqual(q1.getProgressInfo(), {
    questionCount: 1,
    answeredQuestionCount: 0,
    requiredQuestionCount: 1,
    requiredAnsweredQuestionCount: 0,
  }, "q1");
  assert.deepEqual(q2.getProgressInfo(), {
    questionCount: 1,
    answeredQuestionCount: 0,
    requiredQuestionCount: 1,
    requiredAnsweredQuestionCount: 0,
  }, "q2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: getProgressInfo", function (assert) {
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
  assert.deepEqual(q1.getProgressInfo(), {
    questionCount: 2,
    answeredQuestionCount: 0,
    requiredQuestionCount: 1,
    requiredAnsweredQuestionCount: 0,
  }, "q1");
  assert.deepEqual(q2.getProgressInfo(), {
    questionCount: 2,
    answeredQuestionCount: 0,
    requiredQuestionCount: 1,
    requiredAnsweredQuestionCount: 0,
  }, "q2");
  assert.deepEqual(q3.getProgressInfo(), {
    questionCount: 2,
    answeredQuestionCount: 0,
    requiredQuestionCount: 0,
    requiredAnsweredQuestionCount: 0,
  }, "q3");
  assert.deepEqual(q4.getProgressInfo(), {
    questionCount: 2,
    answeredQuestionCount: 0,
    requiredQuestionCount: 1,
    requiredAnsweredQuestionCount: 0,
  }, "q4");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: Support carry-forward", function (assert) {
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
  assert.equal(q2.choicesFromQuestion, "q1", "choicesFromQuestion is loaded");
  assert.equal(q2.choicesFromQuestionMode, "selected", "choicesFromQuestionMode is loaded");
  assert.equal(q2.visibleChoices.length, 0, "There is no visible choices");
  q1.value = [1, 3, 5];
  assert.equal(q2.visibleChoices.length, 3, "Choices are here");
  assert.equal(q2.visibleChoices[1].value, 3, "A choice value is correct");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: merge data, Bug#5583", function (assert) {
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
  assert.deepEqual(survey.data, { q1: { firstName: "Jon" } }, "Survey data is correct");
  survey.mergeData({ q1: { lastName: "Snow" } });
  assert.deepEqual(q.value, { firstName: "Jon", lastName: "Snow" });
  survey.mergeData({ q1: { firstName: "John", lastName: "Doe" } });
  assert.deepEqual(q.value, { firstName: "John", lastName: "Doe" });
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: Change css rules for content question", function (assert) {
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
  assert.equal(q.contentQuestion.cssClasses.root, "css_question", "Set the css correctly");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: Change css rules for content questions", function (assert) {
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
      if(element.name === "firstName") {
        css.root = "css_question1";
      }
      if(element.name === "lastName") {
        css.root = "css_question2";
      }
    }
  };
  ComponentCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "fullname", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  assert.equal(q.contentPanel.questions[0].cssClasses.root, "css_question1", "Set the css correctly, #1");
  assert.equal(q.contentPanel.questions[1].cssClasses.root, "css_question2", "Set the css correctly, #2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: with expression", function (assert) {
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

  assert.equal(_data.length, 0, "#1");
  assert.equal(onValueChangedCounter, 0, "#2");
  assert.deepEqual(q.value, { corner: 0, cornerRadius: "0px" }, "#3");

  q.contentPanel.getQuestionByName("corner").value = 5;
  assert.equal(onValueChangedCounter, 2, "#4");
  assert.deepEqual(q.value, { corner: 5, cornerRadius: "5px" }, "#5");
  assert.deepEqual(_data[0], { corner: 5, cornerRadius: "0px" }, "#6");
  assert.deepEqual(_data[1], { corner: 5, cornerRadius: "5px" }, "#7");

  q.value = { corner: 4 };
  assert.deepEqual(q.value, { corner: 4, cornerRadius: "4px" }, "#8");

  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: with setValueIf & setValueExpression, bug#7888", function (assert) {
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
  assert.equal(q2.isEmpty(), true, "#1");
  q1.value = 1;
  assert.equal(q2.value, 2, "#2");
  q1.value = 3;
  assert.equal(q2.value, 6, "#3");
  q1.clearValue();
  assert.equal(q2.value, 6, "#4");

  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: check valueToData and valueFromData callbacks", function (assert) {
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
  assert.equal(q.value, "a b c");
  q.value = "a b c d";
  assert.deepEqual(survey.data["q1"], ["a", "b", "c", "d"]);
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite & onValueChanged", function (assert) {
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
  assert.equal(onValueChangedCounter, 1 + 1); //+ runCondition to chagne the value
  assert.deepEqual(survey.data, { q1: { backcolor: "#ffffff", hovercolor: "#f8f8f8", corner: 4, cornerRadius: "4px", border: "0 1 2 rgba(0, 0, 0, 0.15)" } });

  ComponentCollection.Instance.clear();
});
QUnit.test("Composite & valueToQuestion/valueFromQuestion, #6475", function (assert) {
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
      if(!val) return "";
      let res = !!val.item1 ? val.item1 : "";
      res += ",";
      res += !!val.item2 ? val.item2 : "";
      return res;
    },
    valueFromQuestion(val: any): any {
      if(!val) return {};
      const res = val.split(",");
      if(res.length < 2) res.push("");
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
  assert.equal(qItem1.value, "val1", "item1 question value is correct, #1");
  assert.equal(qItem2.value, "val2", "item2 question value is correct, #1");
  assert.equal(q1.value, "val1,val2", "composite question value is correct, #1");
  assert.deepEqual(survey.data, { q1: "val1,val2" }, "survey data is correct, #1");
  q1.value = "val3,val4";
  assert.equal(qItem1.value, "val3", "item1 question value is correct, #2");
  assert.equal(qItem2.value, "val4", "item2 question value is correct, #2");
  assert.equal(q1.value, "val3,val4", "composite question value is correct, #2");
  assert.deepEqual(survey.data, { q1: "val3,val4" }, "survey data is correct, #2");

  const q2 = <QuestionCompositeModel>survey.getQuestionByName("q2");
  const q2Settings = <QuestionCompositeModel>(q2.contentPanel.getQuestionByName("settings"));
  const q2SettingsItem1 = q2Settings.contentPanel.getQuestionByName("item1");
  const q2SettingsItem2 = q2Settings.contentPanel.getQuestionByName("item2");
  q2SettingsItem1.value = "val5";
  q2SettingsItem2.value = "val6";
  assert.equal(q2SettingsItem1.value, "val5", "item1 question value is correct, #3");
  assert.equal(q2SettingsItem2.value, "val6", "item2 question value is correct, #3");
  assert.equal(q2Settings.value, "val5,val6", "composite question value is correct, #3");
  assert.deepEqual(q2.value, { settings: "val5,val6" }, "composite root question value is correct, #3");
  assert.deepEqual(survey.data, { q1: "val3,val4", q2: { settings: "val5,val6" } }, "survey data is correct, #3");
  q2Settings.value = "val7,val8";
  assert.equal(q2SettingsItem1.value, "val7", "item1 question value is correct, #4");
  assert.equal(q2SettingsItem2.value, "val8", "item2 question value is correct, #4");
  assert.equal(q2Settings.value, "val7,val8", "composite question value is correct, #4");
  assert.deepEqual(q2.value, { settings: "val7,val8" }, "composite root question value is correct, #4");
  assert.deepEqual(survey.data, { q1: "val3,val4", q2: { settings: "val7,val8" } }, "survey data is correct, #4");
  q2.value = { settings: "val9,val10" };
  assert.equal(q2SettingsItem1.value, "val9", "item1 question value is correct, #5");
  assert.equal(q2SettingsItem2.value, "val10", "item2 question value is correct, #5");
  assert.equal(q2Settings.value, "val9,val10", "composite question value is correct, #5");
  assert.deepEqual(q2.value, { settings: "val9,val10" }, "composite root question value is correct, #5");
  assert.deepEqual(survey.data, { q1: "val3,val4", q2: { settings: "val9,val10" } }, "survey data is correct, #5");

  ComponentCollection.Instance.clear();
});
QUnit.test("needResponsiveWidth", function (assert) {
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
  assert.equal(survey.getQuestionByName("q1").needResponsiveWidth(), true, "single - matrix");
  assert.equal(survey.getQuestionByName("q2").needResponsiveWidth(), false, "single - text");
  assert.equal(survey.getQuestionByName("q3").needResponsiveWidth(), false, "complex - text");
  assert.equal(survey.getQuestionByName("q4").needResponsiveWidth(), true, "single - matrix");
  ComponentCollection.Instance.clear(true);
});
QUnit.test("Single & getValue/setValue, #6475", function (assert) {
  ComponentCollection.Instance.add({
    name: "singleq",
    showInToolbox: false,
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
    getValue(val: any): any {
      if(!val) return val;
      return "val:" + val.toString();
    },
    setValue(val: any): any {
      if(!val) return val;
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
  assert.equal(q1.value, "val:2", "#1");
  q1.value = "val:4";
  assert.equal(q1.contentQuestion.value, 4, "#2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: onHidingContent", function (assert) {
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
  assert.equal(counter, 0, "Initial");
  survey.doComplete();
  assert.equal(counter, 1, "onComplete");
  ComponentCollection.Instance.clear();
});
QUnit.test("Complex: onHidingContent", function (assert) {
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
  assert.equal(counter, 0, "Initial");
  survey.doComplete();
  assert.equal(counter, 2, "onComplete");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: Apply error css", function (assert) {
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
  assert.equal(qText.cssClasses.onError, errorCss, "error css is correct");
  assert.equal(qText.getControlClass().indexOf(errorCss) < 0, true, "errors is not here");
  q.validate(true);
  assert.equal(qText.getControlClass().indexOf(errorCss) > -1, true, "errors is here");
  ComponentCollection.Instance.clear();
});
QUnit.test("ComponentCollection.Instance.remove", function (assert) {
  ComponentCollection.Instance.add({
    name: "newquestion",
    questionJSON: { type: "text" },
  });
  assert.equal(ComponentCollection.Instance.getCustomQuestionByName("newquestion").name, "newquestion", "it exists");
  assert.equal(ComponentCollection.Instance.remove("aaa"), false, "aaa is not exists");
  assert.equal(ComponentCollection.Instance.remove("newquestion"), true, "newquestion is removed");
  assert.notOk(ComponentCollection.Instance.getCustomQuestionByName("newquestion"), "newquestion is not here");
});
QUnit.test("internal boolean flag", function (assert) {
  ComponentCollection.Instance.add({
    name: "newquestion1",
    internal: true,
    questionJSON: { type: "text" },
  });
  ComponentCollection.Instance.add({
    name: "newquestion2",
    questionJSON: { type: "text" },
  });
  assert.equal(ComponentCollection.Instance.getCustomQuestionByName("newquestion1").name, "newquestion1", "newquestion1 is here");
  assert.equal(ComponentCollection.Instance.getCustomQuestionByName("newquestion2").name, "newquestion2", "newquestion2 is here");
  ComponentCollection.Instance.clear();
  assert.equal(ComponentCollection.Instance.getCustomQuestionByName("newquestion1").name, "newquestion1", "newquestion1 is here");
  assert.notOk(ComponentCollection.Instance.getCustomQuestionByName("newquestion2"), "newquestion2 is not here, #1");
  ComponentCollection.Instance.clear(true);
  assert.notOk(ComponentCollection.Instance.getCustomQuestionByName("newquestion1"), "newquestion1 is not here, #2");
  assert.notOk(ComponentCollection.Instance.getCustomQuestionByName("newquestion2"), "newquestion2 is not here, #2");
});
QUnit.test("Set title from single component into question", function (assert) {
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
  assert.equal(q1.locTitle.renderedHtml, "Title from Component", "q1 title");
  assert.equal(q2.locTitle.renderedHtml, "Q2 title", "q2 title");
  assert.equal(q3.name, "q3", "q3 name");
  assert.equal(q3.locTitle.renderedHtml, "Title from Component", "q3 title");
  assert.deepEqual(q1.toJSON(), { name: "q1" }, "Do not serialize title");
  ComponentCollection.Instance.clear();
});
QUnit.test("Allow to add question via addNewQuestion for component, but not for abstract classes", function (assert) {
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
  assert.ok(q2, "component created");
  assert.notOk(q3, "matrixdropdownbase is not created");
  ComponentCollection.Instance.clear();
});
QUnit.test("text placeholder is not updated on changing locale", function (assert) {
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
  assert.equal(contentQuestion.renderedPlaceholder, "en-TextPH", "en placeholder");
  survey.locale = "de";
  assert.equal(contentQuestion.renderedPlaceholder, "de-TextPH", "de placeholder");
  ComponentCollection.Instance.clear();
});
QUnit.test("showPreview & default value, #7508", function (assert) {
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
  assert.equal(q1.value, "abc", "q1.value #1");
  assert.equal(contentQuestion.value, "abc", "contentQuestion.value #1");
  contentQuestion.value = "edf";
  assert.equal(q1.value, "edf", "q1.value #2");
  assert.equal(contentQuestion.value, "edf", "contentQuestion.value #2");
  survey.showPreview();
  assert.equal(q1.value, "edf", "q1.value #3");
  assert.equal(contentQuestion.value, "edf", "contentQuestion.value #3");
  const q1Preview = <QuestionCustomModel>survey.getQuestionByName("q1");
  const contentQuestionPreview = <QuestionTextModel>q1.contentQuestion;
  assert.equal(q1Preview.value, "edf", "q1Preview.value #3");
  assert.equal(contentQuestionPreview.value, "edf", "contentQuestionPreview.value #3");
  survey.cancelPreview();
  assert.equal(q1.value, "edf", "q1.value #4");
  assert.equal(contentQuestion.value, "edf", "contentQuestion.value #4");
  ComponentCollection.Instance.clear();
});
QUnit.test("showPreview & default value, #7640", function (assert) {
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
  assert.equal(contentQuestion.locTitle.renderedHtml, "abc=123", "contentQuestion.title");
  assert.equal(q1.locTitle.renderedHtml, "abc=123", "q1.title");

  ComponentCollection.Instance.clear();
});
QUnit.test("single component: defaultQuestionTitle", function (assert) {
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
  assert.equal(q1.locTitle.renderedHtml, "abc=123 en", "q1.title en");
  survey.locale = "de";
  assert.equal(q1.locTitle.renderedHtml, "abc=123 de", "q1.title de");

  ComponentCollection.Instance.clear();
});
QUnit.test("single component: defaultQuestionTitle & editor placeholder", function (assert) {
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
  assert.equal(q3.placeholder, "abc", "#1");
  prop.onPropertyEditorUpdate(q2, q3);
  assert.equal(q3.placeholder, "q2", "#2");
  ComponentCollection.Instance.clear();
});
QUnit.test("composite component: defaultQuestionTitle", function (assert) {
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
  assert.equal(q1.locTitle.renderedHtml, "abc=123 en", "q1.title en");
  survey.locale = "de";
  assert.equal(q1.locTitle.renderedHtml, "abc=123 de", "q1.title de");

  ComponentCollection.Instance.clear();
});
QUnit.test("single component: inheritBaseProps: array<string>", function (assert) {
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
  assert.equal(q1.allowClear, false, "q1.allowClear #1");
  assert.equal(content.allowClear, false, "content.allowClear #1");
  q1.allowClear = true;
  assert.equal(q1.allowClear, true, "q1.allowClear #2");
  assert.equal(content.allowClear, true, "content.allowClear #2");
  content.allowClear = false;
  assert.equal(q1.allowClear, false, "q1.allowClear #3");
  assert.equal(content.allowClear, false, "content.allowClear #3");

  assert.equal(q1.showOtherItem, true, "q1.showOtherItem #1");
  assert.equal(content.showOtherItem, true, "content.showOtherItem #1");
  q1.showOtherItem = false;
  assert.equal(q1.showOtherItem, false, "q1.showOtherItem #2");
  assert.equal(content.showOtherItem, false, "content.showOtherItem #2");
  content.showOtherItem = true;
  assert.equal(q1.showOtherItem, true, "q1.showOtherItem #3");
  assert.equal(content.showOtherItem, true, "content.showOtherItem #3");
  const json = q1.toJSON();
  assert.equal(json.allowClear, false, "json.allowClear");
  assert.equal(json.showOtherItem, true, "json.showOtherItem");

  ComponentCollection.Instance.clear();
});
QUnit.test("single component: inheritBaseProps: array<string> #2 + check property change notification #", function (assert) {
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
  assert.equal(q1.placeholder, "abc", "q1.placeholder #1");
  assert.equal(content.placeholder, "abc", "content.placeholder #1");
  survey.onPropertyValueChangedCallback = (name: string, oldValue: any, newValue: any, sender: Base, arrayChanges: ArrayChanges): void => {
    propertyName = name;
    counter ++;
  };
  q1.placeholder = "bcd";
  assert.equal(propertyName, "placeholder", "send notification, propertyname");
  assert.equal(counter, 1, "send notification, counter");
  assert.equal(q1.placeholder, "bcd", "q1.placeholder #2");
  assert.equal(content.placeholder, "bcd", "content.placeholder #2");
  content.placeholder = "cde";
  assert.equal(q1.placeholder, "cde", "q1.placeholder #3");
  assert.equal(content.placeholder, "cde", "content.placeholder #3");

  const prop = Serializer.getOriginalProperty(q1, "placeholder");
  assert.equal(prop.name, "placeholder", "prop.className is correct");
  assert.equal(prop.isVisible("form", q1), true, "it is visible");
  ComponentCollection.Instance.clear();
});
QUnit.test("single component: inheritBaseProps: true", function (assert) {
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
  const q1 = <QuestionCustomModel>survey.getQuestionByName("q1");
  assert.equal(Serializer.getObjPropertyValue(q1, "name"), "q1", "getObjPropertyValue is correct, #name");
  assert.equal(Serializer.getObjPropertyValue(q1, "title"), "my title", "getObjPropertyValue is correct, #title");
  assert.equal(Serializer.getObjPropertyValue(q1, "showOtherItem"), true, "getObjPropertyValue is correct, #showOtherItem");
  const content = <QuestionDropdownModel>q1.contentQuestion;
  assert.equal(q1.getDynamicType(), "dropdown", "q1.getDynamicType()");
  assert.equal(content.choices.length, 3, "content.choices");
  assert.notOk(q1.choices, "q1.choices");
  assert.equal(q1.allowClear, false, "q1.allowClear #1");
  assert.equal(content.allowClear, false, "content.allowClear #1");
  q1.allowClear = true;
  assert.equal(q1.allowClear, true, "q1.allowClear #2");
  assert.equal(content.allowClear, true, "content.allowClear #2");
  content.allowClear = false;
  assert.equal(q1.allowClear, false, "q1.allowClear #3");
  assert.equal(content.allowClear, false, "content.allowClear #3");

  assert.equal(q1.showOtherItem, true, "q1.showOtherItem #1");
  assert.equal(content.showOtherItem, true, "content.showOtherItem #1");
  q1.showOtherItem = false;
  assert.equal(q1.showOtherItem, false, "q1.showOtherItem #2");
  assert.equal(content.showOtherItem, false, "content.showOtherItem #2");
  content.showOtherItem = true;
  assert.equal(q1.showOtherItem, true, "q1.showOtherItem #3");
  assert.equal(content.showOtherItem, true, "content.showOtherItem #3");
  const json = q1.toJSON();
  assert.equal(json.allowClear, false, "json.allowClear");
  assert.equal(json.showOtherItem, true, "json.showOtherItem");

  ComponentCollection.Instance.clear();
});
QUnit.test("single component, file: inheritBaseProps: true, Bug #8757", function (assert) {
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
  assert.equal(Serializer.getObjPropertyValue(q1, "name"), "q1", "getObjPropertyValue is correct, #name");
  assert.equal(Serializer.getObjPropertyValue(q1, "showCommentArea"), true, "getObjPropertyValue is correct, #showCommentArea");

  ComponentCollection.Instance.clear();
});
QUnit.test("Bug with visibleIf with composite.question and panel dynamic. Bug#7771", function (assert) {
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
  assert.equal(q2.isVisible, false, "isVisible #1");
  q1.value = true;
  assert.equal(q2.isVisible, true, "isVisible #2");
  q2.addPanel();
  assert.equal(q2.isVisible, true, "isVisible #3");
  ComponentCollection.Instance.clear();
});
QUnit.test("file question in composite component doesn't show preview in preview mode. Bug#7826", function (assert) {
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
  assert.equal(file_q1.showPreviewContainer, true, "file_q1 #1");
  assert.equal(file_q2.showPreviewContainer, true, "file_q2 #1");

  survey.showPreview();
  assert.equal(survey.state, "preview", "state #1");
  const compQuestion_preview = <QuestionCompositeModel>survey.getQuestionByName("q1");
  const file_q1_preview = <QuestionFileModel>compQuestion_preview.contentPanel.getQuestionByName("file_q");
  const file_q2_preview = <QuestionFileModel>survey.getQuestionByName("q2");
  assert.equal(file_q1_preview.showPreviewContainer, true, "file_q1_preview #1");
  assert.equal(file_q2_preview.showPreviewContainer, true, "file_q2_preview #1");

  survey.cancelPreview();
  assert.equal(survey.state, "running", "state #2");
  assert.equal(file_q1.showPreviewContainer, true, "file_q1 #1");
  assert.equal(file_q2.showPreviewContainer, true, "file_q2 #1");

  ComponentCollection.Instance.clear();
});

QUnit.test("Composite + Ranking", function (assert) {
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

  assert.equal(q_ranking.unRankingChoices.length, 2, "ranking value is correct (unrank list length) ['d', 'e']");
  assert.equal(q_ranking.rankingChoices.length, 3, "ranking value is correct (rank list length) ['a', 'b', 'c'");

  ComponentCollection.Instance.clear();
});
QUnit.test("Single: showPreviewBeforeComplete Bug#8005", function (assert) {
  ComponentCollection.Instance.add({
    name: "test",
    questionJSON: { type: "dropdown", choices: [1, 2, 3] },
  });
  const survey = new SurveyModel({
    elements: [{ type: "test", name: "question1" }],
    showPreviewBeforeComplete: "showAllQuestions"
  });
  survey.getQuestionByName("question1").value = 1;
  survey.showPreview();
  assert.deepEqual(survey.data, { question1: 1 }, "survey.data #2");
  survey.tryComplete();
  assert.deepEqual(survey.data, { question1: 1 }, "survey.data #2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Single: validate", function (assert) {
  let errorText = "";
  ComponentCollection.Instance.add({
    name: "test",
    questionJSON: { type: "dropdown", choices: [1, 2, 3] },
    getErrorText: (question): string => {
      if(question.value !== 1) {
        errorText = "val";
        return "value should be 1";
      }
      return "";
    }
  });
  const survey = new SurveyModel({
    elements: [{ type: "test", name: "question1" }],
    showPreviewBeforeComplete: "showAllQuestions"
  });
  const q = survey.getQuestionByName("question1");
  q.value = 2;
  survey.validate();
  assert.equal(errorText, "val", "errorText");
  assert.equal(q.errors.length, 1, "Errors length #1");
  assert.equal(q.errors[0].text, "value should be 1", "Error text");
  q.value = 1;
  assert.equal(q.errors.length, 0, "Errors length #2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: validate", function (assert) {
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
      if(!q1.isEmpty() && q3.isEmpty()) return "Select q2";
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
  assert.equal(q1.errors.length, 0, "q1 errors #1");
  assert.equal(q2.errors.length, 1, "q2 errors #1");
  q1.contentPanel.getQuestionByName("q1").value = "val";
  q2.contentPanel.getQuestionByName("q1").value = "val";
  survey.validate();
  assert.equal(q1.errors.length, 1, "q1 errors #2");
  assert.equal(q1.errors[0].text, "Select q2", "q1 errors text #2");
  assert.equal(q2.errors.length, 1, "q2 errors #2");
  assert.equal(q2.errors[0].text, "Select q2", "q2 errors text #2");
  q1.contentPanel.getQuestionByName("q2").value = 1;
  q2.contentPanel.getQuestionByName("q2").value = 2;
  assert.equal(q1.contentPanel.getQuestionByName("q3").value, 1, "q1.q3 value");
  assert.equal(q2.contentPanel.getQuestionByName("q3").value, 2, "q2.q3 value");
  survey.validate();
  assert.equal(q1.errors.length, 0, "q1 errors #3");
  assert.equal(q2.errors.length, 0, "q2 errors #3");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: update questions on a value change", function (assert) {
  ComponentCollection.Instance.add({
    name: "test",
    elementsJSON: [
      { type: "text", name: "q1" },
      { type: "dropdown", name: "q2" },
      { type: "text", name: "q3" }
    ],
    onValueSet: (question, newValue: any): void => {
      if(!!newValue && !!newValue.q3) {
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
  assert.equal(internalQ2.choices.length, 1, "choices.length #1");
  assert.equal(internalQ2.choices[0].value, 2, "choices[0].value #1");
  q1.value = { q1: 1, q3: 3 };
  assert.equal(internalQ2.choices.length, 1, "choices.length #2");
  assert.equal(internalQ2.choices[0].value, 3, "choices[0].value #2");
  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: onValueChanging and survey.onValueChanging", function (assert) {
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
  assert.deepEqual(onValueChangingData, { q1: "test1" }, "test #1");
  q1.contentPanel.getQuestionByName("q2").value = 2;
  assert.deepEqual(onValueChangingData, { q1: "test1", q2: 2, q3: 2 }, "test #2");
  q1.contentPanel.getQuestionByName("q1").value = "test2";
  assert.deepEqual(onValueChangingData, { q1: "test2" }, "test #3");

  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: onValueChanged and survey.data", function (assert) {
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
  assert.deepEqual(survey.data, { q1: { q1: "test1" } }, "test #1");
  q1.contentPanel.getQuestionByName("q2").value = 2;
  assert.deepEqual(survey.data, { q1: { q1: "test1", q2: 2, q3: 2 } }, "test #2");
  q1.contentPanel.getQuestionByName("q1").value = "test2";
  assert.deepEqual(survey.data, { q1: { q1: "test2" } }, "test #3");

  ComponentCollection.Instance.clear();
});
QUnit.test("Single: use incorrect json", function (assert) {
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

  assert.equal(q1.contentQuestion.getType(), "dropdown", "q1 content type");
  assert.equal(q2.contentQuestion.getType(), "text", "q2 content type");
  assert.deepEqual(reportTexts, ["Could not create component: 'test1'. questionJSON should be a question.",
    "Could not create component: 'test2'. questionJSON should be a question."], "check console errors");

  ComponentCollection.Instance.clear();
  ConsoleWarnings.error = prev;
});
QUnit.test("single component: inheritBaseProps - do not duplicate description property", function (assert) {
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
  assert.equal(q1.description, "Custom Question", "Get description from internal description");
  survey.locale = "de";
  assert.equal(q1.description, "Aangepaste vraag", "Get description from internal description for 'de'");
  const props = Serializer.getPropertiesByObj(q1);
  let descriptionCounter = 0;
  props.forEach(prop => {
    if(prop.name === "description") {
      descriptionCounter ++;
    }
  });
  assert.equal(descriptionCounter, 1, "We have one description property");
  ComponentCollection.Instance.clear();
});
QUnit.test("composite component: do not reset dynamic panels/dynamic rows, Bug#8612", function (assert) {
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
  assert.equal(matrix.rowCount, 3, "There are 3 rows");
  assert.equal(panel.panelCount, 3, "There are 3 panels");

  ComponentCollection.Instance.clear();
});

QUnit.test("a11y", function (assert) {
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
  assert.equal(q1.ariaRole, "group", "check role attribute");

  ComponentCollection.Instance.clear();
});
QUnit.test("Dynamic serializable properties, bug#8852", function (assert) {
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
  assert.equal(q1.contentQuestion.locMinRateDescription.text, "val1", "minRateDescription");
  assert.equal(q1.contentQuestion.maxRateDescription, "val2", "maxRateDescription");
  assert.equal(q1.contentQuestion.hasMinRateDescription, true, "hasMinRateDescription");
  assert.equal(q1.contentQuestion.hasMaxRateDescription, true, "hasMaxRateDescription");

  ComponentCollection.Instance.clear();
});
QUnit.test("Dynamic serializable properties, bug#8852", function (assert) {
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
  assert.notOk(survey.jsonErrors, "There is not errors");

  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: clearIfInvisible='onHidden'", function (assert) {
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
  assert.deepEqual(q1.value, { q1: "test1", q2: 2, q3: "abc" }, "test #1");
  q1.contentPanel.getQuestionByName("q2").value = 3;
  assert.deepEqual(q1.value, { q1: "test1", q2: 3 }, "test #1");

  ComponentCollection.Instance.clear();
});
QUnit.test("Composite: with dropdown & showOtherItem, Bug#9378", function (assert) {
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
  q2.comment = "abc";
  assert.deepEqual(q.value, { q1: "test1", q2: "other", "q2-Comment": "abc" }, "q.value #1");
  survey.data = {};
  assert.ok(q.isEmpty(), "q.value #2");
  survey.data = { question1: { q1: "test2", q2: "other", "q2-Comment": "def" } };
  assert.deepEqual(q.value, { q1: "test2", q2: "other", "q2-Comment": "def" }, "q.value #3");

  ComponentCollection.Instance.clear();
});

QUnit.test("Composite: checkErrorsMode: `onComplete` with several elements, Bug#9361", function (assert) {
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
  assert.equal(q1.parentQuestion?.name, "question1", "q1.parentQuestion");
  assert.equal(q1.page?.name, "page1", "q1.page");
  survey.nextPage();
  assert.equal(survey.currentPageNo, 1, "currentPageNo #1");
  survey.tryComplete();
  assert.equal(survey.currentPageNo, 0, "currentPageNo #2");

  ComponentCollection.Instance.clear();
});