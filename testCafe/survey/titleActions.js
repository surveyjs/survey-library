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

    const visibleAction = Selector("h5 .sv-action:not(.sv-action--hidden)");
    assert.equal(await visibleAction.find("button").innerText, "Action");
    assert.ok(await visibleAction.visible);
    assert.ok(!(await visibleAction.find("button svg use").exists));
    assert.ok(
      !(await visibleAction.find("div.sv-action-bar-separator").exists)
    );
    assert.equal(
      (await visibleAction.find("button span").classNames).indexOf(
        "sv-action-bar-item__title--with-icon"
      ),
      -1
    );
    await t.click(visibleAction.find("button"));
    assert.equal(await getQuestionState(), "expanded");
  });

  test("check action with icon", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            iconName: "icon-action",
            iconSize: 20,
            title: "Action",
            action: () => {
              opt.question.state = "expanded";
            },
          },
        ];
      },
    });
    await t
      .expect(Selector("h5 use").getAttribute("xlink:href")).eql("#icon-action")
      .expect(Selector("h5 button span.sv-action-bar-item__title").hasClass("sv-action-bar-item__title--with-icon")).ok()
      .expect(Selector("h5 button .sv-action-bar-item__icon").offsetWidth).eql(20);
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
      !(await Selector("h5 .sv-action:not(.sv-action--hidden) span.sv-action-bar-item__title").exists)
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
            action: () => { },
          },
        ];
      },
    });
    assert.ok(!(await Selector("h5 .sv-action").visible));
  });

  test("check expand/collapse action", async (t) => {
    const elementTitle = Selector(".sv_q_title");
    const getQuestionState = ClientFunction(() => { return survey.getAllQuestions()[0].state; });

    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => { },
    });

    await t
      .expect(elementTitle.hasClass("sv_q_title_expandable")).ok()
      .expect(elementTitle.hasClass("sv_q_title_expanded")).notOk()
      .expect(elementTitle.hasClass("sv_q_title_collapsed")).ok()
    await t.expect(await getQuestionState()).eql("collapsed");

    await t
      .click(elementTitle)
      .expect(elementTitle.hasClass("sv_q_title_expandable")).ok()
      .expect(elementTitle.hasClass("sv_q_title_expanded")).ok()
      .expect(elementTitle.hasClass("sv_q_title_collapsed")).notOk();
    await t.expect(await getQuestionState()).eql("expanded")

    await t
      .click(elementTitle)
      .expect(elementTitle.hasClass("sv_q_title_expandable")).ok()
      .expect(elementTitle.hasClass("sv_q_title_collapsed")).ok()
      .expect(elementTitle.hasClass("sv_q_title_expanded")).notOk();
    await t.expect(await getQuestionState()).eql("collapsed");
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
  test("check responsivity manager is disposed when action bar is disposed", async (t) => {
    const getToolbarResponsivityManager = ClientFunction(() => !!survey.getQuestionByName("actions_question").titleToolbarValue.responsivityManager);
    const setQuestionVisibility = ClientFunction((visible) => { survey.getQuestionByName("actions_question").visible = visible });
    await initSurvey(framework, json);
    await t.expect(getToolbarResponsivityManager()).ok();
    await setQuestionVisibility(false);
    await t.expect(getToolbarResponsivityManager()).notOk();
    await setQuestionVisibility(true);
    await t.expect(getToolbarResponsivityManager()).ok();
  });
});
