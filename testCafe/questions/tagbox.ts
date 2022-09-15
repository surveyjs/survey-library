import { frameworks, url, initSurvey, getListItemByText } from "../helper";
import { Selector } from "testcafe";
const title = "tagbox";

const json = {
  showQuestionNumbers: "off",
  questions: [
    {
      type: "tagbox",
      name: "question1",
      hasOther: "true",
      choices: [
        "item1",
        "item2",
        "item3",
        "item4",
        "item5",
        "item6",
        "item7",
        "item8",
        "item9",
        "item10",
        "item11",
        "item12",
        "item13",
        "item14",
        "item15",
        "item16",
        "item17",
        "item18",
        "item19",
        "item20",
        "item21",
        "item22",
        "item23",
        "item24",
        "item25",
        "item26",
        "item27"
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`;

  const questionTagbox = Selector(".sv_q_input.sv_q_tagbox");
  const deleteItemButton = Selector(".sv_q_tagbox-item_clean-button");
  const selectedItems = Selector(".sv-tagbox__item");
  const popupContainer = Selector(".sv-popup__container").filterVisible();

  test("tagbox editing", async (t) => {
    await initSurvey(framework, json);
    await t
      .expect(selectedItems.count).eql(0)

      .click(questionTagbox)
      .click(getListItemByText("item20"))
      .click(questionTagbox)
      .click(getListItemByText("item10"))
      .pressKey("esc")
      .expect(selectedItems.count).eql(2)
      .expect(selectedItems.nth(0).textContent).contains("item20")
      .expect(selectedItems.nth(1).textContent).contains("item10")

      .hover(selectedItems)
      .click(deleteItemButton)
      .expect(selectedItems.count).eql(1)
      .expect(selectedItems.nth(0).textContent).contains("item10")

      .hover(selectedItems)
      .click(deleteItemButton)
      .expect(selectedItems.count).eql(0);
  });

  test("tagbox popup position recalculate", async (t) => {
    await initSurvey(framework, {
      showQuestionNumbers: "off",
      questions: [
        {
          type: "tagbox",
          name: "question1",
          hasOther: "true",
          closeOnSelect: "false",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6",
            "item7",
            "item8",
            "item9",
            "item10",
            "item11",
            "item12",
            "item13",
            "item14",
            "item15",
            "item16",
            "item17",
            "item18",
            "item19",
            "item20",
            "item21",
            "item22",
            "item23",
            "item24",
            "item25",
            "item26",
            "item27"
          ]
        }
      ]
    });

    const constant = 100;
    await t
      .resizeWindow(800, 600)
      .expect(selectedItems.count).eql(0)

      .click(questionTagbox)
      .expect(popupContainer.offsetTop).lte(constant);

    for (let i = 1; i < 27; i++) {
      await t.click(getListItemByText("item" + i.toString()));
    }

    await t
      .expect(selectedItems.count).eql(26)
      .expect(popupContainer.offsetTop).gt(constant)
      .resizeWindow(1920, 1080);
  });

  test("tagbox search", async (t) => {
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");

    await initSurvey(framework, json);
    await t
      .expect(popupContainer.visible).notOk()
      .expect(listItems.count).eql(28)
      .expect(listItems.filterVisible().count).eql(0)

      .pressKey("2")
      .expect(popupContainer.visible).ok()
      .expect(listItems.filterVisible().count).eql(10)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)

      .pressKey("enter")
      .expect(selectedItems.count).eql(1)
      .expect(selectedItems.nth(0).textContent).contains("item23")
      .expect(popupContainer.visible).notOk()

      .pressKey("2")
      .expect(popupContainer.visible).ok()
      .pressKey("down")
      .pressKey("down")
      .expect(listItems.filterVisible().count).eql(10)

      .pressKey("enter")
      .expect(selectedItems.count).eql(2)
      .expect(selectedItems.nth(0).textContent).contains("item23")
      .expect(selectedItems.nth(1).textContent).contains("item20")
      .expect(popupContainer.visible).notOk()

      .pressKey("4")
      .pressKey("5")
      .pressKey("backspace")
      .pressKey("backspace")
      .pressKey("backspace")
      .expect(selectedItems.count).eql(1)
      .expect(selectedItems.nth(0).textContent).contains("item23")
      .expect(popupContainer.visible).notOk()

      .pressKey("enter")
      .expect(popupContainer.visible).ok()

      .pressKey("tab")
      .expect(popupContainer.visible).notOk()
      .expect(selectedItems.count).eql(1)
      .expect(selectedItems.nth(0).textContent).contains("item23");
  });

  test("Check tagbox key press", async (t) => {
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");

    await initSurvey(framework, json);
    await t
      .expect(popupContainer.visible).notOk()
      .expect(listItems.count).eql(28)
      .expect(listItems.filterVisible().count).eql(0)

      .pressKey("enter")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("space")
      .expect(selectedItems.nth(0).textContent).contains("item4")

      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("space")
      .expect(selectedItems.nth(0).textContent).contains("item4")
      .expect(selectedItems.nth(1).textContent).contains("item7");
  });
});