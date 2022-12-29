import { url, initSurvey, frameworks } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "popup";

const json = {
  elements: [
    {
      type: "text",
      name: "actions_question"
    }
  ]
};

const disposeSurvey = ClientFunction(framework => {
  if (framework === "vue") {
    window["vueApp"].$destroy();
  }
  if (framework === "react") {
    window["ReactDOM"].unmountComponentAtNode(document.getElementById("surveyElement"));
  }
  if (framework === "angular") {
    window["setSurvey"](undefined);
  }
  window["survey"].dispose();
});

const getElementClientRect = ClientFunction(selector => {
  const clientRect = document.querySelector(selector).getBoundingClientRect();
  return {
    left: clientRect.left,
    top: clientRect.top,
    width: clientRect.width,
    height: clientRect.height
  };
});

function addModalPopupTitleAction(survey, opt) {
  const json = {
    elements: [
      {
        type: "text",
        name: "modal_question"
      }
    ]
  };
  const item = new window["Survey"].Action({
    component: "sv-action-bar-item",
    title: "Click",
    showTitle: true,
    action: () => {
      const model = new window["Survey"].Model(json);
      model.focusFirstQuestionAutomatic = false;
      window["Survey"].settings.showModal("survey", {
        model: model,
        survey: model
      });
    }
  });
  opt.titleActions = [item];
}

function addDropdownTitleAction(_, opt) {
  const item = window["Survey"].createDropdownActionModel(
    { title: "Click", showTitle: true },
    { items: [new window["Survey"].Action({ title: "Item 1" })] }
  );
  opt.titleActions = [item];
}

const popupSelector = Selector(".sv-popup");
const popupModalSelector = Selector(".sv-popup.sv-popup--modal");
const clickButton = Selector(".sv-action-bar-item");
const popupButtonSelector = Selector(".sv-popup__button");

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(async t => {
    await t.resizeWindow(800, 600);
  });

  test("check ordinary popup behavior", async t => {
    await initSurvey(framework, json, { onGetQuestionTitleActions: addDropdownTitleAction });

    await t
      .expect(popupSelector.exists).ok()
      .expect(popupSelector.visible).notOk()
      .click(clickButton)
      .expect(popupSelector.visible).ok()
      .expect(Selector(".sv-popup span").withText("Item 1").visible).ok();

    const popupClientRect = await getElementClientRect(".sv-popup__container");
    const itemClientRect = await getElementClientRect(".sv-action-bar-item");

    await t
      .expect(itemClientRect.left - 8 - popupClientRect.width).eql(popupClientRect.left)
      .expect(itemClientRect.top).eql(popupClientRect.top)
      .click(clickButton)
      .expect(popupSelector.exists).ok()
      .expect(popupSelector.visible).notOk()

      .click(clickButton)
      .expect(popupSelector.visible).ok()
      .expect(Selector(".sv-action-bar-item").hasClass("sv-action-bar-item--pressed")).ok()
      .pressKey("esc")
      .expect(popupSelector.exists).ok()
      .expect(Selector(".sv-action-bar-item").hasClass("sv-action-bar-item--pressed")).notOk()
      .expect(popupSelector.visible).notOk();

    await disposeSurvey(framework);
    await t.expect(popupSelector.exists).notOk();
  });

  test("check showPointer popup position", async t => {
    await initSurvey(framework, json, { onGetQuestionTitleActions: addDropdownTitleAction });
    await ClientFunction(selector => {
      const style = document.querySelector(selector).style;
      style.marginLeft = "4px";
      style.marginRight = "4px";
    })(".sv-popup__container");

    await t
      .expect(popupSelector.exists).ok()
      .expect(popupSelector.visible).notOk()
      .click(clickButton)
      .expect(popupSelector.visible).ok()
      .expect(Selector(".sv-popup span").withText("Item 1").visible).ok();

    const popupClientRect = await getElementClientRect(".sv-popup__container");
    const itemClientRect = await getElementClientRect(".sv-action-bar-item");
    const popupPointerClientRect = await getElementClientRect(".sv-popup__pointer");

    await t
      .expect(Math.abs(popupClientRect.left + popupClientRect.width - popupPointerClientRect.left)).lte(1.0);

  });

  test("check survey in showModal", async t => {
    await initSurvey(framework, json, { onGetQuestionTitleActions: addModalPopupTitleAction });

    await t
      .expect(popupModalSelector.exists).notOk()
      .click(clickButton)
      .expect(popupModalSelector.visible).ok()
      .expect(Selector(".sv-popup span").withText("modal_question").visible).ok();

    const popupClientRect = await getElementClientRect(".sv-popup--modal .sv-popup__container");
    const calcTop = Math.round((600 / 2 - popupClientRect.height / 2) * 10) / 10;
    const calcLeft = Math.round((800 / 2 - popupClientRect.width / 2) * 10) / 10;
    await t
      .expect(Math.abs(popupClientRect.left - calcLeft)).lte(0.1)
      .expect(Math.abs(popupClientRect.top - calcTop)).lte(0.1)

      .click(clickButton)
      .expect(popupModalSelector.visible).ok()

      .click(popupButtonSelector.withText("Cancel"))
      .expect(popupModalSelector.exists).notOk()

      .click(clickButton)
      .expect(popupModalSelector.visible).ok()

      .pressKey("esc")
      .expect(popupModalSelector.exists).notOk();
  });

  test("check focus trap", async t => {
    await initSurvey(framework, json, { onGetQuestionTitleActions: addModalPopupTitleAction });

    const inputInPopup = Selector(".sv-popup .sv_q_text_root");

    await t
      .click(Selector(".sv-action-bar-item"))
      .expect(inputInPopup.focused).ok({ timeout: 100 })
      .pressKey("tab")
      .expect(Selector(".sv-popup .sv_complete_btn").focused).ok()
      .pressKey("tab")
      .expect(popupButtonSelector.withText("Cancel").focused).ok()
      .pressKey("tab")
      .expect(popupButtonSelector.withText("Apply").focused).ok()
      .pressKey("tab")
      .expect(inputInPopup.focused).ok()
      .pressKey("shift+tab")
      .expect(popupButtonSelector.withText("Apply").focused).ok();
  });

  test("check focus safekeeping", async t => {
    await initSurvey(framework, json, { onGetQuestionTitleActions: addModalPopupTitleAction });

    const inputInPopup = Selector(".sv-popup .sv_q_text_root");

    await t
      .expect(clickButton.focused).notOk()

      .click(clickButton)
      .expect(popupModalSelector.visible).ok()
      .expect(inputInPopup.focused).ok({ timeout: 100 })

      .pressKey("esc")
      .expect(popupModalSelector.visible).notOk()
      .expect(clickButton.focused).ok({ timeout: 100 });
  });

  test("hide popup after scroll", async t => {
    let choices: Array<string> = [];
    for (let index = 0; index < 50; index++) {
      choices[index] = "item" + index;
    }

    let currentJson = { elements: [{ type: "checkbox", name: "Checks", title: "Checks", choices: choices }] };
    await initSurvey(framework, currentJson, { onGetQuestionTitleActions: addDropdownTitleAction });

    await t
      .expect(popupSelector.visible).notOk()

      .click(clickButton)
      .expect(popupSelector.visible).ok()

      .scroll(0, 1000)
      .expect(popupSelector.visible).notOk();
  });

  test("not hide modal popup after scroll", async t => {
    let choices:Array<string> = [];
    for (let index = 0; index < 50; index++) {
      choices[index] = "item" + index;
    }

    let currentJson = { elements: [{ type: "checkbox", name: "Checks", title: "Checks", choices: choices }] };
    await initSurvey(framework, currentJson, { onGetQuestionTitleActions: addModalPopupTitleAction });

    await t
      .expect(popupModalSelector.visible).notOk()

      .click(clickButton)
      .expect(popupModalSelector.visible).ok()

      .scroll(0, 1000)
      .expect(popupModalSelector.visible).ok();
  });

  test("navigate between list items", async t => {
    const currentAddDropdownTitleAction = (_, opt) => {
      let items: Array<any> = [];
      for (let index = 0; index < 10; index++) {
        items[index] = new window["Survey"].Action({ title: "item" + index });
      }
      const item = window["Survey"].createDropdownActionModel(
        { title: "Click", showTitle: true },
        { items: items }
      );
      opt.titleActions = [item];
    };
    let listItems = popupSelector.find(".sv-list__item");
    await initSurvey(framework, json, { onGetQuestionTitleActions: currentAddDropdownTitleAction });

    await t
      .click(clickButton)
      .expect(popupSelector.visible).ok()

      .expect(listItems.count).eql(10)
      .expect(listItems.nth(0).focused).ok()

      .pressKey("down down")
      .expect(listItems.nth(2).focused).ok()

      .pressKey("up up up")
      .expect(listItems.nth(9).focused).ok()

      .pressKey("tab tab")
      .expect(listItems.nth(1).focused).ok()

      .pressKey("shift+tab shift+tab")
      .expect(listItems.nth(9).focused).ok();
  });
  test("check popup on the same click", async t => {
    const currentAddDropdownTitleAction = (_, opt) => {
      let items: Array<any> = [];
      for (let index = 0; index < 20; index++) {
        items[index] = new window["Survey"].Action({ title: "item" + index });
      }
      const item = window["Survey"].createDropdownActionModel(
        { title: "Click", showTitle: true },
        { items: items }
      );
      opt.titleActions = [item];
    };
    const insertContainer = ClientFunction(() => {
      const container = document.createElement("div");
      container.style.height = "200px";
      const surveyEl = document.getElementById("surveyElement");
      surveyEl?.parentElement?.insertBefore(container, document.getElementById("surveyElement"));
    });
    const popupContainerSelector = Selector(".sv-popup__container");
    await insertContainer();
    await initSurvey(framework, json, { onGetQuestionTitleActions: currentAddDropdownTitleAction });
    await t
      .click(clickButton)
      .expect(popupSelector.visible).ok()
      .expect(popupContainerSelector.offsetHeight).eql(346)
      .click(clickButton)
      .expect(popupSelector.visible).notOk()
      .click(clickButton)
      .expect(popupSelector.visible).ok()
      .expect(popupContainerSelector.offsetHeight).eql(346);
  });
});