import { frameworks, url, initSurvey, test, expect } from "../helper";

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
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    test("check action is appear and works fine", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              title: "Action",
              action: () => {
                opt.question.state = "expanded";
              },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      const visibleAction = page.locator("h5 .sv-action:not(.sv-action--hidden)");
      await expect(visibleAction.locator("button")).toHaveText("Action");
      await expect(visibleAction).toBeVisible();
      await expect(visibleAction.locator("button svg use")).toHaveCount(0);
      await expect(visibleAction.locator("div.sv-action-bar-separator")).toHaveCount(0);
      await expect(visibleAction.locator("button span")).not.toHaveClass(/sv-action-bar-item__title--with-icon/);

      await visibleAction.locator("button").click();

      const questionState = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[0].state;
      });
      expect(questionState).toBe("expanded");
    });

    test("check action with disableTabStop: true", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              title: "Action",
              disableTabStop: true,
              action: () => {
                opt.question.state = "expanded";
              },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      const visibleAction = page.locator("h5 .sv-action:not(.sv-action--hidden)");
      await expect(visibleAction.locator("button")).toHaveText("Action");
      await expect(visibleAction.locator("button")).toHaveAttribute("tabindex", "-1");
    });

    test("check action with icon", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
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
        });
        window["survey"].fromJSON(json);
      }, json);

      await expect(page.locator("h5 use").nth(1)).toHaveAttribute("xlink:href", "#icon-action");
      await expect(page.locator("h5 button span.sd-action__title")).toHaveClass(/sv-action-bar-item__title--with-icon/);
      await expect(page.locator("h5 button .sd-action__icon")).toHaveCSS("width", "20px");
    });

    test("check item with showTitle false", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              iconName: "icon-action",
              title: "Action",
              showTitle: false,
              action: () => { },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      await expect(page.locator("h5 .sv-action:not(.sv-action--hidden) span.sv-action-bar-item__title")).toHaveCount(0);
    });

    test("check item with showTitle false and without icon", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              title: "Action",
              showTitle: false,
              action: () => { },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      await expect(page.locator("h5 .sv-action span.sd-action__title")).toBeVisible();
    });

    test("check action with separator", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              needSeparator: true,
              title: "Action",
              action: () => { },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      await expect(page.locator("h5 .sv-action div.sv-action-bar-separator")).toBeVisible();
    });

    test("check invisible item", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              visible: false,
              title: "Action",
              action: () => { },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      await expect(page.locator("h5 .sv-action").first()).not.toBeVisible();
    });

    test("check expand/collapse action", async ({ page }) => {
      const elementTitle = page.locator(".sd-question__title");
      const expandableClass = "sd-element__title--expandable";
      const expandedClass = "sd-element__title--expanded";
      const collapsedClass = "sd-element__title--collapsed";

      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {

        });
        window["survey"].fromJSON(json);
      }, json);

      await expect(elementTitle).toHaveClass(new RegExp(expandableClass));
      await expect(elementTitle).not.toHaveClass(new RegExp(expandedClass));
      await expect(elementTitle).toHaveClass(new RegExp(collapsedClass));

      let questionState = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[0].state;
      });
      expect(questionState).toBe("collapsed");

      await elementTitle.click();
      await expect(elementTitle).toHaveClass(new RegExp(expandableClass));
      await expect(elementTitle).toHaveClass(new RegExp(expandedClass));
      await expect(elementTitle).not.toHaveClass(new RegExp(collapsedClass));

      questionState = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[0].state;
      });
      expect(questionState).toBe("expanded");

      await elementTitle.click();
      await expect(elementTitle).toHaveClass(new RegExp(expandableClass));
      await expect(elementTitle).toHaveClass(new RegExp(collapsedClass));
      await expect(elementTitle).not.toHaveClass(new RegExp(expandedClass));

      questionState = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[0].state;
      });
      expect(questionState).toBe("collapsed");
    });

    test("check page title actions do not appear", async ({ page }) => {
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
      await initSurvey(page, framework, json);
      await expect(page.locator("h4 .sv-title-actions")).toHaveCount(0);
    });

    test("check page title actions appear", async ({ page }) => {
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
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetPageTitleActions.add((_, opt) => {
          opt.titleActions.push({ id: "item1" });
        });
        window["survey"].fromJSON(json);
      }, json);

      await expect(page.locator("h4 .sv-title-actions").first()).toBeVisible();
    });

    test("check responsivity manager is disposed when action bar is disposed", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              title: "Action",
              action: () => { },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      let hasResponsivityManager = await page.evaluate(() => {
        return !!window["survey"].getQuestionByName("actions_question").titleToolbarValue.responsivityManager;
      });
      expect(hasResponsivityManager).toBe(true);

      await page.evaluate(() => {
        window["survey"].getQuestionByName("actions_question").visible = false;
      });

      hasResponsivityManager = await page.evaluate(() => {
        return !!window["survey"].getQuestionByName("actions_question").titleToolbarValue.responsivityManager;
      });
      expect(hasResponsivityManager).toBe(false);

      await page.evaluate(() => {
        window["survey"].getQuestionByName("actions_question").visible = true;
      });

      hasResponsivityManager = await page.evaluate(() => {
        return !!window["survey"].getQuestionByName("actions_question").titleToolbarValue.responsivityManager;
      });
      expect(hasResponsivityManager).toBe(true);
    });

    test("check description click toggle question's state", async ({ page }) => {
      const json = {
        elements: [
          {
            type: "text",
            title: "q1_title",
            description: "q1_description",
            state: "collapsed",
          },
        ],
      };

      await initSurvey(page, framework, json);
      const elementTitle = page.locator(".sd-question__title");
      const elementDescription = page.locator(".sd-question__description");
      const expandableClass = /sd-element__title--expandable/;
      const expandedClass = /sd-element__title--expanded/;
      const collapsedClass = /sd-element__title--collapsed/;

      await expect(elementTitle).toHaveClass(expandableClass);
      await expect(elementTitle).not.toHaveClass(expandedClass);
      await expect(elementTitle).toHaveClass(collapsedClass);
      let getQuestionState = await page.evaluate(() => { return window["survey"].getAllQuestions()[0].state; });
      expect(await getQuestionState).toBe("collapsed");

      await elementDescription.click();
      await expect(elementTitle).toHaveClass(expandableClass);
      await expect(elementTitle).toHaveClass(expandedClass);
      await expect(elementTitle).not.toHaveClass(collapsedClass);
      getQuestionState = await page.evaluate(() => { return window["survey"].getAllQuestions()[0].state; });
      expect(await getQuestionState).toBe("expanded");

      await elementDescription.click();
      await expect(elementTitle).toHaveClass(expandableClass);
      await expect(elementTitle).not.toHaveClass(expandedClass);
      await expect(elementTitle).toHaveClass(collapsedClass);
      getQuestionState = await page.evaluate(() => { return window["survey"].getAllQuestions()[0].state; });
      expect(await getQuestionState).toBe("collapsed");
    });

    test("check description click toggle panel's state", async ({ page }) => {
      const json = {
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
      await initSurvey(page, framework, json);

      const descriptionSelector = page.locator("span", { hasText: "p1_description" });

      await descriptionSelector.click();
      expect(await page.evaluate(() => window["survey"].getAllPanels()[0].state)).toBe("collapsed");

      await descriptionSelector.click();
      expect(await page.evaluate(() => window["survey"].getAllPanels()[0].state)).toBe("expanded");
    });

    test("check adaptivity with one action", async ({ page }) => {
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
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              title: "Action title with long text",
              action: () => { },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      const myAction = page.locator(".sv-action").nth(0);
      const dotsItem = page.locator(".sv-action.sv-dots");

      await page.setViewportSize({ width: 800, height: 600 });
      await expect(myAction).toBeVisible();
      await expect(dotsItem).not.toBeVisible();

      await page.setViewportSize({ width: 550, height: 600 });
      await expect(myAction).not.toBeVisible();
      await expect(dotsItem).toBeVisible();

      await page.setViewportSize({ width: 800, height: 600 });
      await expect(myAction).toBeVisible();
      await expect(dotsItem).not.toBeVisible();
    });

    test("check adaptivity with title changes", async ({ page }) => {
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
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
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
        });
        window["survey"].fromJSON(json);
      }, json);

      const myAction = page.locator(".sv-action").nth(0);
      const myAction2 = page.locator(".sv-action").nth(1);
      const dotsItem = page.locator(".sv-action.sv-dots");
      const titleClassName = ".sd-action__title";

      await page.setViewportSize({ width: 600, height: 600 });
      await expect(myAction.locator(titleClassName)).toHaveCount(1);
      await expect(myAction2.locator(titleClassName)).toHaveCount(0);
      await expect(dotsItem).not.toBeVisible();

      await page.evaluate(() => {
        window["survey"].getQuestionByName("name").getTitleToolbar().actions[0].title = "Act1.1 long title for adaptivity testing";
      });

      await expect(myAction.locator(titleClassName)).toHaveCount(1);
      await expect(myAction2.locator(titleClassName)).toHaveCount(0);
    });

    test("check hidden action content has non-zero width", async ({ page }) => {
      await initSurvey(page, framework, {});
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [
            {
              title: "Action",
              visible: false,
              action: () => {
                opt.question.state = "expanded";
              },
            },
          ];
        });
        window["survey"].fromJSON(json);
      }, json);

      const hiddenAction = page.locator("h5 .sv-action.sv-action--hidden").first();
      const contentWidth = await hiddenAction.locator(".sv-action__content").evaluate(el => el.offsetWidth);
      expect(contentWidth).toBeGreaterThan(0);

      const maxDimension = await page.evaluate(() => {
        return window["survey"].getAllQuestions()[0].getTitleToolbar().actions[0].maxDimension;
      });
      expect(maxDimension).toBeGreaterThan(0);
    });

    test("Check Action focus", async ({ page }) => {
      await initSurvey(page, framework, {});
      const json = {
        elements: [
          {
            type: "text",
            name: "q1"
          }
        ]
      };
      await page.evaluate((json) => {
        window["survey"].onGetQuestionTitleActions.add((_, opt) => {
          opt.titleActions = [{
            title: "main_action",
            action: () => {},
            onFocus: (isMouse, event) => {
              opt.question.value = isMouse ? "focus_mouse" : "focus_keyboard";
              event.stopPropagation();
            }
          }];
        });
        window["survey"].fromJSON(json);
      }, json);

      const action = page.locator(".sv-action").first();
      const input = page.locator("input").first();

      await page.waitForTimeout(1000);
      await action.click();
      await expect(input).toHaveValue("focus_mouse");

      await page.keyboard.press("Tab");
      await expect(input).toHaveValue("focus_mouse");

      await page.keyboard.press("Shift+Tab");
      await expect(input).toHaveValue("focus_keyboard");
    });
  });
});