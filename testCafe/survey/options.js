import { frameworks, url, initSurvey } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "options";

const change_question_required_text = ClientFunction(() => {
  window["survey"].requiredText = "😱";
  window["survey"].render();
});

const set_question_numbers_on_page = ClientFunction(() => {
  window["survey"].showQuestionNumbers = "onPage";
  window["survey"].render();
});

const set_question_numbers_off = ClientFunction(() => {
  window["survey"].showQuestionNumbers = "off";
  window["survey"].render();
});

const hide_survey_title = ClientFunction(() => {
  window["survey"].showTitle = false;
  window["survey"].render();
});

const hide_page_title = ClientFunction(() => {
  window["survey"].showPageTitles = false;
  window["survey"].render();
});

const show_page_numbers = ClientFunction(() => {
  window["survey"].showPageNumbers = true;
  window["survey"].render();
});

const show_top_progress_bar = ClientFunction(() => {
  window["survey"].showProgressBar = "top";
  window["survey"].render();
});

const show_bottom_progress_bar = ClientFunction(() => {
  window["survey"].showProgressBar = "bottom";
  window["survey"].render();
});

const set_completed_html = ClientFunction(() => {
  window["survey"].completedHtml = "<h1>Wombat</h1>";
  window["survey"].render();
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

  test("change question required text", async t => {
    const requiredElement = Selector(".sv_q_required_text");

    await t.expect(requiredElement.textContent).eql("*");
    await change_question_required_text();
    await t.expect(requiredElement.textContent).eql("😱");
  });

  test("set question numbers on page", async t => {
    const questionNumber = Selector(".sv_q_num");

    await t
      .click("input[type=checkbox]")
      .click("input[value=\"Next\"]")
      .expect(questionNumber.textContent).eql("2.");

    await set_question_numbers_on_page();
    await t.expect(questionNumber.textContent).eql("1.");
  });

  test("set question numbers off", async t => {
    const questionNumber = Selector(".sv_q_num");
    await t.expect(questionNumber.textContent).eql("1.");

    await set_question_numbers_off();
    await t.expect(questionNumber.exists).notOk();
  });

  test("hide survey title", async t => {
    const surveyTitle = Selector("h3").withText("Software developer survey.");
    await t.expect(surveyTitle.visible).ok();
    await hide_survey_title();
    await t.expect(surveyTitle.exists).notOk();
  });

  test("hide page title", async t => {
    const pageTitle = Selector("h4").withText("What operating system do you use?");
    await t.expect(pageTitle.visible).ok();
    await hide_page_title();
    await t.expect(pageTitle.exists).notOk();
  });

  test("show page numbers", async t => {
    const pageTitle = Selector(".sv_page_title .sv-string-viewer");

    await t.expect(pageTitle.textContent).eql("What operating system do you use?");
    await show_page_numbers();
    await t
      .expect(pageTitle.textContent).eql("1. What operating system do you use?")

      .click("input[type=checkbox]")
      .click("input[value=\"Next\"]")
      .expect(pageTitle.textContent).eql("2. What language(s) are you currently using?");
  });

  const progressbar = Selector(".sv_progress").filterVisible();

  test("no progress bar", async t => {
    await t.expect(progressbar.exists).notOk();
  });

  test("show top progress bar", async t => {
    let progressSelector = ".sv_container .sv-components-column--expandable > .sv-components-column > div";
    // if(framework === "vue3") {
    //   progressSelector = ".sv_container .sv-components-column--expandable > div";
    // }
    const progressElement = Selector(progressSelector);
    await t.expect(progressbar.exists).notOk();

    await show_top_progress_bar();
    await t
      .expect(progressbar.visible).ok()
      .expect(progressbar.textContent).contains("Page 1 of 3")
      .expect(progressElement.classNames).contains("sv_progress");
  });

  test("show bottom progress bar", async t => {
    const progressRootElement = Selector(".sv_main > div > form > .sv_container .sv-components-row ~ div");
    await t.expect(progressbar.exists).notOk();

    await show_bottom_progress_bar();
    await t
      .expect(progressbar.visible).ok()
      .expect(progressbar.textContent).contains("Page 1 of 3");
    if(framework === "vue") {
      await t.expect(progressRootElement.find(".sv_progress").visible).ok();
    } else {
      await t.expect(progressRootElement.classNames).contains("sv_progress");
    }
  });

  test("check progress bar page 2", async t => {
    await t.expect(progressbar.exists).notOk();
    await show_top_progress_bar();
    await t
      .expect(progressbar.visible).ok()
      .expect(progressbar.textContent).contains("Page 1 of 3")
      .click("input[type=checkbox]")
      .click("input[value=\"Next\"]")
      .expect(progressbar.textContent).contains("Page 2 of 3");
  });

  test("set completed html", async t => {
    await set_completed_html();
    await t
      .click("input[type=checkbox]")
      .click("input[value=\"Next\"]")
      .click("input[type=checkbox]")
      .click("input[value=\"Next\"]")
      .click("input[value=\"Complete\"]")
      .expect(Selector(".sv_completed_page h1").withText("Wombat").visible).ok();
  });

  test("check previous", async t => {
    const pageTitle = Selector(".sv_page_title .sv-string-viewer");

    await t
      .click("input[type=checkbox]")
      .click("input[value=\"Next\"]")
      .click("input[type=checkbox]")
      .click("input[value=\"Next\"]")
      .click("input[value=\"Previous\"]")
      .click("input[value=\"Previous\"]");

    await t.expect(pageTitle.textContent).eql("What operating system do you use?");
  });
});
