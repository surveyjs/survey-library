import {
  frameworks,
  url_test,
  initSurvey
} from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "Survey responsiveness";

var json = {
  questions: [
    {
      type: "text",
      name: "q1",
    },
  ],
};

const applyTheme = ClientFunction((theme) => {
  window["Survey"].StylesManager.applyTheme(theme);
});

const themeName = "defaultV2";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}.html`.beforeEach(async (t) => {
    await applyTheme(themeName);
    await initSurvey(framework, json);
    await t.resizeWindow(1000, 1000);
  });
  test("check survey root class on isMobile switch ", async (t) => {
    await ClientFunction(() => { window.addEventListener("error", e => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
        e.message === "ResizeObserver loop limit exceeded") {
        e.stopImmediatePropagation();
      }
    })})();
    const rootSelector = Selector(".sd-root-modern");
    const mobileClass = "sd-root-modern--mobile"
    await t.expect(rootSelector.hasClass(mobileClass)).notOk()
           .resizeWindow(500, 1000)
           .expect(rootSelector.hasClass(mobileClass)).ok()
           .resizeWindow(1000, 1000)
           .expect(rootSelector.hasClass(mobileClass)).notOk()
  });
});
