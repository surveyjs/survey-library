import { url, initSurvey, getSurveyResult, frameworks } from "../helper";
import { Selector, ClientFunction, t } from "testcafe";
const assert = require("assert");
const title = `popup`;

const json = {
  elements: [
    {
      type: "text",
      name: "actions_question",
    },
  ],
};

const disposeSurvey = ClientFunction(framework => {
  survey.dispose();
  if (framework === "react") {
    ReactDOM.unmountComponentAtNode(document.getElementById("surveyElement"));
  }
});

const getPopupPosition = ClientFunction(() => {
  const clientRect = document
    .querySelector(".sv-popup__container")
    .getBoundingClientRect();
  return { left: clientRect.left, top: clientRect.top };
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await t.resizeWindow(800, 600);
    }
  );

  test("check ordinary popup behavior", async t => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        const itemPopupModel = new Survey.PopupModel("sv-list", {
          model: new Survey.ListModel([
            new Survey.ActionBarItem({ title: "Item 1" }),
          ]),
        });
        const item = new Survey.ActionBarItem({
          component: "sv-action-bar-item-dropdown",
          title: "Click",
          showTitle: true,
          action: () => {
            itemPopupModel.toggleVisibility();
          },
          popupModel: itemPopupModel,
        });
        opt.titleActions = [item];
      },
    });
    const popupSelector = Selector(".sv-popup");
    const itemSelector = Selector(".sv-action-bar-item");
    assert.ok(await popupSelector.exists);
    assert.ok(!(await popupSelector.visible));
    await t.click(itemSelector);
    assert.ok(await popupSelector.visible);
    assert.ok(await Selector(".sv-popup span").withText("Item 1").visible);
    assert.deepEqual(await getPopupPosition(), { left: 616, top: 38 });
    await t.click(itemSelector);
    assert.ok(await popupSelector.exists);
    assert.ok(!(await popupSelector.visible));
    await disposeSurvey(framework);
    assert.ok(!(await popupSelector.exists));
  });
  test(`check survey in showModal`, async t => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (survey, opt) => {
        const json = {
          elements: [
            {
              type: "text",
              name: "modal_question",
            },
          ],
        };
        const model = new Survey.Model(json);
        const item = new Survey.ActionBarItem({
          component: "sv-action-bar-item",
          title: "Click",
          showTitle: true,
          action: () => {
            Survey.settings.showModal("survey", {
              model: model,
              survey: model,
            });
          },
        });
        opt.titleActions = [item];
      },
    });
    const popupSelector = Selector(".sv-popup");
    assert.ok(!(await popupSelector.exists));
    await t.click(Selector(".sv-action-bar-item"));
    assert.ok(await popupSelector.visible);
    assert.ok(
      await Selector(".sv-popup span").withText("modal_question").visible
    );
    assert.deepEqual(await getPopupPosition(), { left: 204, top: 129 });
    await t.click(Selector(".sv-action-bar-item"));
    assert.ok(await popupSelector.visible);
    await t.click(Selector(".sv-popup__button").withText("Cancel"));
    assert.ok(!(await popupSelector.exists));
  });
});
