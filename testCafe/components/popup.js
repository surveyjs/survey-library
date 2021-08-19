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

const disposeSurvey = ClientFunction((framework) => {
  survey.dispose();
  if (framework === "react") {
    ReactDOM.unmountComponentAtNode(document.getElementById("surveyElement"));
  }
});

const getElementClientRect = ClientFunction((selector) => {
  const clientRect = document.querySelector(selector).getBoundingClientRect();
  return {
    left: clientRect.left,
    top: clientRect.top,
    width: clientRect.width,
    height: clientRect.height,
  };
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await t.resizeWindow(800, 600);
    }
  );

  test("check ordinary popup behavior", async (t) => {
    await initSurvey(framework, json, {
      onGetQuestionTitleActions: (_, opt) => {
        const itemPopupModel = new Survey.PopupModel("sv-list", {
          model: new Survey.ListModel([
            new Survey.Action({ title: "Item 1" }),
          ]),
        });
        const item = new Survey.Action({
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
    const popupClientRect = await getElementClientRect(".sv-popup__container");
    const itemClientRect = await getElementClientRect(".sv-action-bar-item");
    assert.equal(
      itemClientRect.left - 8 - popupClientRect.width,
      popupClientRect.left
    );
    assert.equal(itemClientRect.top, popupClientRect.top);
    await t.click(itemSelector);
    assert.ok(await popupSelector.exists);
    assert.ok(!(await popupSelector.visible));
    
    await t.click(itemSelector);
    assert.ok(await popupSelector.visible);
    await t.pressKey("esc");
    assert.ok(await popupSelector.exists);
    assert.ok(!(await popupSelector.visible));
    
    await disposeSurvey(framework);
    assert.ok(!(await popupSelector.exists));
  });
  test(`check survey in showModal`, async (t) => {
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
        const item = new Survey.Action({
          component: "sv-action-bar-item",
          title: "Click",
          showTitle: true,
          action: () => {
            const model = new Survey.Model(json);
            Survey.settings.showModal("survey", {
              model: model,
              survey: model,
            });
          },
        });
        opt.titleActions = [item];
      },
    });
    const popupSelector = Selector(".sv-popup.sv-popup--modal");
    assert.ok(!(await popupSelector.exists));

    await t.click(Selector(".sv-action-bar-item"));
    assert.ok(await popupSelector.visible);
    assert.ok(
      await Selector(".sv-popup span").withText("modal_question").visible
    );
    const popupClientRect = await getElementClientRect(".sv-popup--modal .sv-popup__container");
    assert.equal(
      popupClientRect.left,
      Math.round((800 / 2 - popupClientRect.width / 2) * 10) / 10
    );
    assert.equal(
      popupClientRect.top,
      Math.round((600 / 2 - popupClientRect.height / 2) * 10) / 10
    );
    await t.click(Selector(".sv-action-bar-item"));
    assert.ok(await popupSelector.visible);
    await t.click(Selector(".sv-popup__button").withText("Cancel"));
    assert.ok(!(await popupSelector.exists));

    await t.click(Selector(".sv-action-bar-item"));
    assert.ok(await popupSelector.visible);
    await t.pressKey("esc");
    assert.ok(!(await popupSelector.exists));
  });
  test(`check focus trap`, async (t) => {
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
        const item = new Survey.Action({
          component: "sv-action-bar-item",
          title: "Click",
          showTitle: true,
          action: () => {
            const model = new Survey.Model(json);
            Survey.settings.showModal("survey", {
              model: model,
              survey: model,
            });
          },
        });
        opt.titleActions = [item];
      },
    });
    await t.click(Selector(".sv-action-bar-item"))
    await t.expect(Selector(".sv-popup .sv_q_text_root").focused).ok({
      timeout: 100,
    });
    await t.pressKey("tab");
    assert.ok(await Selector(".sv-popup .sv_complete_btn").focused);
    await t.pressKey("tab");
    assert.ok(await Selector(".sv-popup__button").withText("Cancel").focused);
    await t.pressKey("tab");
    assert.ok(await Selector(".sv-popup__button").withText("Apply").focused);
    await t.pressKey("tab");
    assert.ok(await Selector(".sv-popup .sv_q_text_root").focused);
    await t.pressKey("shift+tab");
    assert.ok(await Selector(".sv-popup__button").withText("Apply").focused);
  });
});
