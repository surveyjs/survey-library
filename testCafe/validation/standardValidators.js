import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, fixture, test } from "testcafe";
const title = "standardValidators";

const json = {
  questions: [
    {
      type: "text",
      name: "email",
      title: "Please enter your e-mail",
      isRequired: true,
      validators: [{ type: "email" }],
    },
    {
      type: "multipletext",
      name: "pricelimit",
      title: "What is the... ",
      isRequired: true,
      colCount: 2,
      items: [
        {
          name: "leastamount",
          title: "The least amount you have ever paid for a computer",
          validators: [{ type: "numeric", minValue: 10, maxValue: 10000 }],
        },
        {
          name: "mostamount",
          title: "The most amount you have ever paid for a computer",
          validators: [{ type: "numeric", minValue: 10, maxValue: 10000 }],
        },
      ],
    },
    {
      type: "comment",
      name: "firstcomputer",
      title: "Please tell us about your first computer",
      isRequired: true,
      validators: [{ type: "text", minLength: 20 }],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("check validation", async (t) => {
    const getError = Selector((text, index) => {
      var nodes = [];
      document.querySelectorAll("*").forEach(function (node) {
        if (node.innerHTML === text) nodes.push(node);
      });

      return nodes[index];
    });

    const getTextInputByIndex = Selector(
      (index) => document.querySelectorAll(".sv_q_text_root")[index]
    );
    const getTextarea = Selector(() => document.querySelector("textarea"));
    let surveyResult;

    await t
      .click("input[value=\"Complete\"]")
      .hover(getError("Response required.", 0))
      .hover(getError("Response required.", 1))
      .hover(getError("Response required.", 2));

    await t
      .typeText(await getTextInputByIndex(0), "wombat")
      .click("input[value=\"Complete\"]")
      .hover(getError("Please enter a valid e-mail address.", 0))
      .hover(getError("Response required.", 0))
      .hover(getError("Response required.", 1));

    await t
      .typeText(await getTextInputByIndex(0), "wombat@mail.mail", {
        replace: true,
      })
      .typeText(await getTextInputByIndex(1), "wombat")
      .click("input[value=\"Complete\"]")
      .hover(getError("The value should be numeric.", 0))
      .hover(getError("Response required.", 0));

    await t
      .typeText(await getTextInputByIndex(1), "0", { replace: true })
      .typeText(await getTextInputByIndex(2), "10000")
      .click("input[value=\"Complete\"]")
      .hover(
        getError(
          "The 'value' should be at least 10 and at most 10000",
          0
        )
      )
      .hover(getError("Response required.", 0));

    await t
      .typeText(await getTextInputByIndex(1), "10", { replace: true })
      .typeText(await getTextarea(), "0123456789")
      .click("input[value=\"Complete\"]")
      .hover(getError("Please enter at least 20 character(s).", 0));

    await t
      .typeText(await getTextarea(), "01234567890123456789", { replace: true })
      .click("input[value=\"Complete\"]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      email: "wombat@mail.mail",
      firstcomputer: "01234567890123456789",
      pricelimit: {
        leastamount: "10",
        mostamount: "10000",
      },
    });
  });
});
