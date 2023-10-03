import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, resetFocusToBody, wrapVisualTest, takeElementScreenshot, resetHoverToBody } from "../../helper";

const title = "Survey Layout (paddings, positioning and so on)";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

const theme = "defaultV2";
const pageTitle = "Animals";
const pageDescription = "Animals are multicellular, eukaryotic organisms in the biological kingdom Animalia. With few exceptions, animals consume organic material, breathe oxygen, are able to move, can reproduce sexually, and grow from a hollow sphere of cells, the blastula, during embryonic development.";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}`.beforeEach(async t => { await applyTheme(theme); });

  test("Static - with panels", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1800, 1000);
      await initSurvey(framework, {
        "title": "Static",
        "description": "",
        "showQuestionNumbers": false,
        "widthMode": "static",
        "pages": [{
          "name": "page1",
          "elements": [
            {
              type: "text",
              name: "question1",
              title: "Question",
            },
            {
              type: "text",
              name: "question2",
              title: "Second Question",
            }
          ]
        }]
      });
      await ClientFunction(() => {
        document.body.focus();
        // (<any>window).survey.showPreview();
      })();

      const bodyRoot = Selector(".sd-container-modern");

      await takeElementScreenshot("page-layout-panels-notitle-nodescription.png", bodyRoot, t, comparer);

      await ClientFunction((pageTitle) => {
        (<any>window).survey.pages[0].title = pageTitle;
        (<any>window).survey.render();
      })(pageTitle);
      await takeElementScreenshot("page-layout-panels-title-nodescription.png", bodyRoot, t, comparer);

      await ClientFunction((pageDescription) => {
        (<any>window).survey.pages[0].description = pageDescription;
        (<any>window).survey.render();
      })(pageDescription);
      await takeElementScreenshot("page-layout-panels-title-description.png", bodyRoot, t, comparer);

      await ClientFunction(() => {
        (<any>window).survey.pages[0].title = "";
        (<any>window).survey.render();
      })();
      await takeElementScreenshot("page-layout-panels-notitle-description.png", bodyRoot, t, comparer);

    });
  });

  test("Static - w/o panels", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1800, 1000);
      await initSurvey(framework, {
        "title": "Static",
        "description": "",
        "showQuestionNumbers": false,
        "widthMode": "static",
        "pages": [{
          "name": "page1",
          "elements": [
            {
              type: "text",
              name: "question1",
              title: "Question",
            },
            {
              type: "text",
              name: "question2",
              title: "Second Question",
            }
          ]
        }]
      });
      await ClientFunction(() => {
        document.body.focus();
        (<any>window).survey.isCompact = true;
      })();

      const bodyRoot = Selector(".sd-container-modern");

      await takeElementScreenshot("page-layout-compact-notitle-nodescription.png", bodyRoot, t, comparer);

      await ClientFunction((pageTitle) => {
        (<any>window).survey.pages[0].title = pageTitle;
        (<any>window).survey.render();
      })(pageTitle);
      await takeElementScreenshot("page-layout-compact-title-nodescription.png", bodyRoot, t, comparer);

      await ClientFunction((pageDescription) => {
        (<any>window).survey.pages[0].description = pageDescription;
        (<any>window).survey.render();
      })(pageDescription);
      await takeElementScreenshot("page-layout-compact-title-description.png", bodyRoot, t, comparer);

      await ClientFunction(() => {
        (<any>window).survey.pages[0].title = "";
        (<any>window).survey.render();
      })();
      await takeElementScreenshot("page-layout-compact-notitle-description.png", bodyRoot, t, comparer);

    });
  });

  test("Responsive - with panels", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1800, 1000);
      await initSurvey(framework, {
        "title": "Responsive",
        "description": "",
        "showQuestionNumbers": false,
        "widthMode": "responsive",
        "pages": [{
          "name": "page1",
          "elements": [
            {
              type: "text",
              name: "question1",
              title: "Question",
            },
            {
              type: "text",
              name: "question2",
              title: "Second Question",
            }
          ]
        }]
      });
      await ClientFunction(() => {
        document.body.focus();
        // (<any>window).survey.showPreview();
      })();

      const bodyRoot = Selector(".sd-container-modern");

      await takeElementScreenshot("page-layout-responsive-panels-notitle-nodescription.png", bodyRoot, t, comparer);

      await ClientFunction((pageTitle) => {
        (<any>window).survey.pages[0].title = pageTitle;
        (<any>window).survey.render();
      })(pageTitle);
      await takeElementScreenshot("page-layout-responsive-panels-title-nodescription.png", bodyRoot, t, comparer);

      await ClientFunction((pageDescription) => {
        (<any>window).survey.pages[0].description = pageDescription;
        (<any>window).survey.render();
      })(pageDescription);
      await takeElementScreenshot("page-layout-responsive-panels-title-description.png", bodyRoot, t, comparer);

      await ClientFunction(() => {
        (<any>window).survey.pages[0].title = "";
        (<any>window).survey.render();
      })();
      await takeElementScreenshot("page-layout-responsive-panels-notitle-description.png", bodyRoot, t, comparer);

    });
  });

  test("Reaponsive - w/o panels", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(1800, 1000);
      await initSurvey(framework, {
        "title": "Responsive",
        "description": "",
        "showQuestionNumbers": false,
        "widthMode": "responsive",
        "pages": [{
          "name": "page1",
          "elements": [
            {
              type: "text",
              name: "question1",
              title: "Question",
            },
            {
              type: "text",
              name: "question2",
              title: "Second Question",
            }
          ]
        }]
      });
      await ClientFunction(() => {
        document.body.focus();
        (<any>window).survey.isCompact = true;
      })();

      const bodyRoot = Selector(".sd-container-modern");

      await takeElementScreenshot("page-layout-responsive-compact-notitle-nodescription.png", bodyRoot, t, comparer);

      await ClientFunction((pageTitle) => {
        (<any>window).survey.pages[0].title = pageTitle;
        (<any>window).survey.render();
      })(pageTitle);
      await takeElementScreenshot("page-layout-responsive-compact-title-nodescription.png", bodyRoot, t, comparer);

      await ClientFunction((pageDescription) => {
        (<any>window).survey.pages[0].description = pageDescription;
        (<any>window).survey.render();
      })(pageDescription);
      await takeElementScreenshot("page-layout-responsive-compact-title-description.png", bodyRoot, t, comparer);

      await ClientFunction(() => {
        (<any>window).survey.pages[0].title = "";
        (<any>window).survey.render();
      })();
      await takeElementScreenshot("page-layout-responsive-compact-notitle-description.png", bodyRoot, t, comparer);

    });
  });
});