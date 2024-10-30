import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, fixture, test } from "testcafe";
const title = "setValueTrigger";

const json = {
  triggers: [
    {
      type: "setvalue",
      name: "copy",
      operator: "equal",
      value: "Yes",
      setToName: "name",
      setValue: "Jon Snow",
    },
    {
      type: "setvalue",
      name: "copy",
      operator: "equal",
      value: "Yes",
      setToName: "email",
      setValue: "jon.snow@nightwatch.com",
    },
    {
      type: "setvalue",
      name: "copy",
      operator: "equal",
      value: "Yes",
      setToName: "tempvar",
      isVariable: true,
      setValue: "You have decided to use your current information.",
    },
    {
      type: "setvalue",
      name: "copy",
      operator: "equal",
      value: "No",
      setToName: "name",
      setValue: "",
    },
    {
      type: "setvalue",
      name: "copy",
      operator: "equal",
      value: "No",
      setToName: "email",
      setValue: "",
    },
    {
      type: "setvalue",
      name: "copy",
      operator: "equal",
      value: "No",
      setToName: "tempvar",
      isVariable: true,
      setValue: "You have decided not to use your current information.",
    },
  ],
  pages: [
    {
      title: "Customer information",
      questions: [
        {
          type: "radiogroup",
          name: "copy",
          title: "Use your current data",
          choices: ["Yes", "No"],
          isRequired: true,
          colCount: 0,
        },
        { type: "text", name: "name", title: "Name:", isRequired: true },
        {
          type: "text",
          name: "email",
          title: "Your e-mail",
          isRequired: true,
          validators: [{ type: "email" }],
        },
      ],
    },
  ],
  completedHtml:
    "<p><h4>Thank you for sharing this information with us.</h4></p><p>Your name is: <b>{name}</b></p><p>Your email is: <b>{email}</b></p><p>This information is not in the survey data result:<b> {tempvar}</b></p>",
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("check visibility", async (t) => {
    await t
      .click("input[value=\"Yes\"]")
      .click("input[value=\"Complete\"]")
      .expect(Selector(".sv_completed_page").textContent).contains("Jon Snow");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      copy: "Yes",
      name: "Jon Snow",
      email: "jon.snow@nightwatch.com",
    });
  });
});
