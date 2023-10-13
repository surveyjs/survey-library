import { frameworks, url, initSurvey, getListItemByText, completeButton, getSurveyResult } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "component_single_question";
const questionDropdownSelect = Selector(".sv_q_dropdown_control");
const json_question = {
  elements: [
    {
      type: "newquestion",
      name: "q1"
    },
  ],
};
const json_matrix = {
  elements: [
    {
      type: "matrixdynamic",
      name: "matrix",
      columns: [{ name: "col1", cellType: "newquestion" }],
      rowCount: 1,
    },
  ],
};
const createComponent = ClientFunction(() => {
  window["Survey"].ComponentCollection.Instance.add({
    name: "newquestion",
    questionJSON: {
      type: "dropdown",
      choices: ["a", "b", "c"],
    },
    onAfterRender: (question, htmlElement) => {
      window["newquestion_afterrender"] = question.name;
    }
  });
});

const getAfterRenderResult = ClientFunction(() => {
  return window["newquestion_afterrender"];
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Component as a single question", async (t) => {
    await createComponent();
    await initSurvey(framework, json_question);
    await t
      .click(questionDropdownSelect)
      .click(getListItemByText("b"))
      .click(completeButton);
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.q1).eql("b");
  });
  test("Component as a cell question", async (t) => {
    await createComponent();
    await initSurvey(framework, json_matrix);
    await t
      .click(questionDropdownSelect)
      .click(getListItemByText("b"))
      .click(completeButton);
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.matrix[0].col1).eql("b");
  });
  test("Component as a cell question & afterRender", async (t) => {
    await createComponent();
    await initSurvey(framework, json_matrix);
    const res = await getAfterRenderResult();
    await t.expect(res).eql("col1");
  });
});