import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import {
  QuestionCustomModel,
  QuestionCompositeModel,
  CustomQuestionCollection,
  CustomQuestionJSON,
} from "../src/question_custom";
import { Serializer } from "../src/jsonobject";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionTextModel } from "../src/question_text";

export default QUnit.module("custom questions");

QUnit.test("Single: Register and load from json", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  assert.equal(survey.getAllQuestions().length, 1, "Question is created");
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.getType(), "newquestion", "type is correct");
  assert.equal(q.name, "q1", "name is correct");
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
        { name: "page1", elements: [{ type: "newquestion", name: "q1" }] },
      ],
    },
    "Seralized correctly"
  );
  CustomQuestionCollection.Instance.clear();
});

QUnit.test("Composite: Register and load from json", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
});

QUnit.test("Single: Create the wrapper question and sync the value", function (
  assert
) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
});

QUnit.test("Composite: sync values", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
});
QUnit.test("Single: disableDesignActions property", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
});
QUnit.test("Composite: disableDesignActions property", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
});
QUnit.test("Single: read-only", function (assert) {
  var json = {
    name: "newquestion",
    questionJSON: { type: "dropdown", choices: [1, 2, 3, 4, 5] },
  };
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
});
QUnit.test("Composite: read only", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName" },
      { type: "text", name: "lastName" },
    ],
  };
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
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
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "newquestion", name: "q1" }],
  });
  var q = <QuestionCustomModel>survey.getAllQuestions()[0];
  assert.equal(q.hasErrors(), true, "contentQuestion is required");
  assert.equal(q.errors.length, 1, "There is one error");
  q.contentQuestion.value = 1;
  assert.equal(q.hasErrors(), false, "contentQuestion has value");
  CustomQuestionCollection.Instance.clear();
});
QUnit.test("Composite: hasErrors", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName", isRequired: true },
      { type: "text", name: "lastName" },
    ],
  };
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  assert.equal(q.hasErrors(), true, "firstName is required");
  firstName.value = "abc";
  assert.equal(q.hasErrors(), false, "firstName has value");
  CustomQuestionCollection.Instance.clear();
});

QUnit.test("Composite: onPropertyChanged", function (assert) {
  var json = {
    name: "customerinfo",
    elementsJSON: [
      { type: "text", name: "firstName", isRequired: true },
      { type: "text", name: "lastName" },
    ],
    onInit() {
      Serializer.addProperty("customerinfo", {
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
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
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
  CustomQuestionCollection.Instance.add(json);
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
  CustomQuestionCollection.Instance.clear();
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
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var firstName = q.contentPanel.getQuestionByName("firstName");
  var lastName = q.contentPanel.getQuestionByName("lastName");
  assert.equal(firstName.getType(), "text", "first name is creted");
  assert.equal(lastName.getType(), "text", "last name is creted");
  assert.equal(firstName.isRequired, true, "first name is required");
  CustomQuestionCollection.Instance.clear();
});
QUnit.test("Composite: onPropertyChanged", function (assert) {
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
  CustomQuestionCollection.Instance.add(json);
  var survey = new SurveyModel({
    elements: [{ type: "customerinfo", name: "q1" }],
  });
  var q = <QuestionCompositeModel>survey.getAllQuestions()[0];
  var lastName = q.contentPanel.getQuestionByName("lastName");
  assert.equal(
    lastName.startWithNewLine,
    false,
    "onCreated function is called"
  );
  CustomQuestionCollection.Instance.clear();
});
