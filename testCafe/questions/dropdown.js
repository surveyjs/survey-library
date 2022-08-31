import { frameworks, url, url_test, applyTheme, setOptions, getListItemByText, completeButton, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion, registerCustomItemComponent } from "../helper";
import { Selector, fixture, test, ClientFunction } from "testcafe";
const title = "dropdown";

const questionDropdownSelect = Selector(".sv_q_dropdown_control");
const listItems = Selector(".sv-list__item span");
const questionValueText = Selector(".sv_q_dropdown__value input");

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      const json = {
        questions: [
          {
            type: "dropdown",
            name: "car",
            title: "What car are you driving?",
            isRequired: true,
            colCount: 0,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen",
            ],
          },
          {
            type: "dropdown",
            name: "renderAsSelect",
            renderAs: "select",
            title: "What car are you driving?",
            colCount: 0,
            choices: [
              "None",
              "Ford",
              "Vauxhall",
              "Volkswagen",
              "Nissan",
              "Audi",
              "Mercedes-Benz",
              "BMW",
              "Peugeot",
              "Toyota",
              "Citroen",
            ],
          },
        ],
      };

      await initSurvey(framework, json);
    }
  );

  test("choose empty", async (t) => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async (t) => {
    let surveyResult;

    await t
      .click(questionDropdownSelect)
      .click(getListItemByText("Nissan"))
      .click(completeButton);

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql("Nissan");
  });

  test("change choices order render as select", async (t) => {
    const questionName = "renderAsSelect";
    const getFirst = Selector("select option").nth(1);
    const getSecond = Selector("select option").nth(2);
    let rnd_count = 0;
    let first, first_2;

    // asc
    await setOptions(questionName, { choicesOrder: "asc" });
    await t
      .expect(getFirst.textContent).eql("Audi")
      .expect(getSecond.textContent).eql("BMW");

    // desc
    await setOptions(questionName, { choicesOrder: "desc" });
    await t
      .expect(getFirst.textContent).eql("Volkswagen")
      .expect(getSecond.textContent).eql("Vauxhall");

    // rnd
    await t.expect(Selector("select option").count).notEql(1); // "need to more than one choices"

    first = await getFirst();
    for (let i = 0; i < 15; i++) {
      await setOptions(questionName, { choicesOrder: "asc" });
      await setOptions(questionName, { choicesOrder: "random" });
      first_2 = await getFirst();

      if (first.textContent.trim() !== first_2.textContent.trim()) {
        rnd_count++;
      }

      first = first_2;

      if (rnd_count >= 4) {
        break;
      }
    }

    await t.expect(rnd_count).gte(4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
  });

  test("change choices order", async (t) => {
    const firstItem = listItems.nth(0).textContent;
    const secondItem = listItems.nth(1).textContent;

    // asc
    await setOptions("car", { choicesOrder: "asc" });
    await t
      .click(questionDropdownSelect)
      .expect(firstItem).eql("Audi")
      .expect(secondItem).eql("BMW");

    // desc
    await setOptions("car", { choicesOrder: "desc" });
    await t
      .expect(firstItem).eql("Volkswagen")
      .expect(secondItem).eql("Vauxhall");

    // rnd
    await t.expect(listItems.count).notEql(1); // "need to more than one choices"

    let rnd_count = 0;
    let prevFirstItemValue = await listItems.nth(0).textContent;
    let firstItemValueCurrent;
    for (let i = 0; i < 15; i++) {
      await setOptions("car", { choicesOrder: "asc" });
      await setOptions("car", { choicesOrder: "random" });
      firstItemValueCurrent = await listItems.nth(0).textContent;

      if (prevFirstItemValue.trim() !== firstItemValueCurrent.trim()) {
        rnd_count++;
      }

      prevFirstItemValue = firstItemValueCurrent;

      if (rnd_count >= 4) {
        break;
      }
    }

    await t.expect(rnd_count).gte(4); // because of 'none', 'asc', 'desc' and if 4 it is really rnd
  });

  test("check integrity", async (t) => {
    const choices = [
      "None",
      "Ford",
      "Vauxhall",
      "Volkswagen",
      "Nissan",
      "Audi",
      "Mercedes-Benz",
      "BMW",
      "Peugeot",
      "Toyota",
      "Citroen",
    ];
    let checkIntegrity = async (t) => {
      await t.expect(listItems.count).eql(choices.length);
      for (let i = 0; i < choices.length; i++) {
        await t
          .click(questionDropdownSelect)
          .click(listItems.nth(i));
      }
    };

    await setOptions("car", { choicesOrder: "asc" });
    await checkIntegrity(t);

    await setOptions("car", { choicesOrder: "desc" });
    await checkIntegrity(t);

    await setOptions("car", { choicesOrder: "random" });
    await checkIntegrity(t);
  });

  test("show \"other\" choice", async (t) => {
    await t
      .click(questionDropdownSelect)
      .expect(listItems.count).eql(11);

    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(questionDropdownSelect)
      .expect(listItems.count).eql(12)
      .expect(listItems.nth(11).textContent).contains("Other");
  });

  test("check \"other\" choice doesn't change order", async (t) => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(questionDropdownSelect)
      .expect(listItems.nth(11).textContent).eql("Other");

    await setOptions("car", { choicesOrder: "desc" });
    await t.expect(listItems.nth(11).textContent).eql("Other");
  });

  test("choose other", async (t) => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(questionDropdownSelect)
      .click(getListItemByText("Other"))
      .typeText(Selector("textarea"), "Zaporozec")
      .click(completeButton);

    let surveyResult = await getSurveyResult();
    await t
      .expect(surveyResult.car).eql("other")
      .expect(surveyResult["car-Comment"]).eql("Zaporozec");
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`;

  test("click on question title state editable", async (t) => {
    const json = {
      questions: [
        {
          type: "dropdown",
          name: "car",
          title: "What car are you driving?",
          isRequired: true,
          colCount: 0,
          choices: [
            "None",
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen",
          ],
        },
      ],
    };
    await initSurvey(framework, json, undefined, true);

    const newTitle = "MyText";
    let questionJson = JSON.parse(await getQuestionJson());
    let questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    const outerSelector = ".sv_q_title";
    const innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    questionValue = await getQuestionValue();
    await t.expect(questionValue).eql(undefined);

    questionJson = JSON.parse(await getQuestionJson());
    await t.expect(questionJson.title).eql(newTitle);
  });

  test("otherText changed", async t => {
    const currentJson = {
      title: "Survey New Design Test",
      description: "Survey Description",
      logoPosition: "left",
      questions: [
        {
          type: "dropdown",
          renderAs: "select",
          name: "car",
          title: "Dropdown",
          hasOther: true,
          showOptionsCaption: false,
          colCount: 4,
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
        },
        {
          type: "dropdown",
          name: "carss",
          title: "Dropdown render as",
          hasOther: true,
          colCount: 4,
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
        },
      ]
    };
    const oldOtherText = "Other (describe)";
    const newOtherText = "New Other";
    const questionDropdownSelect = Selector(".sv_q_dropdown_control");
    await initSurvey(framework, currentJson);

    await t.expect(Selector("select option").nth(10).textContent).eql(oldOtherText);
    await setOptions("car", { otherText: newOtherText });
    await t.expect(Selector("select option").nth(10).textContent).eql(newOtherText);

    await t
      .click(questionDropdownSelect.nth(1))
      .expect(Selector(".sv-list__item span").nth(10).textContent).eql(oldOtherText);
    await setOptions("carss", { otherText: newOtherText });
    await t
      .click(questionDropdownSelect.nth(1))
      .expect(Selector(".sv-list__item span").nth(10).textContent).eql(newOtherText);
  });
  test("Check dropdown popup width", async (t) => {
    await t.resizeWindow(1280, 1100);
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
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

    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await t
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownSelect)
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetWidth).gte(900)

      .click(Selector(".sv-list__item span").withText("Ford").filterVisible())
      .expect(popupContainer.visible).notOk()

      .click(questionValueText)
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetWidth).gte(900);
  });

  test("Check dropdown disabled items", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          renderAs: "select",
          name: "cars",
          title: "Dropdown",
          isRequired: true,
          hasNone: true,
          colCount: 4,
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
        },
        {
          type: "dropdown",
          name: "DropdownRenderAsSelect",
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
    await initSurvey(framework, jsonWithDropDown);

    await ClientFunction(() => {
      const updateChoiceEnabled = (_, opt) => {
        opt.choices.forEach((ch, index) => { ch.setIsEnabled(index % 2 === 0); });
      };

      const oldDropdown = window["survey"].getQuestionByName("cars");
      oldDropdown.onOpened.add(updateChoiceEnabled);

      const selectQuestion = window["survey"].getQuestionByName("DropdownRenderAsSelect");
      selectQuestion.onOpened.add(updateChoiceEnabled);
    })();

    await t
      .expect(Selector("option[value=Vauxhall]").hasAttribute("disabled")).notOk()
      .click("select")
      .expect(Selector("option[value=Vauxhall]").hasAttribute("disabled")).ok()
      .click("option[value=Volkswagen]")

      .click("select")
      .expect(Selector("option[value=Vauxhall]").hasAttribute("disabled")).ok();

    const questionDropdownSelect = Selector(".sv_q_dropdown_control").nth(1);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await t
      .click(questionDropdownSelect)
      .expect(Selector(".sv-list__item").count).eql(28)
      .expect(Selector(".sv-list__item.sv-list__item--disabled").count).eql(13)
      .click(Selector(".sv-list__item span").withText("item2").filterVisible())
      .expect(popupContainer.visible).ok()
      .click(Selector(".sv-list__item span").withText("item3").filterVisible())
      .expect(popupContainer.visible).notOk();
  });

  test("Check dropdown clear button", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
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

    const clearButton = Selector(".sv_q_dropdown_clean-button");
    await t
      .expect(clearButton.exists).ok()
      .expect(clearButton.visible).notOk()

      .click(questionDropdownSelect)
      .click(Selector(".sv-list__item span").withText("Ford").filterVisible())

      .expect(clearButton.visible).ok()

      .click(clearButton)
      .expect(clearButton.exists).ok()
      .expect(clearButton.visible).notOk();
  });

  test("Check dropdown item template", async (t) => {
    await registerCustomItemComponent(framework);

    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          itemComponent: "new-item",
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

    const myListItems = Selector(".my-list-item");
    await t
      .expect(questionValueText.getAttribute("placeholder")).eql("Select...")

      .click(questionDropdownSelect)
      .expect(myListItems.count).eql(10)
      .expect(myListItems.find(".sv-svg-icon").count).eql(10)

      .click(myListItems.nth(3))

      .expect(questionValueText.getAttribute("placeholder")).eql("Nissan");
  });

  test("Check dropdown key press", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          colCount: 0,
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
        },
        {
          type: "dropdown",
          name: "DropdownRenderAsSelect",
          colCount: 0,
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
    await initSurvey(framework, jsonWithDropDown);

    await t
      .pressKey("enter")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueText.getAttribute("placeholder")).eql("Nissan")

      .pressKey("tab enter")
      .pressKey("2")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(questionValueText.nth(1).getAttribute("placeholder")).eql("item20");
  });

  test("Check dropdown clear value by keyboard", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          defaultValue: "Volkswagen",
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
        },
        {
          type: "dropdown",
          renderAs: "select",
          name: "DropdownRenderAsSelect",
          defaultValue: "Mercedes-Benz",
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
    const newDropdown = questionValueText;
    const oldDropdown = Selector(".sv_q_dropdown_control").nth(1);
    await initSurvey(framework, jsonWithDropDown);

    await t
      .expect(newDropdown.getAttribute("placeholder")).eql("Volkswagen")
      .expect(oldDropdown.value).eql("Mercedes-Benz")

      .pressKey("delete")
      .expect(newDropdown.getAttribute("placeholder")).eql("Select...")
      .expect(oldDropdown.value).eql("Mercedes-Benz")

      .pressKey("tab")
      .pressKey("delete")
      .expect(newDropdown.getAttribute("placeholder")).eql("Select...")
      .expect(oldDropdown.value).eql("");
  });

  const theme = "defaultV2";
  test.page(`${url_test}${theme}/${framework}.html`)("Check rating as dropdown", async (t) => {
    await applyTheme(theme);

    const jsonWithDropDown = {
      questions: [
        {
          name: "name",
          type: "rating",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "dropdown",
        }
      ]
    };
    const ratingAsDropdownPlaceHolder = "Tap to rate here...";
    const ratingAsDropdown = Selector(".sd-dropdown .sd-dropdown__value");
    await initSurvey(framework, jsonWithDropDown);

    await t
      .click(ratingAsDropdown)
      .click(getListItemByText("2"))
      .expect(ratingAsDropdown.getAttribute("placeholder")).contains("2")

      .pressKey("delete")
      .expect(ratingAsDropdown.getAttribute("placeholder")).contains(ratingAsDropdownPlaceHolder);
  });
  test.page(`${url_test}${theme}/${framework}.html`)("Check dropdown popup width", async (t) => {
    await applyTheme(theme);
    const json = {
      "elements": [
        {
          "type": "dropdown",
          "name": "car",
          "title": "What car are you driving?",
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz 1 Mercedes-Benz 2 Mercedes-Benz 3 Mercedes-Benz 4 Mercedes-Benz 5 Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }
      ]
    };
    await initSurvey(framework, json);
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    const questionDropdownV2Select = Selector(".sd-dropdown");

    await t
      .resizeWindow(800, 600)
      .click(questionDropdownV2Select)
      .expect(popupContainer.clientWidth).lte(685)
      .click(getListItemByText("Ford"))

      .resizeWindow(1300, 600)
      .click(questionDropdownV2Select)
      .expect(popupContainer.clientWidth).gte(850);
  });
});