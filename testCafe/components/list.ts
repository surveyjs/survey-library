import { url, initSurvey, registerCustomToolboxComponent, frameworks } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "list";

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
  const item1 = window["Survey"].createDropdownActionModel({
    title: "Open popup",
    showTitle: true,
    action: () => { }
  }, { items: items }
  );
  const item2 = new window["Survey"].Action({
    title: "Set items",
    showTitle: true,
    action: () => {
      let items2 = [];
      for (let index = 0; index < 20; index++) {
        items2[index] = { title: "item" + index };
      }
      item1.data.setItems(items2);
    },
  });
  opt.titleActions = [item1, item2];
}

const clickButton = Selector(".sv-action").filterVisible();
const popupSelector = Selector(".sv-popup .sv-popup__container").filterVisible();
const visibleItems = Selector(".sv-list__item").filterVisible();
const listInput = popupSelector.find(".sv-list__input");
function getActionByText(text: string) {
  return Selector(".sv-action-bar-item__title").withText(text);
}

frameworks.forEach(async framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: "(function(){})()" }).beforeEach(async t => {
  });

  test("check custom markup in list behavior", async t => {
    await registerCustomToolboxComponent(framework);
    await initSurvey(framework, json, { onGetQuestionTitleActions: addTitleAction });
    await t
      .expect(Selector(".sv-popup__content .my-custom-action-class").withText("Custom Action 29").exists).ok();
  });

  function addDropdownAction(_, opt) {
    const getItems = (count: number, startIndex = 0) => {
      const list: Array<any> = [];
      for (let index = startIndex; index < count; index++) {
        list[index - startIndex] = new window["Survey"].Action({ id: index, title: "item" + index });
      }
      return list;
    };
    const dropdownWithSearchAction = window["Survey"].createDropdownActionModel(
      { title: "List", showTitle: true },
      { items: getItems(40), showPointer: true }
    );
    opt.titleActions = [dropdownWithSearchAction];
  }

  test("Dropdown popup styles", async (t) => {
    await initSurvey(framework, json, { onGetQuestionTitleActions: addDropdownAction });
    await t
      .wait(1000)
      .resizeWindow(1000, 600)
      .wait(1000)
      .click(clickButton.withText("List"))
      .expect(popupSelector.visible).ok()
      .expect(popupSelector.find("ul").visible).ok()
      .expect(popupSelector.find("ul").getStyleProperty("display")).eql("block")
      .expect(popupSelector.find(".sv-list__empty-container").visible).notOk()
      .expect(popupSelector.find(".sv-list__empty-container").getStyleProperty("display")).eql("none")

      .typeText(listInput, "a")
      .expect(popupSelector.find("ul").visible).notOk()
      .expect(popupSelector.find("ul").getStyleProperty("display")).eql("none")
      .expect(popupSelector.find(".sv-list__empty-container").visible).ok()
      .expect(popupSelector.find(".sv-list__empty-container").getStyleProperty("display")).eql("block");
  });
});

["knockout", "react"].forEach(async framework => {
  if (frameworks.indexOf(framework) === -1) return;

  fixture`${framework} ${title}`.page`${url}${framework}`.clientScripts({ content: "(function(){})()" }).beforeEach(async t => {
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

      .click(getActionByText("Open popup")) // close popup
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

      .click(getActionByText("Open popup")) // close popup
      .expect(popupSelector.exists).notOk()

      .click(getActionByText("Open popup"))
      .expect(popupSelector.exists).ok()
      .expect(listInput.value).eql("")
      .expect(visibleItems.count).eql(20);
  });
});