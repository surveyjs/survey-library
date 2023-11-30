import { frameworks, url, initSurvey, getListItemByText, applyTheme, url_test } from "../helper";
import { Selector } from "testcafe";
const title = "tagbox";

const questionOffsetTopConst = 176;

const jsonCloseOnSelectIsTrue = {
  focusFirstQuestionAutomatic: true,
  showQuestionNumbers: "off",
  questions: [
    {
      type: "tagbox",
      name: "question1",
      hasOther: "true",
      closeOnSelect: true,
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

const jsonCloseOnSelectIsDefault = {
  focusFirstQuestionAutomatic: true,
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
  fixture`${framework} ${title}`.page`${url}${framework}`;

  const questionTagbox = Selector(".sv_q_input.sv_q_tagbox");
  const questionValueInput = Selector(".sv_q_tagbox__value input");
  const questionHint = Selector(".sv_q_tagbox__hint");
  const deleteItemButton = Selector(".sv_q_tagbox-item_clean-button");
  const selectedItems = Selector(".sv-tagbox__item");
  const popupContainer = Selector(".sv-popup__container").filterVisible();

  const tagboxQuestion2 = Selector(".sd-tagbox").nth(1);

  test("tagbox editing", async (t) => {
    await initSurvey(framework, jsonCloseOnSelectIsTrue);
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

  test("tagbox selected list items", async (t) => {
    await initSurvey(framework, jsonCloseOnSelectIsDefault);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const selectedListItem = Selector(".sv-list__item--selected");

    await t
      .expect(popupContainer.visible).notOk()
      .click(questionTagbox)
      .expect(popupContainer.visible).ok()

      .click(getListItemByText("item1"))
      .click(getListItemByText("item2"))
      .click(getListItemByText("item3"))
      .expect(selectedItems.count).eql(3)
      .expect(selectedListItem.count).eql(3)
      .expect(selectedListItem.nth(0).textContent).contains("item1")
      .expect(selectedListItem.nth(1).textContent).contains("item2")
      .expect(selectedListItem.nth(2).textContent).contains("item3")

      .click(getListItemByText("item1"))
      .click(getListItemByText("item2"))
      .click(getListItemByText("item3"))
      .expect(selectedItems.count).eql(0)
      .expect(selectedListItem.count).eql(0)

      .click(getListItemByText("item1"))
      .click(getListItemByText("item2"))
      .click(getListItemByText("item3"))
      .expect(selectedItems.count).eql(3)
      .expect(selectedListItem.count).eql(3)
      .expect(selectedListItem.nth(0).textContent).contains("item1")
      .expect(selectedListItem.nth(1).textContent).contains("item2")
      .expect(selectedListItem.nth(2).textContent).contains("item3");
  });

  test("tagbox editing. CloseOnSelect is default", async (t) => {
    await initSurvey(framework, jsonCloseOnSelectIsDefault);
    await t
      .expect(selectedItems.count).eql(0)

      .click(questionTagbox)
      .click(getListItemByText("item20"))
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

    await initSurvey(framework, jsonCloseOnSelectIsTrue);
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
      .expect(questionHint.innerText).eql("item")
      .expect(questionValueInput.value).eql("14")
      .pressKey("tab")
      .expect(popupContainer.visible).notOk()
      .expect(questionHint.innerText).eql("")
      .expect(questionValueInput.value).eql("")
      .expect(selectedItems.count).eql(1)
      .expect(selectedItems.nth(0).textContent).contains("item23");
  });

  test("Check tagbox key press", async (t) => {
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");

    await initSurvey(framework, jsonCloseOnSelectIsTrue);
    await t
      .expect(popupContainer.visible).notOk()
      .expect(listItems.count).eql(28)
      .expect(listItems.filterVisible().count).eql(0)

      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(selectedItems.nth(0).textContent).contains("item4")

      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(selectedItems.nth(0).textContent).contains("item4")
      .expect(selectedItems.nth(1).textContent).contains("item7");
  });

  test("tagbox search. CloseOnSelect is default", async (t) => {
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");

    await initSurvey(framework, jsonCloseOnSelectIsDefault);
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
      .expect(popupContainer.visible).ok()

      .pressKey("2")
      .expect(popupContainer.visible).ok()
      .pressKey("down")
      .pressKey("down")
      .expect(listItems.filterVisible().count).eql(10)

      .pressKey("enter")
      .expect(selectedItems.count).eql(2)
      .expect(selectedItems.nth(0).textContent).contains("item23")
      .expect(selectedItems.nth(1).textContent).contains("item20")
      .expect(popupContainer.visible).ok()

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
      .expect(questionHint.innerText).eql("item")
      .expect(questionValueInput.value).eql("14")

      .pressKey("tab")
      .expect(questionHint.innerText).eql("")
      .expect(questionValueInput.value).eql("")
      .expect(popupContainer.visible).notOk()
      .expect(selectedItems.count).eql(1)
      .expect(selectedItems.nth(0).textContent).contains("item23");
  });

  test("Check tagbox key press. CloseOnSelect is default", async (t) => {
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const listItems = Selector(".sv-list__item");

    await initSurvey(framework, jsonCloseOnSelectIsDefault);
    await t
      .expect(popupContainer.visible).notOk()
      .expect(listItems.count).eql(28)
      .expect(listItems.filterVisible().count).eql(0)

      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(selectedItems.nth(0).textContent).contains("item4")

      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(selectedItems.nth(0).textContent).contains("item4")
      .expect(selectedItems.nth(1).textContent).contains("item7");
  });

  test("check tagbox after navigating between pages", async t => {
    const json = {
      "focusFirstQuestionAutomatic": false,
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "tagbox",
              "name": "question1",
              "choices": [
                1,
                2,
                3,
                4,
                5
              ]
            }
          ]
        },
        {
          "name": "page2",
          "elements": [
            {
              "type": "tagbox",
              "name": "question3",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ]
            }
          ]
        }
      ],
      "showCompletedPage": false,
      "showQuestionNumbers": "off",
      "showProgressBar": "top",
      "checkErrorsMode": "onComplete",
    };
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await initSurvey(framework, json);

    await t
      .expect(popupContainer.exists).notOk()

      .click(questionTagbox)
      .click(getListItemByText("3"))
      .pressKey("esc")
      .expect(popupContainer.exists).notOk()

      .click(".sv_next_btn")
      .click(".sv_prev_btn")
      .expect(popupContainer.exists).notOk()

      .click(questionTagbox)
      .expect(popupContainer.exists).ok()
      .pressKey("esc")
      .expect(selectedItems.count).eql(1)

      .click(".sv_q_dropdown_clean-button")
      .expect(selectedItems.count).eql(0);
  });

  test("Check default value", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          "type": "tagbox",
          "isRequired": true,
          "choicesByUrl": {
            "url": "http://127.0.0.1:8080/testCafe/countriesMock.json",
            path: "RestResponse;result",
            valueName: "name"
          },
          "name": "countries",
          "defaultValue": ["Cuba", "Romania"],
        }
      ],
    });
    await t
      .expect(selectedItems.count).eql(2)
      .expect(selectedItems.nth(0).textContent).contains("Cuba")
      .expect(selectedItems.nth(1).textContent).contains("Romania")

      .click(questionTagbox)
      .click(getListItemByText("United States"))
      .pressKey("esc")
      .expect(selectedItems.count).eql(3)
      .expect(selectedItems.nth(0).textContent).contains("Cuba")
      .expect(selectedItems.nth(1).textContent).contains("Romania")
      .expect(selectedItems.nth(2).textContent).contains("United States");
  });

  const theme = "defaultV2";

  function choicesLazyLoad(_, opt) {
    var getNumberArray = (skip = 1, count = 25) => {
      const result: Array<any> = [];
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

  test.page(`${url_test}${theme}/${framework}`)("Check popup height with lazy loading", async (t) => {
    await applyTheme(theme);
    const json = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "tagbox",
          name: "country",
          title: "Select the country...",
          closeOnSelect: true,
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
          closeOnSelect: true,
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

      .pressKey("down")
      .expect(tagbox1.find(".sv-list__empty-container").visible).ok()
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).eql(48)
      .expect(listItems.filterVisible().count).eql(0)

      .wait(500)
      .expect(tagbox1.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(tagbox1.find(".sv-list").scrollTop).eql(0)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(1208, 1308)
      .expect(listItems.filterVisible().count).eql(26)

      .scrollBy(tagbox1.find(".sv-list"), 0, 1000)
      .wait(500)
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(tagbox1.find(".sv-list").scrollTop).within(546, 556)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(2408, 2508)
      .expect(listItems.filterVisible().count).eql(51)

      .scrollBy(tagbox1.find(".sv-list"), 0, 2300)
      .wait(500)
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(tagbox1.find(".sv-list").scrollTop).within(1696, 1796)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(2608, 2708)
      .expect(listItems.filterVisible().count).eql(55)

      .click(getListItemByText("55"))
      .click(tagboxQuestion2)
      .expect(tagbox2.find(".sv-list__empty-container").visible).ok()
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).eql(48)
      .expect(listItems.filterVisible().count).eql(0)

      .wait(500)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(0)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(708, 718)
      .expect(tagbox2.find(".sv-list").scrollTop).eql(0)
      .expect(tagbox2.find(".sv-list").scrollHeight).within(1358, 1508)
      .expect(listItems.filterVisible().count).eql(31)

      .scrollBy(tagbox2.find(".sv-list"), 0, 1000)
      .wait(500)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(0)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(708, 718)
      .expect(tagbox2.find(".sv-list").scrollTop).within(746, 846)
      .expect(tagbox2.find(".sv-list").scrollHeight).within(2608, 2658)
      .expect(listItems.filterVisible().count).eql(55)
      .click(getListItemByText("55"))

      .resizeWindow(1280, 1100);
  });

  test.page(`${url_test}${theme}/${framework}`)("Check popup height and position while searching", async (t) => {
    await applyTheme(theme);
    const json = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "tagbox",
          name: "country",
          title: "Select the country...",
          closeOnSelect: true,
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
          closeOnSelect: true,
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
      .expect(tagbox1.offsetTop).eql(questionOffsetTopConst)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(475, 485)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)
      .expect(tagbox1.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox1.offsetTop).eql(questionOffsetTopConst)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).eql(48)

      .pressKey("enter")
      .expect(tagbox1.visible).notOk()

      .click(tagboxQuestion2)
      .pressKey("2")
      .expect(tagbox2.visible).ok()
      .expect(listItems.filterVisible().count).eql(10)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).within(228, 238)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(470, 480)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(768)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).eql(48)

      .pressKey("enter")
      .expect(tagbox2.visible).notOk()

      .resizeWindow(1280, 1100);
  });

  test.page(`${url_test}${theme}/${framework}`)("Check popup height with lazy loading, if closeOnSelect is false", async (t) => {
    await applyTheme(theme);
    const json = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "tagbox",
          name: "country",
          title: "Select the country...",
          closeOnSelect: false,
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
          closeOnSelect: false,
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

      .pressKey("down")
      .expect(tagbox1.find(".sv-list__empty-container").visible).ok()
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).eql(48)
      .expect(listItems.filterVisible().count).eql(0)

      .wait(500)
      .expect(tagbox1.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(tagbox1.find(".sv-list").scrollTop).eql(0)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(1208, 1308)
      .expect(listItems.filterVisible().count).eql(26)

      .scrollBy(tagbox1.find(".sv-list"), 0, 1000)
      .wait(500)
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(tagbox1.find(".sv-list").scrollTop).within(546, 556)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(2408, 2508)
      .expect(listItems.filterVisible().count).eql(51)

      .scrollBy(tagbox1.find(".sv-list"), 0, 2300)
      .wait(500)
      .expect(tagbox1.offsetTop).lt(200)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(688, 708)
      .expect(tagbox1.find(".sv-list").scrollTop).within(1696, 1796)
      .expect(tagbox1.find(".sv-list").scrollHeight).within(2608, 2708)
      .expect(listItems.filterVisible().count).eql(55)

      .click(getListItemByText("55"))
      .pressKey("esc")
      .click(tagboxQuestion2)
      .expect(tagbox2.find(".sv-list__empty-container").visible).ok()
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).eql(48)
      .expect(listItems.filterVisible().count).eql(0)

      .wait(500)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(0)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(708, 718)
      .expect(tagbox2.find(".sv-list").scrollTop).eql(0)
      .expect(tagbox2.find(".sv-list").scrollHeight).within(1358, 1508)
      .expect(listItems.filterVisible().count).eql(31)

      .scrollBy(tagbox2.find(".sv-list"), 0, 1000)
      .wait(500)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(0)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(708, 718)
      .expect(tagbox2.find(".sv-list").scrollTop).within(746, 846)
      .expect(tagbox2.find(".sv-list").scrollHeight).within(2608, 2658)
      .expect(listItems.filterVisible().count).eql(55)
      .click(getListItemByText("55"))

      .resizeWindow(1280, 1100);
  });

  test.page(`${url_test}${theme}/${framework}`)("Check popup height and position while searching, if closeOnSelect is false", async (t) => {
    await applyTheme(theme);
    const json = {
      focusFirstQuestionAutomatic: true,
      questions: [
        {
          type: "tagbox",
          name: "country",
          title: "Select the country...",
          closeOnSelect: false,
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
          closeOnSelect: false,
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
      .expect(tagbox1.offsetTop).eql(questionOffsetTopConst)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).within(475, 485)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)
      .expect(tagbox1.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox1.offsetTop).eql(questionOffsetTopConst)
      .expect(tagbox1.find(".sv-popup__scrolling-content").offsetHeight).eql(48)

      .pressKey("enter")
      .pressKey("esc")
      .expect(tagbox1.visible).notOk()

      .click(tagboxQuestion2)
      .pressKey("2")
      .expect(tagbox2.visible).ok()
      .expect(listItems.filterVisible().count).eql(10)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).within(222, 232)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).within(470, 480)

      .pressKey("3")
      .expect(listItems.filterVisible().count).eql(1)
      .expect(tagbox2.find(".sv-list__empty-container").visible).notOk()
      .expect(tagbox2.offsetTop).eql(768)
      .expect(tagbox2.find(".sv-popup__scrolling-content").offsetHeight).eql(48)

      .pressKey("enter")
      .expect(tagbox2.visible).ok()

      .resizeWindow(1280, 1100);
  });

  test.page(`${url_test}${theme}/${framework}`)("Check tagbox popup opens after beak click", async (t) => {
    await t.resizeWindow(800, 600);
    const jsonWithDropDown = {
      questions: [
        {
          type: "tagbox",
          name: "cars",
          title: "Tagbox",
          searchEnabled: false,
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    const questionDropdownV2Select = Selector(".sd-dropdown");
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const dropdownWidth = await questionDropdownV2Select.getBoundingClientRectProperty("width");
    await t
      .expect(dropdownWidth).gt(550)
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).ok()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).ok()

      .click("body", { offsetX: 600, offsetY: 20 })
      .expect(popupContainer.visible).notOk();
  });

  test.page(`${url_test}${theme}/${framework}`)("Check tagbox popup opens after beak click - search enabled", async (t) => {
    await t.resizeWindow(800, 600);
    const jsonWithDropDown = {
      questions: [
        {
          type: "tagbox",
          name: "cars",
          title: "Tagbox",
          choices: [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, jsonWithDropDown);

    const questionDropdownV2Select = Selector(".sd-dropdown");
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const dropdownWidth = await questionDropdownV2Select.getBoundingClientRectProperty("width");
    await t
      .expect(dropdownWidth).gt(550)
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).ok()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownV2Select, { offsetX: dropdownWidth - 20, offsetY: 20 })
      .expect(popupContainer.visible).ok()

      .click("body", { offsetX: 600, offsetY: 20 })
      .expect(popupContainer.visible).notOk();
  });
});