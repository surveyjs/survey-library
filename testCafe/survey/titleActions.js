import { frameworks, url, initSurvey, url_test, applyTheme } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "titleActions";

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
      return window["survey"].getAllQuestions()[0].state;
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

  test("check action with disableTabStop: true", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            title: "Action",
            disableTabStop: true,
            action: () => {
              opt.question.state = "expanded";
            },
          },
        ];
      },
    });
    const visibleAction = Selector("h5 .sv-action:not(.sv-action--hidden)");
    await t
      .expect(visibleAction.find("button").innerText).eql("Action")
      .expect(visibleAction.find("button").getAttribute("tabindex")).eql("-1");
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
      .expect(Selector("h5 button .sv-action-bar-item__icon").getStyleProperty("width")).eql("20px");
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
    const getQuestionState = ClientFunction(() => { return window["survey"].getAllQuestions()[0].state; });

    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => { },
    });

    await t
      .expect(elementTitle.hasClass("sv_q_title_expandable")).ok()
      .expect(elementTitle.hasClass("sv_q_title_expanded")).notOk()
      .expect(elementTitle.hasClass("sv_q_title_collapsed")).ok();
    await t.expect(await getQuestionState()).eql("collapsed");

    await t
      .click(elementTitle)
      .expect(elementTitle.hasClass("sv_q_title_expandable")).ok()
      .expect(elementTitle.hasClass("sv_q_title_expanded")).ok()
      .expect(elementTitle.hasClass("sv_q_title_collapsed")).notOk();
    await t.expect(await getQuestionState()).eql("expanded");

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
    const getToolbarResponsivityManager = ClientFunction(() => !!window["survey"].getQuestionByName("actions_question").titleToolbarValue.responsivityManager);
    const setQuestionVisibility = ClientFunction((visible) => { window["survey"].getQuestionByName("actions_question").visible = visible; });
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

  test("check description click toggle question's state", async (t) => {
    const json = {
      elements: [
        {
          type: "text",
          title: "q1_title",
          description: "q1_description",
          name: "q1",
          state: "expanded",
        },
      ],
    };

    await initSurvey(framework, json);
    const getQuestionState = ClientFunction(() => {
      return window.survey.getAllQuestions()[0].state;
    });
    const descriptionSelector = Selector("span").withText("q1_description");
    await t.click(descriptionSelector)
      .expect(getQuestionState()).eql("collapsed")
      .click(descriptionSelector)
      .expect(getQuestionState()).eql("expanded");
  });

  test("check description click toggle panel's state", async (t) => {
    var json = {
      elements: [
        {
          type: "panel",
          name: "p1",
          title: "p1_title",
          description: "p1_description",
          state: "expanded",
          elements: [
            {
              type: "text",
              name: "q1"
            }
          ]
        }
      ]
    };
    await initSurvey(framework, json);
    const getQuestionState = ClientFunction(() => {
      return window.survey.getAllPanels()[0].state;
    });
    const descriptionSelector = Selector("span").withText("p1_description");
    await t.click(descriptionSelector)
      .expect(getQuestionState()).eql("collapsed")
      .click(descriptionSelector)
      .expect(getQuestionState()).eql("expanded");
  });

  test("check adaptivity with one action", async (t) => {
    const json = {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Text long  long long long long long long long",
          placeHolder: "Jon Snow",
          isRequired: true
        }
      ]
    };
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            title: "Action title with long text",
            action: () => { },
          },
        ];
      },
    });
    const myAction = Selector(".sv-action").nth(0);
    const dotsItem = Selector(".sv-action.sv-dots");

    await t
      .resizeWindow(800, 600)
      .expect(myAction.visible).ok()
      .expect(dotsItem.visible).notOk()

      .resizeWindow(550, 600)
      .expect(myAction.visible).notOk()
      .expect(dotsItem.visible).ok()

      .resizeWindow(800, 600)
      .expect(myAction.visible).ok()
      .expect(dotsItem.visible).notOk();
  });
});

const themeName = "defaultV2";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`.beforeEach(async (t) => {
    await applyTheme(themeName);
  });
  test("check hidden action content has non-zero width", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            title: "Action",
            visible: false,
            action: () => {
              opt.question.state = "expanded";
            },
          },
        ];
      },
    });
    const hiddenAction = Selector("h5 .sv-action.sv-action--hidden");
    await t
      .expect(hiddenAction.find(".sv-action__content").offsetWidth).gt(0)
      .expect(ClientFunction(() => {
        return window["survey"].getAllQuestions()[0].getTitleToolbar().actions[0].maxDimension;
      })()).gt(0);
  });
});
