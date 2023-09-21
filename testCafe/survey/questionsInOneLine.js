import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, fixture, test, Selector } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "questionsInOneLine and titles location";

const changeTitleLocation = ClientFunction((location) => {
  window["survey"].questionTitleLocation = location;
  window["survey"].render();
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
          title: "State / Province / Region",
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
            valueName: "name",
          },
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("check one line", async (t) => {
    const isOneLine = ClientFunction(
      () =>
        document.querySelector("div[data-name='city']").parentNode.style
          .flex === "1 1 50%" &&
        document.querySelector("div[data-name='state']").parentNode.style
          .flex === "1 1 50%"
    );
    const isCountRight = ClientFunction(
      () => document.querySelectorAll(".sv_q").length === 6
    );

    const cityElement = Selector(
      "div[style*=\"flex: 1 1 50%\"] div[data-name='city']"
    );
    const stateElement = Selector(
      "div[style*=\"flex: 1 1 50%\"] div[data-name='state']"
    );
    await t.expect(cityElement.exists).ok().expect(stateElement.exists).ok();
    // assert(await isOneLine());
    assert(await isCountRight());
  });

});
