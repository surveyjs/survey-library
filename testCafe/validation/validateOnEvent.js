import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "validateOnEvent";
const setupSurvey = ClientFunction(() => {
  function isNumber(n) {
    return n && !isNaN(parseFloat(n)) && isFinite(n);
  }
  window["survey"].onValidateQuestion.add(function(s, options) {
    if (options.name == "pricelimit") {
      var leastamount = options.value["leastamount"];
      var mostamount = options.value["mostamount"];
      if (!isNumber(leastamount)) {
        options.error = "The 'least amount' should be a numeric.";
      } else {
        if (!isNumber(mostamount)) {
          options.error = "The 'most amount' should be a numeric.";
        } else {
          if (leastamount > mostamount) {
            options.error = "The 'most amount' should be more 'less amount'.";
          }
        }
      }
    }
    if (options.name == "firstcomputer") {
      if (options.value.indexOf("computer") < 0) {
        options.error = "Please type the word 'computer'.";
      }
    }
  });
});

const json = {
  questions: [
    {
      type: "multipletext",
      name: "pricelimit",
      title: "What is the... ",
      isRequired: true,
      colCount: 2,
      items: [
        {
          name: "leastamount",
          title: "The least amount you have ever paid for a computer"
        },
        {
          name: "mostamount",
          title: "The most amount you have ever paid for a computer"
        }
      ]
    },
    {
      type: "comment",
      name: "firstcomputer",
      title: "Please tell us about your first computer",
      isRequired: true,
      validators: [{ type: "text", minLength: 20 }]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
      await setupSurvey();
    }
  );

  test("check validation", async t => {
    const getError = Selector((text, index) => {
      var nodes = [];
      document.querySelectorAll("*").forEach(function(node) {
        if (node.innerHTML === text) nodes.push(node);
      });

      return nodes[index];
    });
    const getTextInputByIndex = Selector(
      index => document.querySelectorAll("div input[type=text]")[index]
    );
    const getTextarea = Selector(() => document.querySelector("textarea"));
    let surveyResult;

    await t
      .typeText(await getTextInputByIndex(0), "wombat")
      .typeText(await getTextInputByIndex(1), "wombat")
      .typeText(await getTextarea(), "01234567890123456789")
      .click("input[value=\"Complete\"]")
      .hover(getError("The 'least amount' should be a numeric.", 0))
      .hover(getError("Please type the word 'computer'.", 0));

    await t
      .typeText(await getTextInputByIndex(0), "10", { replace: true })
      .click("input[value=\"Complete\"]")
      .hover(getError("The 'most amount' should be a numeric.", 0));

    await t
      .typeText(await getTextInputByIndex(1), "10000", { replace: true })
      .typeText(await getTextarea(), "0123456789computer0123456789")
      .click("input[value=\"Complete\"]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      pricelimit: {
        leastamount: "10",
        mostamount: "10000"
      },
      firstcomputer: "012345678901234567890123456789computer0123456789"
    });
  });
});
