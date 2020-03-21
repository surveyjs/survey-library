import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `options`;

const change_question_required_text = ClientFunction(() => {
  survey.requiredText = "😱";
  survey.render();
});

const set_question_numbers_on_page = ClientFunction(() => {
  survey.showQuestionNumbers = "onPage";
  survey.render();
});

const set_question_numbers_off = ClientFunction(() => {
  survey.showQuestionNumbers = "off";
  survey.render();
});

const hide_survey_title = ClientFunction(() => {
  survey.showTitle = false;
  survey.render();
});

const hide_page_title = ClientFunction(() => {
  survey.showPageTitles = false;
  survey.render();
});

const show_page_numbers = ClientFunction(() => {
  survey.showPageNumbers = true;
  survey.render();
});

const show_top_progress_bar = ClientFunction(() => {
  survey.showProgressBar = "top";
  survey.render();
});

const show_bottom_progress_bar = ClientFunction(() => {
  survey.showProgressBar = "bottom";
  survey.render();
});

const set_completed_html = ClientFunction(() => {
  survey.completedHtml = "<h1>Wombat</h1>";
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

  test(`change question required text`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("😱")
    );

    await change_question_required_text();

    assert.notEqual(await getPosition(), -1);
  });

  test(`set question numbers on page`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf(">1.</span>")
    );

    await t.click(`input[type=checkbox]`).click(`input[value="Next"]`);

    await set_question_numbers_on_page();

    assert.notEqual(await getPosition(), -1);
  });

  test(`set question numbers off`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf(">1</span>")
    );

    await set_question_numbers_off();

    assert.equal(await getPosition(), -1);
  });

  test(`hide survey title`, async t => {
    const getTitle = Selector(() => document.querySelectorAll("h3"), {
      text: "Software developer survey.",
      visibilityCheck: true,
      timeout: 1000
    });

    await hide_survey_title();

    assert.equal(await getTitle(), null);
  });

  test(`hide page title`, async t => {
    const getTitle = Selector(() => document.querySelectorAll("h4"), {
      text: "What operating system do you use?",
      visibilityCheck: true,
      timeout: 1000
    });

    await hide_page_title();

    assert.equal(await getTitle(), null);
  });

  test(`show page numbers`, async t => {
    const getPositionPage1 = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf(
        "1. What operating system do you use?"
      )
    );
    const getPositionPage2 = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf(
        "2. What language(s) are you currently using?"
      )
    );

    await show_page_numbers();
    assert.notEqual(await getPositionPage1(), -1);

    await t.click(`input[type=checkbox]`).click(`input[value="Next"]`);
    assert.notEqual(await getPositionPage2(), -1);
  });

  test(`no progress bar`, async t => {
    const getProgressBar = Selector("span")
      .withText("Page 1 of 3")
      .with({ visibilityCheck: true, timeout: 1000 });
    assert.equal(await getProgressBar(), null);
  });

  test(`show top progress bar`, async t => {
    const getProgressBar = Selector(() => document.querySelectorAll("div"), {
      text: "Page 1 of 3",
      visibilityCheck: true
    });
    const isFirstSpanProgress = ClientFunction(
      () =>
        document
          .querySelector("[role=progressbar] + span")
          .innerHTML.indexOf("Page 1 of 3") !== -1
    );

    await show_top_progress_bar();

    assert.notEqual(await getProgressBar(), null);
    assert(await isFirstSpanProgress());
  });

  test(`show bottom progress bar`, async t => {
    const getProgressBar = Selector(() => document.querySelectorAll("div"), {
      text: "Page 1 of 3",
      visibilityCheck: true
    });
    const isLastSpanProgress = ClientFunction(() => {
      var spans = document.querySelectorAll("span");
      return spans[spans.length - 1].innerHTML.indexOf("Page 1 of 3") !== -1;
    });

    await show_bottom_progress_bar();

    assert.notEqual(await getProgressBar(), null);
    assert(await isLastSpanProgress());
  });

  test(`check progress bar page 2`, async t => {
    const getProgressBar = Selector(() => document.querySelectorAll("div"), {
      text: "Page 2 of 3",
      visibilityCheck: true
    });

    await show_top_progress_bar();
    await t.click(`input[type=checkbox]`).click(`input[value="Next"]`);

    assert.notEqual(await getProgressBar(), null);
  });

  test(`set completed html`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf("Wombat")
    );

    await set_completed_html();
    await t
      .click(`input[type=checkbox]`)
      .click(`input[value="Next"]`)
      .click(`input[type=checkbox]`)
      .click(`input[value="Next"]`)
      .click(`input[value="Complete"]`);

    assert.notEqual(await getPosition(), -1);
  });

  test(`check previous`, async t => {
    const getPosition = ClientFunction(() =>
      document.documentElement.innerHTML.indexOf(
        "What operating system do you use?"
      )
    );

    await t
      .click(`input[type=checkbox]`)
      .click(`input[value="Next"]`)
      .click(`input[type=checkbox]`)
      .click(`input[value="Next"]`)
      .click(`input[value="Previous"]`)
      .click(`input[value="Previous"]`);

    assert.notEqual(await getPosition(), -1);
  });
});
