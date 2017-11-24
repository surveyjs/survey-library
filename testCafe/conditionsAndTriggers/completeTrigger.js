import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `completeTrigger`;

const json = {
  triggers: [
    { type: "complete", name: "exit1", operator: "equal", value: "Yes" },
    { type: "complete", name: "exit2", operator: "equal", value: "Yes" }
  ],
  pages: [
    {
      title: "What operating system do you use?",
      questions: [
        {
          type: "checkbox",
          name: "opSystem",
          title: "OS",
          hasOther: true,
          choices: ["Windows", "Linux", "Macintosh OSX"]
        },
        {
          type: "radiogroup",
          name: "exit1",
          title: "Do you want to finish the survey?",
          choices: ["Yes", "No"],
          colCount: 0
        }
      ]
    },
    {
      title: "What language(s) are you currently using?",
      questions: [
        {
          type: "checkbox",
          name: "langs",
          title: "Plese select from the list",
          colCount: 4,
          choices: [
            "Javascript",
            "Java",
            "Python",
            "CSS",
            "PHP",
            "Ruby",
            "C++",
            "C",
            "Shell",
            "C#",
            "Objective-C",
            "R",
            "VimL",
            "Go",
            "Perl",
            "CoffeeScript",
            "TeX",
            "Swift",
            "Scala",
            "Emacs List",
            "Haskell",
            "Lua",
            "Clojure",
            "Matlab",
            "Arduino",
            "Makefile",
            "Groovy",
            "Puppet",
            "Rust",
            "PowerShell"
          ]
        },
        {
          type: "radiogroup",
          name: "exit2",
          title: "Do you want to finish the survey?",
          choices: ["Yes", "No"],
          colCount: 0
        }
      ]
    },
    {
      title: "Please enter your name and e-mail",
      questions: [
        { type: "text", name: "name", title: "Name:" },
        { type: "text", name: "email", title: "Your e-mail" }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`check visibility`, async t => {
    const getPosition = ClientFunction(index =>
      document.documentElement.innerHTML.indexOf(
        "4. Do you want to finish the survey?"
      )
    );
    let surveyResult;

    assert.equal(await getPosition(), -1);

    await t
      .click(`input[value="No"]`)
      .click(`input[value="Next"]`)
      .click(`input[value="Yes"]`)
      .click(`input[value="Next"]`);

    surveyResult = await getSurveyResult();
    assert.deepEqual(surveyResult, { exit1: "No", exit2: "Yes" });
  });
});
