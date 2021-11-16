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
  let items = [];
  for (let index = 0; index < 10; index++) {
    items[index] = new window["Survey"].Action({ title: "item" + index });
  }
  const list = new window["Survey"].ListModel(items);
  const itemPopupModel = new window["Survey"].PopupModel("sv-list", {
    model: list
  });

  const item1 = new window["Survey"].Action({
    component: "sv-action-bar-item-dropdown",
    title: "Open popup",
    showTitle: true,
    action: () => {
      itemPopupModel.toggleVisibility();
    },
    popupModel: itemPopupModel
  });
  const item2 = new window["Survey"].Action({
    title: "Set items",
    showTitle: true,
    action: () => {
      let items2 = [];
      for (let index = 0; index < 20; index++) {
        items2[index] = { title: "item" + index };
      }
      list.setItems(items2);
    },
  });
  opt.titleActions = [item1, item2];
}

const popupSelector = Selector(".sv-popup").filterVisible();
const visibleItems = Selector(".sv-list__item").filterVisible();
const listInput = popupSelector.find(".sv-list__input");
function getActionByText(text: string) {
  return Selector(".sv-action-bar-item__title").withText(text);
}

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: `(${explicitErrorHandler.toString()})()` }).beforeEach(async t => {
  });

  test("check custom markup in list behavior", async t => {
    await registerCustomToolboxComponent(framework);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addTitleAction });
    await t
      .expect(Selector(".sv-popup__content .my-custom-action-class").withText("Custom Action 29").exists).ok();
  });
});

["knockout", "react"].forEach(async framework => {
  if (frameworks.indexOf(framework) === -1) return;

  fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: `(${explicitErrorHandler.toString()})()` }).beforeEach(async t => {
  });

  test("check list filter", async t => {

    await initSurvey(framework, {
      questions: [
        {
          name: "text",
          type: "text",
          title: "Title here"
        }
      ]
    }, { onGetQuestionTitleActions: addTitleActions2 });
    await t
      .expect(popupSelector.exists).notOk()

      .click(getActionByText("Open popup"))
      .expect(popupSelector.exists).ok()
      .expect(listInput.exists).notOk()
      .expect(visibleItems.count).eql(10)

      .click(getActionByText("Set items")) // close popup
      .click(getActionByText("Set items"))
      .click(getActionByText("Open popup"))
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

      .click(getActionByText("Set items")) // close popup
      .expect(popupSelector.exists).notOk()

      .click(getActionByText("Open popup"))
      .expect(popupSelector.exists).ok()
      .expect(listInput.value).eql("")
      .expect(visibleItems.count).eql(20);
  });
});