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
QUnit.test("settings.noneItemValue", function (assert) {
  settings.noneItemValue = "n/a";
  const json = {
    questions: [
      { name: "q1", type: "dropdown", choices: [1, 2, 3], showNoneItem: true },
      { name: "q1", type: "checkbox", choices: [1, 2, 3], showNoneItem: true }
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSelectBase>survey.getAllQuestions()[0];
  q1.value = "n/a";
  assert.equal(q1.isNoneSelected, true, "dropdown none is selected");
  const q2 = <QuestionSelectBase>survey.getAllQuestions()[1];
  q2.value = ["n/a"];
  assert.equal(q2.isNoneSelected, true, "checkbox none is selected");
  settings.noneItemValue = "none";
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
    counter++;
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
  assert.deepEqual(survey.data, {
    data: [
      { fruit: "apple", name: "text1" },
      { fruit: "orange", name: "text2" }]
  }, "#2, combine results");
  q1.renderedValue = ["apple"];
  assert.deepEqual(survey.data, {
    data: [
      { fruit: "apple", name: "text1" }]
  }, "#3, keep results");
  q1.renderedValue = ["apple", "orange"];
  assert.deepEqual(survey.data, {
    data: [
      { fruit: "apple", name: "text1" },
      { fruit: "orange" }]
  }, "#4, add new value");
  q2.removePanel(0);
  assert.deepEqual(survey.data, {
    data: [
      { fruit: "orange" }]
  }, "#5, remove panel, data");
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
QUnit.test("checkbox vs valuePropertyName, getDisplayValue", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "checkbox",
        name: "q1",
        choices: [{ value: 1, text: "apple" }, { value: 2, text: "banana" }, { value: 3, text: "orange" }],
        valuePropertyName: "fruit"
      }
    ]
  });
  const q = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  q.value = [1, 3];
  assert.deepEqual(q.getDisplayValue(false, [{ fruit: 1 }, { fruit: 3 }]), "apple, orange", "display value for all values");
  //assert.deepEqual(q.getDisplayValue(false, [{ fruite: 1 }]), ["apple", "orange"], "display value for all values");
  //assert.deepEqual(q.getDisplayValue(false), ["apple", "orange"], "display value for all values");
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

QUnit.test("checkbox and radio css", (assert) => {
  let survey = new SurveyModel({
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["Item 1"],
        hasNone: true
      },
      {
        type: "checkbox",
        name: "q2",
        choices: ["Item 1"],
        showClearButton: true,
        hasSelectAll: true,
        hasNone: true
      }]
  });
  let question1 = <QuestionRadiogroupModel>survey.getAllQuestions()[0];
  let question2 = <QuestionCheckboxModel>survey.getAllQuestions()[1];
  survey.css = {
    radiogroup: {
      root: "css-root",
      rootRow: "css-root-row"
    },
    checkbox: {
      root: "css-root",
      rootRow: "css-root-row"
    }
  };

  assert.equal(question1.getSelectBaseRootCss(), "css-root");
  assert.equal(question2.getSelectBaseRootCss(), "css-root");

  assert.deepEqual(question1.dataChoices.map((item) => item.value), ["Item 1"]);
  assert.deepEqual(question2.dataChoices.map((item) => item.value), ["Item 1"]);

  assert.deepEqual(question1.bodyItems.map((item) => item.value), ["Item 1", "none"]);
  assert.deepEqual(question2.bodyItems.map((item) => item.value), ["selectall", "Item 1", "none"]);

  assert.deepEqual(question1.rowLayout, false);
  assert.deepEqual(question2.rowLayout, false);

  question1.colCount = 0;
  question2.colCount = 0;

  assert.equal(question1.getSelectBaseRootCss(), "css-root css-root-row");
  assert.equal(question2.getSelectBaseRootCss(), "css-root css-root-row");

  assert.deepEqual(question1.dataChoices.map((item) => item.value), ["Item 1"]);
  assert.deepEqual(question2.dataChoices.map((item) => item.value), ["Item 1"]);

  assert.deepEqual(question1.bodyItems.map((item) => item.value), ["Item 1", "none"]);
  assert.deepEqual(question2.bodyItems.map((item) => item.value), ["selectall", "Item 1", "none"]);

  assert.deepEqual(question1.rowLayout, true);
  assert.deepEqual(question2.rowLayout, true);

  assert.deepEqual(question1.blockedRow, false);
  assert.deepEqual(question2.blockedRow, false);

  question1.separateSpecialChoices = true;
  question2.separateSpecialChoices = true;

  assert.equal(question1.getSelectBaseRootCss(), "css-root");
  assert.equal(question2.getSelectBaseRootCss(), "css-root");

  assert.deepEqual(question1.dataChoices.map((item) => item.value), ["Item 1"]);
  assert.deepEqual(question2.dataChoices.map((item) => item.value), ["Item 1"]);

  assert.deepEqual(question1.bodyItems.map((item) => item.value), ["Item 1"]);
  assert.deepEqual(question2.bodyItems.map((item) => item.value), ["Item 1"]);

  assert.deepEqual(question1.rowLayout, false);
  assert.deepEqual(question2.rowLayout, false);

  assert.deepEqual(question1.blockedRow, true);
  assert.deepEqual(question2.blockedRow, true);

  question1.separateSpecialChoices = false;
  question2.separateSpecialChoices = false;

  survey["_isDesignMode"] = true;

  assert.equal(question1.getSelectBaseRootCss(), "css-root");
  assert.equal(question2.getSelectBaseRootCss(), "css-root");

  assert.deepEqual(question1.dataChoices.map((item) => item.value), ["Item 1"]);
  assert.deepEqual(question2.dataChoices.map((item) => item.value), ["Item 1"]);

  assert.deepEqual(question1.bodyItems.map((item) => item.value), ["Item 1"]);
  assert.deepEqual(question2.bodyItems.map((item) => item.value), ["Item 1"]);

  assert.deepEqual(question1.rowLayout, false);
  assert.deepEqual(question2.rowLayout, false);

  assert.deepEqual(question1.blockedRow, true);
  assert.deepEqual(question2.blockedRow, true);
});
QUnit.test("autoOtherMode property, radiogroup", (assert) => {
  const question = new QuestionRadiogroupModel("q1");
  question.hasOther = true;
  question.choices = [1, 2, 3];
  question.autoOtherMode = true;
  assert.equal(question.isOtherSelected, false, "other is not selected by default");
  question.comment = "comment";
  assert.equal(question.isOtherSelected, true, "other is selected by setting comments");
  question.comment = "";
  assert.equal(question.isOtherSelected, false, "other is not selected by resetting comment");
  question.value = 1;
  question.comment = "comment";
  assert.equal(question.value, "other", "other is selected by setting comments, value");
  question.comment = "";
  assert.equal(question.value, undefined, "other is not selected by resetting comment, value");
  question.comment = "comment";
  question.value = 1;
  assert.equal(question.comment, "", "Clear comment on changing value");
  question.storeOthersAsComment = false;
  question.comment = "comment1";
  assert.equal(question.value, "comment1", "other is selected by setting comments, value + storeOthersAsComment");
  question.comment = "";
  assert.equal(question.value, undefined, "other is not selected by resetting comment, value + storeOthersAsComment");
});
QUnit.test("autoOtherMode property, checkbox", (assert) => {
  const survey = new SurveyModel();
  survey.addNewPage("p1");
  const question = new QuestionCheckboxModel("q1");
  survey.pages[0].addQuestion(question);
  question.hasOther = true;
  question.choices = [1, 2, 3];
  question.autoOtherMode = true;
  assert.equal(question.isOtherSelected, false, "other is not selected by default");
  question.comment = "comment";
  assert.equal(question.isOtherSelected, true, "other is selected by setting comments");
  question.comment = "";
  assert.equal(question.isOtherSelected, false, "other is not selected by resetting comment");
  question.value = [1, 3];
  question.comment = "comment";
  assert.deepEqual(question.value, [1, 3, "other"], "other is selected by setting comments, value");
  assert.deepEqual(survey.data, { q1: [1, 3, "other"], "q1-Comment": "comment" }, "survey: other is selected by setting comments, value");
  question.comment = "";
  assert.deepEqual(question.value, [1, 3], "other is not selected by resetting comment, value");
  assert.deepEqual(survey.data, { q1: [1, 3] }, "survey: other is not selected by resetting comment, value");
  question.storeOthersAsComment = false;
  question.comment = "comment1";
  assert.deepEqual(question.value, [1, 3, "comment1"], "other is selected by setting comments, value + storeOthersAsComment");
  assert.deepEqual(survey.data, { q1: [1, 3, "comment1"] }, "survey: other is selected by setting comments, value + storeOthersAsComment");
  question.comment = "";
  assert.deepEqual(question.value, [1, 3], "other is not selected by resetting comment, value + storeOthersAsComment");
  assert.deepEqual(survey.data, { q1: [1, 3] }, "survey: other is not selected by resetting comment, value + storeOthersAsComment");
});
QUnit.test("check locOwner for items", (assert) => {
  const question = new QuestionCheckboxModel("q1");
  question.choices = [1, 2, 3];
  question.autoOtherMode = true;
  assert.equal(question.noneItem.locText.owner, question.noneItem, "none text owner is none item");
  assert.equal(question.otherItem.locText.owner, question.otherItem, "other text owner is other item");
  assert.equal(question.selectAllItem.locText.owner, question.selectAllItem, "selectAll text owner is selectAll item");

  assert.equal(question.choices[0].locText.owner, question.choices[0], "item1 text owner is item1");
});

QUnit.test("check renamed has... properties", (assert) => {
  const question = new QuestionCheckboxModel("q1");
  assert.notOk(question.hasNone);
  assert.notOk(question.hasSelectAll);
  assert.notOk(question.hasOther);
  assert.notOk(question.hasComment);

  assert.notOk(question.showNoneItem);
  assert.notOk(question.showSelectAllItem);
  assert.notOk(question.showOtherItem);
  assert.notOk(question.showCommentArea);

  question.showNoneItem = true;
  assert.ok(question.showNoneItem);
  assert.ok(question.hasNone);
  question.hasNone = false;
  assert.notOk(question.showNoneItem);
  assert.notOk(question.hasNone);

  question.showSelectAllItem = true;
  assert.ok(question.showSelectAllItem);
  assert.ok(question.hasSelectAll);
  question.hasSelectAll = false;
  assert.notOk(question.showSelectAllItem);
  assert.notOk(question.hasSelectAll);

  question.showOtherItem = true;
  assert.ok(question.showOtherItem);
  assert.ok(question.hasOther);
  question.hasOther = false;
  assert.notOk(question.showOtherItem);
  assert.notOk(question.hasOther);

  question.showCommentArea = true;
  assert.ok(question.showCommentArea);
  assert.ok(question.hasComment);
  question.hasComment = false;
  assert.notOk(question.showCommentArea);
  assert.notOk(question.hasComment);
});
QUnit.test("selectbase and otherValue/comment", (assert) => {
  const survey = new SurveyModel({ elements: [{ type: "dropdown", name: "q1", showOtherItem: true, choices: [1, 2, 3] }] });
  const question = <QuestionSelectBase>survey.getQuestionByName("q1");
  assert.notOk(question.otherValue, "otherValue, #1");
  assert.notOk(question.comment, "comment, #2");
  question.otherValue = "val1";
  assert.equal("val1", question.otherValue, "other value, #3");
  assert.equal("val1", question.comment, "comment, #4");
  question.comment = "val2";
  assert.equal("val2", question.otherValue, "other value, #5");
  assert.equal("val2", question.comment, "comment, #6");
  question.showCommentArea = true;
  assert.equal(true, question.showCommentArea, "showCommentArea is true");
  assert.equal(true, question.showOtherItem, "showOtherItem is true");
  assert.equal(false, question.getStoreOthersAsComment(), "getStoreOthersAsComment() is false");
  assert.notOk(question.otherValue, "other value, #7");
  assert.equal("val2", question.comment, "comment, #8");
  question.value = "other";
  question.otherValue = "val3";
  assert.equal("val3", question.otherValue, "other value, #9");
  assert.equal("val3", question.value, "question value, #10");
  assert.equal("val2", question.comment, "comment, #11");
  question.comment = "val4";
  assert.equal("val3", question.otherValue, "other value, #12");
  assert.equal("val3", question.value, "question value, #13");
  assert.equal("val4", question.comment, "comment, #14");

  question.otherValue = "";
  question.value = "other";
  assert.equal(true, question.isOtherSelected, "isOtherSelected, #1");
  assert.notOk(question.otherValue, "other value, #15");
  assert.equal(false, question.supportGoNextPageError(), "supportGoNextPageError, #1");
  question.comment = "";
  assert.equal(false, question.supportGoNextPageError(), "supportGoNextPageError, #2");
  question.otherValue = "val5";
  assert.equal(true, question.supportGoNextPageError(), "supportGoNextPageError, #3");

  question.comment = "test";
  survey.data = { q1: "val6" };
  assert.equal("val6", question.otherValue, "other value, #16");
  assert.equal("val6", question.value, "question value, #17");
  assert.equal("", question.comment, "comment, #18");
  assert.deepEqual(survey.data, { q1: "val6" }, "survey data, #1");

  question.showCommentArea = false;
  question.storeOthersAsComment = false;
  survey.data = { q1: "val7" };
  assert.equal("val7", question.otherValue, "other value, #19");
  assert.equal("val7", question.value, "question value, #20");
  assert.equal("val7", question.comment, "comment, #21");
  assert.deepEqual(survey.data, { q1: "val7" }, "survey data, #2");

  question.showCommentArea = true;
  question.value = "other";
  question.otherValue = " ";
  assert.equal(" ", question.otherValue, "other value, #22");
  assert.equal("other", question.value, "question value, #23");
  assert.equal("", question.comment, "comment, #24");
});
QUnit.test("selectbase and otherValue/comment + same values", (assert) => {
  const survey = new SurveyModel({ elements: [
    { type: "dropdown", name: "q1", showOtherItem: true, showCommentArea: true, choices: ["item1", "item2", "item3"] },
    { type: "checkbox", name: "q2", showOtherItem: true, showCommentArea: true, choices: ["item1", "item2", "item3"] }
  ] });
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  q1.renderedValue = "other";
  q1.otherValue = " ";
  assert.equal("other", q1.value, "q1 value, #1");
  assert.equal(" ", q1.otherValue, "q1 otherValue, #2");
  q1.otherValue = "item2";
  assert.equal("other", q1.value, "q1 value, #3");
  assert.equal("item2", q1.otherValue, "q1 otherValue, #4");
  q1.otherValue = "item22";
  assert.equal("item22", q1.value, "q1 value, #5");
  assert.equal("item22", q1.otherValue, "q1 otherValue, #6");
  q2.renderedValue = ["other"];
  q2.otherValue = " ";
  assert.deepEqual(["other"], q2.value, "q2 value, #1");
  assert.equal(" ", q2.otherValue, "q2 otherValue, #2");
  q2.otherValue = "item3";
  assert.deepEqual(["other"], q2.value, "q2 value, #3");
  assert.equal("item3", q2.otherValue, "q2 otherValue, #4");
  q2.otherValue = "item33";
  assert.deepEqual(["item33"], q2.value, "q2 value, #5");
  assert.equal("item33", q2.otherValue, "q2 otherValue, #6");
});
QUnit.test("selectbase, otherValue&question-Comment", (assert) => {
  const survey = new SurveyModel({ elements: [
    { type: "dropdown", name: "q1", showOtherItem: true, choices: ["item1", "item2", "item3"] },
    { type: "checkbox", name: "q2", showOtherItem: true, choices: ["item1", "item2", "item3"] }
  ] });
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  q1.renderedValue = "other";
  q1.otherValue = "val1";
  q2.renderedValue = ["other"];
  q2.otherValue = "val2";
  const data = { q1: "other", "q1-Comment": "val1", q2: ["other"], "q2-Comment": "val2" };
  assert.deepEqual(survey.data, data, "before complete");
  survey.doComplete();
  assert.deepEqual(survey.data, data, "after complete");
});
QUnit.test("quesstion commentId/otherId", (assert) => {
  const q1 = new QuestionCheckboxModel("q1");
  assert.equal(q1.commentId, q1.id + "_comment", "Comment id");
  assert.equal(q1.otherId, q1.id + "_other", "Other id");
});