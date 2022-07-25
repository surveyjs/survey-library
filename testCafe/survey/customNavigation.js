import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "customNavigation";

const setCustomNavigation = ClientFunction(() => {
  document
    .querySelector("#surveyElement")
    .insertAdjacentHTML(
      "afterend",
      [
        '<div><span id="surveyProgress">Page 1 of 3.</span>',
        '<a id="surveyPrev" href="#" style="display: none;">Prev</a>',
        '<a id="surveyNext" href="#" style="display: inline;">Next</a>',
        '<a id="surveyComplete" href="#" style="display: none;">Complete</a>',
        "</div>"
      ]
        .join()
        .replace(new RegExp(",", "g"), "")
    );

  document.getElementById("surveyPrev").onclick = function(event) {
    window["survey"].prevPage();
    event.preventDefault();
  };
  document.getElementById("surveyNext").onclick = function() {
    window["survey"].nextPage();
    event.preventDefault();
  };
  document.getElementById("surveyComplete").onclick = function() {
    window["survey"].completeLastPage();
    event.preventDefault();
  };

  window["survey"].showTitle = false;

  window["survey"].onCurrentPageChanged.add(function(sender) {
    setNavigationVisibility(sender);
  });

  function setNavigationVisibility(survey) {
    document.getElementById("surveyPrev").style.display = !window["survey"].isFirstPage
      ? "inline"
      : "none";
    document.getElementById("surveyNext").style.display = !window["survey"].isLastPage
      ? "inline"
      : "none";
    document.getElementById("surveyComplete").style.display = window["survey"].isLastPage
      ? "inline"
      : "none";
    document.getElementById("surveyProgress").innerText =
      "Page " +
      (window["survey"].currentPage.visibleIndex + 1) +
      " of " +
      window["survey"].visiblePageCount +
      ".";
  }
});

const changePrevNextCompleteText = ClientFunction(() => {
  window["survey"].pagePrevText = "back";
  window["survey"].pageNextText = "forward";
  window["survey"].completeText = "done";
  window["survey"].render();
});

const hideStandardNav = ClientFunction(() => {
  window["survey"].showNavigationButtons = false;
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

  test("set custom navigation", async t => {
    const getPrevDsplay = ClientFunction(
      () => document.querySelector("#surveyPrev").style.display
    );
    const getNextDsplay = ClientFunction(
      () => document.querySelector("#surveyNext").style.display
    );
    const getCompleteDsplay = ClientFunction(
      () => document.querySelector("#surveyComplete").style.display
    );
    const getProgressBarDsplay = ClientFunction(
      () => document.querySelector("#surveyProgress").style.display
    );
    const getProgressText = ClientFunction(
      () => document.querySelector("#surveyProgress").innerHTML
    );
    let surveyResult;

    await setCustomNavigation();

    assert.equal(await getPrevDsplay(), "none");
    assert.notEqual(await getNextDsplay(), "none");
    assert.equal(await getCompleteDsplay(), "none");
    assert.notEqual(await getProgressBarDsplay(), "none");
    assert.equal(await getProgressText(), "Page 1 of 3.");

    await t.click("input[type=checkbox]").click("#surveyNext");

    assert.notEqual(await getPrevDsplay(), "none");
    assert.notEqual(await getNextDsplay(), "none");
    assert.equal(await getCompleteDsplay(), "none");
    assert.notEqual(await getProgressBarDsplay(), "none");
    assert.equal(await getProgressText(), "Page 2 of 3.");

    await t.click("input[type=checkbox]").click("#surveyNext");

    assert.notEqual(await getPrevDsplay(), "none");
    assert.equal(await getNextDsplay(), "none");
    assert.notEqual(await getCompleteDsplay(), "none");
    assert.notEqual(await getProgressBarDsplay(), "none");
    assert.equal(await getProgressText(), "Page 3 of 3.");

    await t.click("#surveyPrev");

    assert.notEqual(await getPrevDsplay(), "none");
    assert.notEqual(await getNextDsplay(), "none");
    assert.equal(await getCompleteDsplay(), "none");
    assert.notEqual(await getProgressBarDsplay(), "none");
    assert.equal(await getProgressText(), "Page 2 of 3.");

    await t.click("#surveyNext").click("#surveyComplete");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      opSystem: ["Windows"],
      langs: ["Javascript"]
    });
  });

  test("change prev next complete text", async t => {
    await changePrevNextCompleteText();
    await t
      .click("input[type=checkbox]")
      .click("input[value=\"forward\"]")
      .click("input[type=checkbox]")
      .click("input[value=\"forward\"]")
      .click("input[value=\"back\"]")
      .click("input[value=\"forward\"]")
      .click("input[value=\"done\"]");
  });

  test("hide standard nav", async t => {
    const getPrev = Selector(
      () => document.querySelector("input[value=Prev]"),
      { visibilityCheck: true, timeout: 1000 }
    );
    const getNext = Selector(
      () => document.querySelector("input[value=Next]"),
      { visibilityCheck: true, timeout: 1000 }
    );
    const getComplete = Selector(
      () => document.querySelector("input[value=Complete]"),
      { visibilityCheck: true, timeout: 1000 }
    );

    await t.click("input[type=checkbox]").click(getNext);

    await hideStandardNav();

    assert.equal(await getPrev(), null);
    assert.equal(await getNext(), null);

    await setCustomNavigation();
    await t.click("input[type=checkbox]").click("#surveyNext");

    assert.equal(await getComplete(), null);
  });
});
