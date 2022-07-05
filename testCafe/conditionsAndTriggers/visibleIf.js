import { frameworks, url, initSurvey, getSurveyResult, getListItemByText, completeButton } from "../helper";
import { Selector, fixture, test } from "testcafe";
const title = "visibleIf";

var json = {
  showQuestionNumbers: "off",
  questions: [
    {
      type: "radiogroup",
      name: "haveKids",
      title: "Do you have a kid(s)?",
      isRequired: true,
      choices: ["Yes", "No"],
      colCount: 0
    },
    {
      type: "dropdown",
      name: "kids",
      title: "How many kids do you have",
      visibleIf: "{haveKids}='Yes'",
      isRequired: true,
      choices: [1, 2, 3, 4, 5]
    },
    {
      type: "dropdown",
      name: "kid1Age",
      title: "The first kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 1",
      isRequired: true,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid2Age",
      title: "The second kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 2",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid3Age",
      title: "The third kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 3",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid4Age",
      title: "The fourth kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 4",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    },
    {
      type: "dropdown",
      name: "kid5Age",
      title: "The fifth kid age:",
      visibleIf: "{haveKids}='Yes' and {kids} >= 5",
      isRequired: true,
      startWithNewLine: false,
      choices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  const questionDropdownSelect = Selector(".sv_q_dropdown_control");

  test("check visibility", async t => {
    await t
      .expect(questionDropdownSelect.count).eql(0)
      .expect(questionDropdownSelect.filterVisible().count).eql(0)

      .click("input[type=radio]")
      .expect(questionDropdownSelect.count).eql(1)
      .expect(questionDropdownSelect.filterVisible().count).eql(1)

      .click(questionDropdownSelect)
      .click(getListItemByText("5"))
      .expect(questionDropdownSelect.count).eql(6)
      .expect(questionDropdownSelect.filterVisible().count).eql(6)

      .click(questionDropdownSelect)
      .click(getListItemByText("1"))
      .expect(questionDropdownSelect.count).eql(2)
      .expect(questionDropdownSelect.filterVisible().count).eql(2);

    await t
      .click(questionDropdownSelect.nth(1))
      .click(getListItemByText("2"))
      .click(completeButton);

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      haveKids: "Yes",
      kid1Age: 2,
      kids: 1
    });
  });
});
