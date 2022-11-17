import { frameworks, url, initSurvey, getListItemByText, applyTheme, url_test } from "../helper";
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

    await t
      .resizeWindow(800, 600)
      .expect(selectedItems.count).eql(0)

      .click(questionTagbox)
      .expect(popupContainer.offsetTop).within(70, 100);

    for (let i = 1; i < 27; i++) {
      await t.click(getListItemByText("item" + i.toString()));
    }

    await t
      .expect(selectedItems.count).eql(26)
      .expect(popupContainer.offsetTop).within(120, 240)
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
      .expect(popupContainer.visible).ok()

      .pressKey("esc")
      .expect(popupContainer.visible).notOk()
      .expect(selectedItems.count).eql(1)
      .expect(selectedItems.nth(0).textContent).contains("item23")

      .pressKey("1")
      .pressKey("4")
      .pressKey("tab")
      .expect(popupContainer.visible).notOk()
      .expect(selectedItems.count).eql(2)
      .expect(selectedItems.nth(0).textContent).contains("item23")
      .expect(selectedItems.nth(1).textContent).contains("item14");
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

  const theme = "defaultV2";

  function choicesLazyLoad(_, opt) {
    var getNumberArray = (skip = 1, count = 25) => {
      const result = [];
      for(let index = skip; index < (skip + count); index++) {
        result.push(index);
      }
      return result;
    };

    const total = 55;
    setTimeout(() => {
      if(opt.skip + opt.take < total) {
        opt.setItems(getNumberArray(opt.skip + 1, opt.take), total);
      } else {
        opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip), total);
      }
    }, 500);
  }

  test.page(`${url_test}${theme}/${framework}.html`)("Check popup height with lazy loading", async (t) => {
    await applyTheme(theme);
    const json = {
      questions: [
        {
          type: "tagbox",
          name: "country",
          title: "Select the country...",
          choicesLazyLoadEnabled: true
        }, {
          type: "checkbox",
          name: "question1",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6"
          ]
        }, {
          type: "tagbox",
          name: "kids",
          title: "tagbox page 30",
          choicesLazyLoadEnabled: true,
          choicesLazyLoadPageSize: 30
        }
      ]
    };
    await initSurvey(framework, json, { onChoicesLazyLoad: choicesLazyLoad });
    const popupContainer = Selector(".sv-popup__container");
    const tagbox1 = popupContainer.nth(0);
    const tagbox2 = popupContainer.nth(1);
    const listItems = Selector(".sv-list__item span");

    await t
      .resizeWindow(1280, 900)

      .pressKey("enter")
      .expect(tagbox1.find(".sv-list__empty-container").visible).ok()
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).eql(48)
      .expect(listItems.filterVisible().count).eql(0)

      .wait(500)
      .expect(tagbox1.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(680, 700)
      .expect(tagbox1.find(".sv-list").scrollTop).eql(0)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(1100, 1200)
      .expect(listItems.filterVisible().count).eql(26)

      .scrollBy(tagbox1.find(".sv-list"), 0, 1000)
      .wait(500)
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(680, 700)
      .expect(tagbox1.find(".sv-list").scrollTop).within(400, 550)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(2300, 2400)
      .expect(listItems.filterVisible().count).eql(51)

      .scrollBy(tagbox1.find(".sv-list"), 0, 2300)
      .wait(500)
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(680, 700)
      .expect(tagbox1.find(".sv-list").scrollTop).within(1600, 1700)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(2500, 2600)
      .expect(listItems.filterVisible().count).eql(55)

      .click(getListItemByText("55"))
      .click(Selector(".sd-tagbox").nth(1))
      .expect(tagbox2.find(".sv-list__empty-container").visible).ok()
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).eql(48)
      .expect(listItems.filterVisible().count).eql(0)

      .wait(500)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(0)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(700, 720)
      .expect(tagbox2.find(".sv-list").scrollTop).eql(0)
      .expect(tagbox2.find(".sv-list").scrollHeight).within(1350, 1500)
      .expect(listItems.filterVisible().count).eql(31)

      .scrollBy(tagbox2.find(".sv-list"), 0, 1000)
      .wait(500)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(0)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(700, 720)
      .expect(tagbox2.find(".sv-list").scrollTop).within(650, 750)
      .expect(tagbox2.find(".sv-list").scrollHeight).within(2500, 2530)
      .expect(listItems.filterVisible().count).eql(55)
      .click(getListItemByText("55"))

      .resizeWindow(1280, 1100);
  });

  test.page(`${url_test}${theme}/${framework}.html`)("Check popup height and position while searching", async (t) => {
    await applyTheme(theme);
    const json = {
      questions: [
        {
          type: "tagbox",
          name: "country",
          title: "Select the country...",
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
        }, {
          type: "checkbox",
          name: "question1",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4",
            "item5",
            "item6"
          ]
        }, {
          type: "tagbox",
          name: "kids",
          title: "tagbox page 30",
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
    await initSurvey(framework, json);
    const popupContainer = Selector(".sv-popup__container");
    const tagbox1 = popupContainer.nth(0);
    const tagbox2 = popupContainer.nth(1);
    const listItems = Selector(".sv-list__item span");

    await t
      .resizeWindow(1280, 900)

      .pressKey("2")
      .expect(tagbox1.visible).ok()
      .expect(listItems.filterVisible().count).eql(10)
      .expect(tagbox1.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox1.offsetTop).eql(184)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(450, 460)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)
      .expect(tagbox1.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox1.offsetTop).eql(184)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).eql(46)

      .pressKey("enter")
      .expect(tagbox1.visible).notOk()

      .click(Selector(".sd-tagbox").nth(1))
      .pressKey("2")
      .expect(tagbox2.visible).ok()
      .expect(listItems.filterVisible().count).eql(10)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).within(250, 260)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(450, 460)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(776)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).eql(46)

      .pressKey("enter")
      .expect(tagbox2.visible).notOk()

      .resizeWindow(1280, 1100);
  });
});