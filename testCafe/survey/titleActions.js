import { frameworks, url, initSurvey } from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `titleActions`;

const json = {
  elements: [
    {
      type: "text",
      name: "actions_question",
      state: "collapsed",
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("check action is appear and works fine", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            title: "Action",
            action: () => {
              opt.question.state = "expanded";
            },
          },
        ];
      },
    });

    var getQuestionState = ClientFunction(() => {
      return survey.getAllQuestions()[0].state;
    });
    assert.equal(await Selector("h5 button").innerText, "Action");
    assert.ok(await Selector("h5 .sv-action").visible);
    assert.ok(!(await Selector("h5 button svg use").exists));
    assert.ok(
      !(await Selector("h5 .sv-action div.sv-action-bar-separator").exists)
    );
    assert.equal(
      (await Selector("h5 button span").classNames).indexOf(
        "sv-action-bar-item__title--with-icon"
      ),
      -1
    );
    await t.click("h5 button");
    assert.equal(await getQuestionState(), "expanded");
  });

  test("check action with icon", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            iconName: "icon-action",
            title: "Action",
            action: () => {
              opt.question.state = "expanded";
            },
          },
        ];
      },
    });
    assert.equal(
      await Selector("h5 use").getAttribute("xlink:href"),
      "#icon-action"
    );
    assert.ok(
      await Selector(
        "h5 button span.h5 span.sv-action-bar-item__title"
      ).hasClass("sv-action-bar-item__title--with-icon")
    );
  });

  test("check item with showTitle false", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            iconName: "icon-action",
            title: "Action",
            showTitle: false,
            action: () => {},
          },
        ];
      },
    });
    assert.ok(
      !(await Selector("h5 .sv-action span.sv-action-bar-item__title").exists)
    );
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            title: "Action",
            showTitle: false,
            action: () => {},
          },
        ];
      },
    });
    assert.ok(
      await Selector("h5 .sv-action span.sv-action-bar-item__title").exists
    );
  });

  test("check action with separator", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            needSeparator: true,
            title: "Action",
            action: () => {},
          },
        ];
      },
    });
    assert.ok(
      await Selector("h5 .sv-action div.sv-action-bar-separator").exists
    );
  });

  test("check invisible item", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            visible: false,
            title: "Action",
            action: () => {},
          },
        ];
      },
    });
    assert.ok(!(await Selector("h5 .sv-action").visible));
  });

  test("check expand/collapse action", async (t) => {
    var getQuestionState = ClientFunction(() => {
      return survey.getAllQuestions()[0].state;
    });
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {},
    });
    await t.click("h5 .sv-expand-action");
    assert.ok(
      await Selector(".sv-expand-action").hasClass("sv-expand-action--expanded")
    );
    assert.equal(await getQuestionState(), "expanded");
    await t.click("h5 .sv-expand-action");
    assert.ok(
      !(await Selector(".sv-expand-action").hasClass(
        "sv-expand-action--expanded"
      ))
    );
    assert.equal(await getQuestionState(), "collapsed");
  });
});
