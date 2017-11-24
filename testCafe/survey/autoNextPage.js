import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `autoNextPage`;

const json = {
  title: "American History",
  showProgressBar: "bottom",
  goNextPageAutomatic: true,
  showNavigationButtons: false,
  pages: [
    {
      questions: [
        {
          type: "radiogroup",
          name: "civilwar",
          title: "When was the Civil War?",
          choices: [
            "1750-1800",
            "1800-1850",
            "1850-1900",
            "1900-1950",
            "after 1950"
          ]
        }
      ]
    },
    {
      questions: [
        {
          type: "radiogroup",
          name: "libertyordeath",
          title: "Who said 'Give me liberty or give me death?'",
          choices: [
            "John Hancock",
            "James Madison",
            "Patrick Henry",
            "Samuel Adams"
          ]
        }
      ]
    },
    {
      questions: [
        {
          type: "radiogroup",
          name: "magnacarta",
          title: "What is the Magna Carta?",
          choices: [
            "The foundation of the British parliamentary system",
            "The Great Seal of the monarchs of England",
            "The French Declaration of the Rights of Man",
            "The charter signed by the Pilgrims on the Mayflower"
          ]
        }
      ]
    }
  ],
  completedHtml:
    "<p>Your anwers are:</p><p>When was the Civil War?: <b>{civilwar}</b>. The correct is: <b>1850-1900</b></p><p>Who said 'Give me liberty or give me death?': <b>{libertyordeath}</b>. The correct is: <b>Patrick Henry</b></p><p>What is the Magna Carta?: <b>{magnacarta}</b>. The correct is: <b>The foundation of the British parliamentary system</b></p>"
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`check auto next page`, async t => {
    const getProgressTextPosition = ClientFunction(index =>
      document.documentElement.innerHTML.indexOf("Page " + index + " of 3")
    );
    let surveyResult;

    assert.notEqual(await getProgressTextPosition(1), -1);

    await t.click(`input[type=radio]`);

    assert.notEqual(await getProgressTextPosition(2), -1);

    await t.click(`input[type=radio]`);

    assert.notEqual(await getProgressTextPosition(3), -1);

    await t.click(`input[type=radio]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, {
      civilwar: "1750-1800",
      libertyordeath: "John Hancock",
      magnacarta: "The foundation of the British parliamentary system"
    });
  });
});
