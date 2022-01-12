import { frameworks, url, initSurvey } from "../helper";
import { Selector, ClientFunction } from "testcafe";
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
    await t
      .expect(visibleAction.find("button").innerText).eql("Action")
      .expect(visibleAction.visible).ok()
      .expect(visibleAction.find("button svg use").exists).notOk()
      .expect(visibleAction.find("div.sv-action-bar-separator").exists).notOk()
      .expect(visibleAction.find("button span").hasClass("sv-action-bar-item__title--with-icon")).notOk()

      .click(visibleAction.find("button"));

    await t.expect(await getQuestionState()).eql("expanded");
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
            action: () => { },
          },
        ];
      },
    });

    await t.expect(Selector("h5 .sv-action:not(.sv-action--hidden) span.sv-action-bar-item__title").exists).notOk();
  });

  test("check item with showTitle false and without icon", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            title: "Action",
            showTitle: false,
            action: () => { },
          },
        ];
      },
    });

    await t.expect(Selector("h5 .sv-action span.sv-action-bar-item__title").exists).ok();
  });

  test("check action with separator", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            needSeparator: true,
            title: "Action",
            action: () => { },
          },
        ];
      },
    });
    await t.expect(Selector("h5 .sv-action div.sv-action-bar-separator").exists).ok();
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
    await t.expect(Selector("h5 .sv-action").visible).notOk();
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
    await t.expect(Selector("h4 .sv-title-actions").exists).notOk();
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

    await t.expect(Selector("h4 .sv-title-actions").exists).ok();
  });

  test("check responsivity manager is disposed when action bar is disposed", async (t) => {
    const getToolbarResponsivityManager = ClientFunction(() => !!survey.getQuestionByName("actions_question").titleToolbarValue.responsivityManager);
    const setQuestionVisibility = ClientFunction((visible) => { survey.getQuestionByName("actions_question").visible = visible });
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            title: "Action",
            action: () => { },
          },
        ];
      }
    });
    await t.expect(getToolbarResponsivityManager()).ok();
    await setQuestionVisibility(false);
    await t.expect(getToolbarResponsivityManager()).notOk();
    await setQuestionVisibility(true);
    await t.expect(getToolbarResponsivityManager()).ok();
  });
});
