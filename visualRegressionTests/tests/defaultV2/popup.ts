import { Selector } from "testcafe";
import { frameworks, initSurvey, url, url_test, checkElementScreenshot, applyTheme, explicitErrorHandler } from "../../helper";

const title = "Popup Screenshot";
fixture`${title}`.page`${url}`;

const json = {
  showQuestionNumbers: "off",
  questions: [
    {
      name: "often",
      type: "radiogroup",
      title: "How often do you use this applications?",
      choices: ["Rare", "Sometimes", "Always"]
    }
  ]
};

const theme = "defaultV2";

const popupSelector = Selector(".sv-popup");
const clickButton = Selector(".sv-action");

function addDropdownTitleAction(_, opt) {
  let items = [];
  for (let index = 0; index < 10; index++) {
    items[index] = new window["Survey"].Action({ title: "item" + index });
  }
  const itemPopupModel = new window["Survey"].PopupModel("sv-list", {
    model: new window["Survey"].ListModel(items)
  }, "bottom", "left", true);

  const item = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Click",
    showTitle: true,
    action: () => {
      itemPopupModel.toggleVisibility();
    },
    popupModel: itemPopupModel
  });
  opt.titleActions = [item];
}

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`
    .page`${url_test}${theme}/${framework}.html`
    .beforeEach(async t => {
      await explicitErrorHandler();
      await applyTheme(theme);
    });

  test("Popup styles", async t => {
    await t.resizeWindow(1000, 600);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addDropdownTitleAction });
    await t.click(clickButton);
    await checkElementScreenshot("popup.png", popupSelector, t);
  });
});
