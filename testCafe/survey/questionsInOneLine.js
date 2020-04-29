import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `questionsInOneLine and titles location`;

const changeTitleLocation = ClientFunction(location => {
  survey.questionTitleLocation = location;
  survey.render();
});

const json = {
  questionTitleLocation: "bottom",
  showQuestionNumbers: "off",
  pages: [
    {
      name: "Address",
      title: "Address",
      questions: [
        { type: "text", name: "address1", title: "Stree Address" },
        { type: "text", name: "address2", title: "Address Line 2" },
        { type: "text", name: "city", title: "City" },
        {
          type: "text",
          name: "state",
          startWithNewLine: false,
          title: "State / Province / Region"
        },
        { type: "text", name: "zip", title: "Zip / Postal Code" },
        {
          type: "dropdown",
          name: "country",
          startWithNewLine: false,
          title: "Country",
          choicesByUrl: {
            url: "http://services.groupkt.com/country/get/all",
            path: "RestResponse;result",
            valueName: "name"
          }
        }
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

  test(`check one line`, async t => {
    const isOneLine = ClientFunction(
      () =>
        document.querySelectorAll("div > h5:last-of-type")[2].parentNode
          .parentNode.style.flex === "1 1 50%" &&
        document.querySelectorAll("div > h5:last-of-type")[3].parentNode
          .parentNode.style.flex === "1 1 50%"
    );
    const isCountRight = ClientFunction(
      () => document.querySelectorAll("div > h5:last-of-type").length === 6
    );

    assert(await isOneLine());
    assert(await isCountRight());
  });

  test(`change title location`, async t => {
    const isInputAboveHeader = ClientFunction(() => {
      var h5 = document.querySelectorAll("h5:last-of-type")[2],
        input = h5.parentNode.parentNode.querySelector("input");
      return h5.getBoundingClientRect().top > input.getBoundingClientRect().top;
    });

    const isHeaderAboveInput = ClientFunction(() => {
      var h5 = document.querySelectorAll("h5:first-of-type")[2],
        input = h5.parentNode.parentNode.querySelector("input");
      return h5.getBoundingClientRect().top < input.getBoundingClientRect().top;
    });

    assert(await isInputAboveHeader());

    await changeTitleLocation("top");

    assert(await isHeaderAboveInput());
  });

  test(`change title location left`, async t => {
    const isInputAboveHeader = ClientFunction(() => {
      var h5 = document.querySelectorAll("h5:first-of-type")[2],
        input = h5.parentNode.parentNode.querySelector("input");
      return (
        h5.getBoundingClientRect().left === input.getBoundingClientRect().left
      );
    });

    const isHeaderToTheLeftOfInput = ClientFunction(() => {
      var h5 = document.querySelectorAll("h5:last-of-type")[2],
        input = h5.parentNode.parentNode.querySelector("input");
      return (
        h5.getBoundingClientRect().left < input.getBoundingClientRect().left
      );
    });

    assert(await isInputAboveHeader());

    await changeTitleLocation("left");

    assert(await isHeaderToTheLeftOfInput());
  });
});
