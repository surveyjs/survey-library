import { url, initSurvey, registerCustomToolboxComponent, frameworks } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "list";

const explicitErrorHandler = () => {
  window.addEventListener("error", e => {
    if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded") {
      e.stopImmediatePropagation();
    }
  });
};

const json = {
  elements: [
    {
      type: "text",
      name: "actions_question"
    }
  ]
};

const disposeSurvey = ClientFunction(framework => {
  window["survey"].dispose();
  if (framework === "react") {
    window["ReactDOM"].unmountComponentAtNode(document.getElementById("surveyElement"));
  }
});

function addTitleAction(_, opt) {
  for (var i = 0; i < 30; i++) {
    opt.titleActions.push({
      title: "Custom Action " + i,
      component: "svc-custom-action",
      action: () => {
      }
    });
  }
}

function addTitleActions2(_, opt) {
  if (opt.question.name == "text") {
    let items = [];
    for (let index = 0; index < 20; index++) {
      items[index] = new window["Survey"].Action({ title: "item" + index });
    }
    const itemPopupModel = new window["Survey"].PopupModel("sv-list", {
      model: new window["Survey"].ListModel(items)
    });

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
  } else {
    let items = [];
    for (let index = 0; index < 5; index++) {
      items[index] = new window["Survey"].Action({ title: "item" + index });
    }
    const itemPopupModel = new window["Survey"].PopupModel("sv-list", {
      model: new window["Survey"].ListModel(items)
    });

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
}

const popupSelector = Selector(".sv-popup").filterVisible();
const visibleItems = Selector(".sv-list__item").filterVisible();
const listInput = popupSelector.find(".sv-list__input");
const titleActions = Selector(".sv-title-actions .sv-action").filterVisible();

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: `(${explicitErrorHandler.toString()})()` }).beforeEach(async t => {
  });

  test.skip("check custom markup in list behavior", async t => {
    await registerCustomToolboxComponent(framework);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addTitleAction });
    await t
      .expect(Selector(".sv-popup__content .my-custom-action-class").withText("Custom Action 29").exists).ok();
  });

  test("check list filter", async t => {

    await initSurvey(framework, {
      questions: [
        {
          name: "text",
          type: "text",
          title: "Title here"
        },
        {
          name: "text2",
          type: "text",
          title: "Title here 2"
        }
      ]
    }, { onGetQuestionTitleActions: addTitleActions2 });
    await t
      .expect(Selector(".sv-popup__content .sv-list__item").withText("item19").exists).ok()
      .expect(popupSelector.exists).notOk()

      .click(titleActions)
      .expect(popupSelector.exists).ok()
      .expect(listInput.visible).ok()
      .expect(listInput.value).eql("")
      .expect(visibleItems.count).eql(20)

      .typeText(listInput, "8")
      .expect(visibleItems.count).eql(2)

      .selectText(listInput).pressKey("delete")
      .expect(listInput.value).eql("")
      .expect(visibleItems.count).eql(20)

      .typeText(listInput, "1")
      .expect(visibleItems.count).eql(11)

      .click(titleActions.nth(1)) // close first popup
      .expect(popupSelector.exists).notOk()

      .click(titleActions.nth(1))
      .expect(popupSelector.exists).ok()
      .expect(listInput.visible).notOk()
      .expect(visibleItems.count).eql(5)

      .click(titleActions) // close second popup
      .expect(popupSelector.exists).notOk()

      .click(titleActions)
      .expect(popupSelector.exists).ok()
      .expect(listInput.value).eql("")
      .expect(visibleItems.count).eql(20);
  });
});