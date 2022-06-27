import { SurveyModel } from "../src/survey";

import { QuestionSelectBase } from "../src/question_baseselect";
import { settings } from "../src/settings";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { Serializer } from "../src/jsonobject";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { defaultV2Css } from "../src/defaultCss/defaultV2Css";
import { IAction } from "../src/actions/action";

export default QUnit.module("baseselect");

function getValuesInColumns(question: QuestionSelectBase) {
  return question.columns.map((column) => column.map((choice) => choice.value));
}

QUnit.test("Check QuestionSelectBase columns property", function (assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "Question 1",
        choices: ["Item1", "Item2", "Item3", "Item4", "Item5"],
        colCount: 3,
      },
    ],
  };
  var survey = new SurveyModel(json);

  var question = <QuestionSelectBase>survey.getAllQuestions()[0];
  var columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item4"], ["Item2", "Item5"], ["Item3"]],
    "check showItemsBy row"
  );
  settings.showItemsInOrder = "column";
  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check showItemsBy column"
  );
});
QUnit.test("Check QuestionSelectBase columns property and creator V2", function (assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "Question 1",
        colCount: 2,
      },
    ],
  };
  settings.supportCreatorV2 = true;
  var survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  const question = <QuestionSelectBase>survey.getAllQuestions()[0];
  let columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [[], []],
    "one column"
  );
  let headItems = question.headItems.map((item) => item.value);
  let footItems = question.footItems.map((item) => item.value);

  assert.deepEqual(
    headItems,
    ["selectall"],
    "check head items"
  );
  assert.deepEqual(
    footItems,
    ["newitem", "none", "other"],
    "check foot items"
  );
  settings.supportCreatorV2 = false;
});

QUnit.test("Check QuestionSelectBase head and foot items property", function (assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "Question 1",
        choices: ["Item1", "Item2", "Item3", "Item4", "Item5"],
        colCount: 3,
      },
    ],
  };
  var survey = new SurveyModel(json);

  var question = <QuestionSelectBase>survey.getAllQuestions()[0];
  assert.notOk(question.hasHeadItems);
  assert.notOk(question.hasFootItems);

  var columns = getValuesInColumns(question);
  columns = getValuesInColumns(question);
  settings.showItemsInOrder = "column";
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check showItemsBy col - runtime"
  );

  survey.setDesignMode(true);
  settings.supportCreatorV2 = true;
  (<any>question).updateVisibleChoices();
  assert.ok(question.hasHeadItems);
  assert.ok(question.hasFootItems);
  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check showItemsBy col - design"
  );
  let headItems = question.headItems.map((item) => item.value);
  let footItems = question.footItems.map((item) => item.value);

  assert.deepEqual(
    headItems,
    ["selectall"],
    "check head items"
  );
  assert.deepEqual(
    footItems,
    ["newitem", "none", "other"],
    "check foot items"
  );
  settings.showItemsInOrder = "row";
  settings.supportCreatorV2 = false;
});

QUnit.test("Check QuestionSelectBase and separateSpecialChoices option", function (assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "Question 1",
        choices: ["Item1", "Item2"],
        hasOther: true,
        hasSelectAll: true,
        hasNone: true,
        colCount: 2
      },
    ],
  };
  var survey = new SurveyModel(json);

  var question = <QuestionSelectBase>survey.getAllQuestions()[0];
  question.separateSpecialChoices = false;
  assert.notOk(question.hasHeadItems);
  assert.notOk(question.hasFootItems);

  var columns = getValuesInColumns(question);
  columns = getValuesInColumns(question);
  settings.showItemsInOrder = "column";
  assert.deepEqual(
    columns,
    [["selectall", "Item2", "other"], ["Item1", "none"]],
    "check columns with no separateSpecialChoices"
  );

  question.separateSpecialChoices = true;
  assert.ok(question.hasHeadItems);
  assert.ok(question.hasFootItems);

  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1"], ["Item2"]],
    "check columns with separateSpecialChoices"
  );
  let headItems = question.headItems.map((item) => item.value);
  let footItems = question.footItems.map((item) => item.value);

  assert.deepEqual(
    headItems,
    ["selectall"],
    "check head items"
  );
  assert.deepEqual(
    footItems,
    ["none", "other"],
    "check foot items"
  );
  settings.showItemsInOrder = "row";
  settings.supportCreatorV2 = false;
});

QUnit.test("Set ", function (assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "q1",
        choicesByUrl: {
          path: "path1",
          valueName: "val1",
        },
      },
      {
        type: "checkbox",
        name: "q2",
        choicesByUrl: {
          path: "path2",
          titleName: "title1",
        },
      },
    ],
  };
  var survey = new SurveyModel(json);
  var q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  var q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  q2.choicesByUrl = q1.choicesByUrl;
  assert.equal(q2.choicesByUrl.path, "path1", "path set correctly");
  assert.equal(q2.choicesByUrl.valueName, "val1", "valueName set correctly");
  assert.equal(q2.choicesByUrl.titleName, "", "titleName is cleard");
});
QUnit.test("check allowhover class in design mode", (assert) => {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["Item 1"],
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_checkbox_hover";
  const item = q1.visibleChoices[0];
  assert.ok(q1.getItemClass(item).indexOf("sv_q_checkbox_hover") != -1);
  survey.setDesignMode(true);
  assert.ok(q1.getItemClass(item).indexOf("sv_q_checkbox_hover") == -1);
});
QUnit.test("check item value type", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "dropdown",
        name: "q1",
        choices: ["Item 1"],
      },
      {
        type: "imagepicker",
        name: "q2",
        choices: ["Item 1"],
      },
      {
        type: "buttongroup",
        name: "q3",
        choices: ["Item 1"],
      },
    ],
  });
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  const q3 = <QuestionSelectBase>survey.getQuestionByName("q3");
  assert.equal(q1.choices[0].getType(), "itemvalue", "load dropdown");
  assert.equal(q1.choices[0].value, "Item 1", "load dropdown, value");
  assert.equal(q2.choices[0].getType(), "imageitemvalue", "load imagepicker");
  assert.equal(q2.choices[0].value, "Item 1", "load imagepicker value");
  assert.equal(q3.choices[0].getType(), "buttongroupitemvalue", "load buttongroup");
  assert.equal(q3.choices[0].value, "Item 1", "load buttongroup value");
  assert.equal(q1.createItemValue(1).getType(), "itemvalue", "create dropdown item");
  assert.equal(q1.createItemValue(1).value, 1, "create dropdown, value");
  assert.equal(q2.createItemValue(1).getType(), "imageitemvalue", "create imagepicker item");
  assert.equal(q2.createItemValue(1).value, 1, "create imagepicker, value");
  assert.equal(q3.createItemValue(1).getType(), "buttongroupitemvalue", "create buttongroup item");
  assert.equal(q3.createItemValue(1).value, 1, "create buttongroup, value");
});

QUnit.test("check item locstring owner and name", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["Item 1"],
      }]
  });

  var question = survey.getQuestionByName("q1") as any;
  assert.equal(question.locTitle.owner.getType(), "radiogroup", "Owner for radio question title is radiogroup");
  assert.equal(question.locTitle.name, "title", "Name for radio question title is title");
  var itemValue = (question.choices[0]);
  assert.equal(itemValue.locText.owner.getType(), "itemvalue", "Owner for radio question item text is itemvalue");
  assert.equal(itemValue.locText.name, "text", "Name for radio question item text is text");
});

QUnit.test("check onShowingChoiceItem event", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: [{ value: "Item1", visibleIf: "1 = 2" }, "Item2", "Item3"],
        hasNone: true,
        hasOther: true
      }]
  });

  const question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  assert.equal(question.visibleChoices.length, 4);
  assert.equal(question.visibleChoices[0].value, "Item2");
  assert.equal(question.visibleChoices[1].value, "Item3");
  assert.equal(question.visibleChoices[2].value, "none");
  assert.equal(question.visibleChoices[3].value, "other");

  survey.onShowingChoiceItem.add((sender, options) => {
    if (options.question.name !== "q1") return;
    options.visible = ["Item1", "Item2"].indexOf(options.item.value) > -1;
  });

  assert.equal(question.visibleChoices.length, 2);
  assert.equal(question.visibleChoices[0].value, "Item1");
  assert.equal(question.visibleChoices[1].value, "Item2");
});

QUnit.test("check focus comment of other select", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "checkbox",
        name: "q1",
        hasOther: true,
        choices: ["item1"]
      }
    ]
  });
  let counter = 0;
  const q = survey.getQuestionByName("q1");
  q["focusOtherComment"] = () => {
    counter ++;
  };
  assert.equal(counter, 0);
  q.value = ["other"];
  assert.equal(counter, 1);
  q.value = ["other", "item1"];
  assert.equal(counter, 1);
  q.value = ["item1"];
  assert.equal(counter, 1);
  q.value = ["item1", "other"];
  assert.equal(counter, 2);
});
QUnit.test("check separateSpecialChoices property visibility", (assert) => {
  assert.notOk(Serializer.findProperty("selectbase", "separateSpecialChoices").visible);
  assert.ok(Serializer.findProperty("checkbox", "separateSpecialChoices").visible);
  assert.ok(Serializer.findProperty("radiogroup", "separateSpecialChoices").visible);
  assert.notOk(Serializer.findProperty("imagepicker", "separateSpecialChoices").visible);
  assert.notOk(Serializer.findProperty("dropdown", "separateSpecialChoices").visible);
});
QUnit.test("check focus comment of other select", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["apple", "banana", "orange"],
      },
      {
        type: "radiogroup",
        name: "q2",
        choices: [
          "item1",
          {
            value: "item2",
            visibleIf: "{q1} = ['apple']",
          },
          "item3",
        ],
        hasOther: true,
      },
    ],
  });
  survey.data = {
    q2: "item2",
    q1: ["apple"],
  };
  const q = <QuestionRadiogroupModel>survey.getQuestionByName("q2");
  assert.notEqual(q.value, q.otherItem.value, "Other is not selected");
  assert.equal(q.value, "item2", "item2 is selected");
});
QUnit.test("checkbox and valuePropertyName", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["apple", "banana", "orange"],
      }
    ]
  });
  const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  q.valuePropertyName = "fruit";
  q.renderedValue = ["apple"];
  assert.deepEqual(q.value, [{ fruit: "apple" }], "#1");
  assert.deepEqual(q.renderedValue, ["apple"], "#2");
  assert.equal(q.isItemSelected(q.choices[0]), true, "#2.1");
  assert.equal(q.isItemSelected(q.choices[1]), false, "#2.2");
  assert.equal(q.isItemSelected(q.choices[2]), false, "#2.3");
  q.value = [{ fruit: "apple" }, { fruit: "orange" }];
  assert.deepEqual(q.renderedValue, ["apple", "orange"], "#3");
  assert.deepEqual(survey.data, { q1: [{ fruit: "apple" }, { fruit: "orange" }] }, "convert to data correctly, #4");
  assert.equal(q.isItemSelected(q.choices[0]), true, "#3.1");
  assert.equal(q.isItemSelected(q.choices[1]), false, "#3.2");
  assert.equal(q.isItemSelected(q.choices[2]), true, "#3.3");
  survey.doComplete();
  assert.deepEqual(survey.data, { q1: [{ fruit: "apple" }, { fruit: "orange" }] }, "survey.data is correct on complete, #5");
});
QUnit.test("checkbox valuePropertyName and shared data vs panel dynamic ", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        valueName: "data",
        valuePropertyName: "fruit",
        choices: ["apple", "banana", "orange"],
      },
      {
        type: "paneldynamic",
        name: "q2",
        panelCount: 0,
        valueName: "data",
        templateElements: [
          {
            type: "text",
            name: "name"
          }
        ]
      }
    ]
  });
  const q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  const q2 = <QuestionPanelDynamicModel>survey.getQuestionByName("q2");
  q1.renderedValue = ["apple", "orange"];
  assert.equal(q2.panelCount, 2, "#1, Panel count is changed");
  q2.panels[0].getQuestionByName("name").value = "text1";
  q2.panels[1].getQuestionByName("name").value = "text2";
  assert.deepEqual(survey.data, { data: [
    { fruit: "apple", name: "text1" },
    { fruit: "orange", name: "text2" }] }, "#2, combine results");
  q1.renderedValue = ["apple"];
  assert.deepEqual(survey.data, { data: [
    { fruit: "apple", name: "text1" }] }, "#3, keep results");
  q1.renderedValue = ["apple", "orange"];
  assert.deepEqual(survey.data, { data: [
    { fruit: "apple", name: "text1" },
    { fruit: "orange" }] }, "#4, add new value");
  q2.removePanel(0);
  assert.deepEqual(survey.data, { data: [
    { fruit: "orange" }] }, "#5, remove panel, data");
  assert.deepEqual(q1.renderedValue, ["orange"], "#6, remove panel, renderedValue");
});
QUnit.test("checkbox vs valuePropertyName, check selectAll and none", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["apple", "banana", "orange"],
        valuePropertyName: "fruit",
        hasNone: true,
        hasSelectAll: true
      }
    ]
  });
  const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  q.toggleSelectAll();
  assert.deepEqual(q.renderedValue, ["apple", "banana", "orange"], "#1");
  assert.deepEqual(q.value, [{ fruit: "apple" }, { fruit: "banana" }, { fruit: "orange" }], "#2");
  assert.equal(q.isAllSelected, true, "#3, all is selected");
  q.renderedValue = ["none"];
  assert.deepEqual(q.value, [{ fruit: "none" }], "#4");
  assert.equal(q.isAllSelected, false, "#5, all is not selected");
});
QUnit.test("checkbox vs valuePropertyName, check hasOther", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["apple", "banana", "orange"],
        valuePropertyName: "fruit",
        hasOther: true
      }
    ]
  });
  const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  q.renderedValue = ["other"];
  assert.deepEqual(q.value, [{ fruit: "other" }], "#1");
  q.comment = "text1";
  assert.deepEqual(survey.data, { q1: [{ fruit: "other" }], "q1-Comment": "text1" }, "2");
});
QUnit.test("checkbox vs valuePropertyName, check hasOther vs storeOthersAsComment", (assert) => {
  const survey = new SurveyModel({
    storeOthersAsComment: false,
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["apple", "banana", "orange"],
        valuePropertyName: "fruit",
        hasOther: true
      }
    ]
  });
  const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  q.renderedValue = ["other"];
  assert.deepEqual(q.value, [{ fruit: "other" }], "#1");
  q.comment = "text1";
  assert.deepEqual(q.value, [{ fruit: "text1" }], "#2");
  assert.deepEqual(survey.data, { q1: [{ fruit: "text1" }] }, "#3");
});

QUnit.test("check radiogroup title actions", (assert) => {
  let survey = new SurveyModel({
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["Item 1"],
        showClearButton: true
      }]
  });
  let question = <QuestionRadiogroupModel>survey.getAllQuestions()[0];
  assert.deepEqual(question.getTitleActions(), []);
  assert.ok(question.showClearButtonInContent);

  survey = new SurveyModel({
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["Item 1"],
        showClearButton: true
      }]
  });
  survey.css = defaultV2Css;
  question = <QuestionRadiogroupModel>survey.getAllQuestions()[0];
  const action = <IAction>question.getTitleActions()[0];
  assert.notOk(question.showClearButtonInContent);
  assert.equal(action.title, "Clear");
  assert.ok(action.visible);

  question.showClearButton = false;
  assert.notOk(action.visible);
});
