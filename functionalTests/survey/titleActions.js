import { frameworks, url, initSurvey } from "../helper";
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
      .expect(Selector("h5 use").nth(1).getAttribute("xlink:href")).eql("#icon-action")
      .expect(Selector("h5 button span.sd-action__title").hasClass("sv-action-bar-item__title--with-icon")).ok()
      .expect(Selector("h5 button .sd-action__icon").getStyleProperty("width")).eql("20px");
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

    await t.expect(Selector("h5 .sv-action span.sd-action__title").exists).ok();
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
    const elementTitle = Selector(".sd-question__title");
    const getQuestionState = ClientFunction(() => { return window["survey"].getAllQuestions()[0].state; });
    const expandableClass = "sd-element__title--expandable";
    const expandedClass = "sd-element__title--expanded";
    const collapsedClass = "sd-element__title--collapsed";

    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => { },
    });

    await t
      .expect(elementTitle.hasClass(expandableClass)).ok()
      .expect(elementTitle.hasClass(expandedClass)).notOk()
      .expect(elementTitle.hasClass(collapsedClass)).ok();
    await t.expect(await getQuestionState()).eql("collapsed");

    await t
      .click(elementTitle)
      .expect(elementTitle.hasClass(expandableClass)).ok()
      .expect(elementTitle.hasClass(expandedClass)).ok()
      .expect(elementTitle.hasClass(collapsedClass)).notOk();
    await t.expect(await getQuestionState()).eql("expanded");

    await t
      .click(elementTitle)
      .expect(elementTitle.hasClass(expandableClass)).ok()
      .expect(elementTitle.hasClass(collapsedClass)).ok()
      .expect(elementTitle.hasClass(expandedClass)).notOk();
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
      widthMode: "responsive",
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

  test("check adaptivity with title changes", async (t) => {
    const json = {
      questions: [
        {
          name: "name",
          type: "text",
          placeHolder: "Jon Snow",
          isRequired: true
        }
      ]
    };
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        opt.titleActions = [
          {
            title: "Act1 long title for adaptivity testing",
            iconName: "excellent",
            action: () => { },
          },
          {
            title: "Act2 long title for adaptivity testing",
            iconName: "good",
            action: () => { },
          },
        ];
      },
    });
    const myAction = Selector(".sv-action").nth(0);
    const myAction2 = Selector(".sv-action").nth(1);
    const dotsItem = Selector(".sv-action.sv-dots");
    const titleClassName = ".sd-action__title";
    await t
      .resizeWindow(600, 600)
      .expect(myAction.find(titleClassName).exists).ok()
      .expect(myAction2.find(titleClassName).exists).notOk()
      .expect(dotsItem.visible).notOk();

    await ClientFunction(() => {
      window["survey"].getQuestionByName("name").getTitleToolbar().actions[0].title = "Act1.1 long title for adaptivity testing";
    })();
    await t
      .expect(myAction.find(titleClassName).exists).ok()
      .expect(myAction2.find(titleClassName).exists).notOk();
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`.beforeEach(async (t) => {
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

function addTitleActionForFocus(_, opt) {
  opt.titleActions = [{
    title: "main_action",
    action: () => {},
    onFocus: (isMouse, event) => {
      opt.question.value = isMouse ? "focus_mouse" : "focus_keyboard";
      event.stopPropagation();
    }
  }];
}

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`
    .page`${url}${framework}`.beforeEach(async (t) => {
  });

  test("Check Action focus", async t => {
    await initSurvey(framework, {
      elements: [
        {
          type: "text",
          name: "q1"
        }
      ]
    }, { onGetQuestionTitleActions: addTitleActionForFocus });
    const action = Selector(".sv-action");

    await t
      .wait(1000)
      .click(action)
      .expect(Selector("input").value).eql("focus_mouse")
      .pressKey("tab")
      .expect(Selector("input").value).eql("focus_mouse")
      .pressKey("shift+tab")
      .expect(Selector("input").value).eql("focus_keyboard");
  });
});
