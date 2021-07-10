import { frameworks, url, initSurvey } from "../helper";
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

[frameworks].forEach((framework) => {
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
      await Selector("h5 button span.sv-action-bar-item__title").hasClass(
        "sv-action-bar-item__title--with-icon"
      )
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
  });

  test("check item with showTitle false and without icon", async (t) => {
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
    t.debug();
    await t.click("h5");
    assert.ok(
      await Selector(".sv-expand-action").hasClass("sv-expand-action--expanded")
    );
    assert.equal(await getQuestionState(), "expanded");
    await t.click("h5");
    assert.ok(
      !(await Selector(".sv-expand-action").hasClass(
        "sv-expand-action--expanded"
      ))
    );
    assert.equal(await getQuestionState(), "collapsed");
  });
  test("check page title actions do not appear", async (t) => {
    const json = {
      pages: [
        {
          title: "Page title with actions",
          questions: [
            {
              type: "text",
              name: "simple question",
            },
          ],
        },
      ],
    };
    await initSurvey(framework, json);
    assert.ok(!(await Selector("h4 .sv-title-actions").exists));
  });
  test("check page title actions appear", async (t) => {
    const json = {
      pages: [
        {
          title: "Page title with actions",
          questions: [
            {
              type: "text",
              name: "simple question",
            },
          ],
        },
      ],
    };
    await initSurvey(framework, json, {
      onGetPageTitleActions: (_, opt) => {
        opt.titleActions.push({ id: "item1" });
      },
    });

    assert.ok(await Selector("h4 .sv-title-actions").exists);
  });
});
