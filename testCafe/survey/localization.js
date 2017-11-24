import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `localization`;

const setRu = ClientFunction(() => {
  survey.locale = "ru";
  survey.render();
});

const setEn = ClientFunction(() => {
  survey.locale = "en";
  survey.render();
});

const setDe = ClientFunction(() => {
  survey.locale = "de";
  survey.render();
});

const setFi = ClientFunction(() => {
  survey.locale = "fi";
  survey.render();
});

const setFr = ClientFunction(() => {
  survey.locale = "fr";
  survey.render();
});

const json = {
  title: "Software developer survey.",
  pages: [
    {
      title: "What operating system do you use?",
      questions: [
        {
          type: "checkbox",
          name: "opSystem",
          title: "OS",
          hasOther: true,
          isRequired: true,
          choices: ["Windows", "Linux", "Macintosh OSX"]
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
          isRequired: true,
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

  test(`next`, async t => {
    await setRu();
    await t.hover(`input[value=Далее]`);

    await setEn();
    await t.hover(`input[value=Next]`);

    await setDe();
    await t.hover(`input[value=Weiter]`);

    await setFi();
    await t.hover(`input[value=Seuraava]`);

    await setFr();
    await t.hover(`input[value=Suivant]`);
  });
});
