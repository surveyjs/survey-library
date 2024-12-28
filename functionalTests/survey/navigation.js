import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, fixture, Selector, test } from "testcafe";
const title = "navigation";

const json = {
  pages: [
    {
      elements: [
        {
          name: "question4a",
          type: "text",
          title: "Question",
        },
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("check disable/enable navigation item", async (t) => {
    const btnSelector = Selector("#sv-nav-complete input");
    await t.expect(btnSelector.hasAttribute("disabled")).notOk();
    await ClientFunction(() => { window.survey.navigationBarValue.actions[4].enabled = false; })();
    await t.expect(btnSelector.hasAttribute("disabled")).ok();
    await ClientFunction(() => { window.survey.navigationBarValue.actions[4].enabled = true; })();
    await t.expect(btnSelector.hasAttribute("disabled")).notOk();
  });
});

const tocJson = {
  title: "Survey New Design Test",
  showTOC: true,
  pages: [
    {
      elements: [{
        name: "name",
        type: "text"
      },
      ]
    },
    {
      elements: [
        {
          name: "birthdate",
          type: "text",
          inputType: "date"
        },
      ]
    }
  ]
};

const scrollJson = {
  "title": "Survey Title",
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "comment",
          "name": "question1"
        },
        {
          "type": "comment",
          "name": "question2"
        },
        {
          "type": "comment",
          "name": "question3"
        },
        {
          "type": "comment",
          "name": "question4"
        },
        {
          "type": "comment",
          "name": "question5"
        },
        {
          "type": "comment",
          "name": "question6"
        },
        {
          "type": "comment",
          "name": "question7"
        }
      ]
    },
    {
      "name": "page2",
      "elements": [
        {
          "type": "comment",
          "name": "question8"
        },
        {
          "type": "comment",
          "name": "question9"
        },
        {
          "type": "comment",
          "name": "question10"
        },
        {
          "type": "comment",
          "name": "question11"
        },
        {
          "type": "comment",
          "name": "question12"
        },
        {
          "type": "comment",
          "name": "question13"
        },
        {
          "type": "comment",
          "name": "question14"
        }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, tocJson);
    }
  );

  test("TOC navigation saves entered text https://github.com/surveyjs/survey-library/issues/5870", async (t) => {
    await t.typeText("input[type=text]", "some text");
    await t.click(Selector(".sv-string-viewer").withText("page2"));
    await t.expect(Selector("input[type=date]").visible).ok();
    await t.click(Selector(".sv-string-viewer").withText("page1"));
    await t.expect(Selector("input[type=text]").value).eql("some text");
  });

});
frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`;

  test("Page should be scrolled to top of survey", async (t) => {
    await initSurvey(framework, scrollJson);

    await t.scrollIntoView(Selector("input[value=Next]"));
    await t.click(Selector("input[value=Next]"));
    await t.expect(ClientFunction(() => document.querySelector("h3").getBoundingClientRect().y)()).gte(0);
  });

  test("Page should be scrolled to top of survey fit to container", async (t) => {
    await initSurvey(framework, scrollJson);

    await ClientFunction(() => {
      const container = window.document.getElementById("surveyElement");
      container.style.position = "fixed";
      container.style.top = 0;
      container.style.bottom = 0;
      container.style.left = 0;
      container.style.right = 0;
      window.survey.fitToContainer = true;
    })();

    await t.scrollIntoView(Selector("input[value=Next]"));
    await t.click(Selector("input[value=Next]"));
    await t.expect(ClientFunction(() => document.querySelector("h3").getBoundingClientRect().y)()).gte(0);
  });
});
