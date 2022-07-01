import { frameworks, url, setOptions, initSurvey, getSurveyResult, getQuestionValue, getQuestionJson, checkSurveyWithEmptyQuestion, registerCustomItemComponent } from "../helper";
import { Selector, fixture, test, ClientFunction } from "testcafe";
const title = "dropdown";

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
      .click("select")
      .click("option[value=Nissan]")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql("Nissan");
  });

  test("change choices order", async (t) => {
    const getFirst = Selector("select option").nth(1);
    const getSecond = Selector("select option").nth(2);
    let rnd_count = 0;
    let first, first_2;

    // asc
    await setOptions("car", { choicesOrder: "asc" });
    await t
      .expect(getFirst.textContent).eql("Audi")
      .expect(getSecond.textContent).eql("BMW");

    // desc
    await setOptions("car", { choicesOrder: "desc" });
    await t
      .expect(getFirst.textContent).eql("Volkswagen")
      .expect(getSecond.textContent).eql("Vauxhall");

    // rnd
    await t.expect(Selector("select option").count).notEql(1); // "need to more than one choices"

    first = await getFirst();
    for (let i = 0; i < 15; i++) {
      await setOptions("car", { choicesOrder: "asc" });
      await setOptions("car", { choicesOrder: "random" });
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
      await t.expect(Selector("option").count).eql(choices.length + 1); // +1 because of default "Choose..." option
      for (let i = 0; i < choices.length; i++) {
        await t.click("select").click(`option[value=${choices[i]}]`);
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
      .click(Selector(".sv_row select"))
      .expect(Selector(".sv_row select option").count).eql(12);

    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click(Selector(".sv_row select"))
      .expect(Selector(".sv_row select option").count).eql(13)
      .expect(Selector(".sv_row select option").nth(12).textContent).contains("Other");
  });

  test("check \"other\" choice doesn't change order", async (t) => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t.expect(Selector("select option").nth(12).textContent).eql("Other");

    await setOptions("car", { choicesOrder: "desc" });
    await t.expect(Selector("select option").nth(12).textContent).eql("Other");
  });

  test("choose other", async (t) => {
    await setOptions("car", { hasOther: true, otherText: "Other" });
    await t
      .click("select")
      .click("option[value=other]")
      .typeText(Selector("textarea"), "Zaporozec")
      .click("input[value=Complete]");

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
          renderAs: "select",
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
          renderAs: "select",
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

    const questionDropdownSelect = Selector(".sv_q_dropdown_control");
    const questionText = Selector(".sv_q_dropdown__value");
    const popupContainer = Selector(".sv-popup__container").filterVisible();
    await t
      .expect(popupContainer.visible).notOk()

      .click(questionDropdownSelect)
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetWidth).gte(900)

      .click(Selector(".sv-list__item span").withText("Ford").filterVisible())
      .expect(popupContainer.visible).notOk()

      .click(questionText)
      .expect(popupContainer.visible).ok()
      .expect(popupContainer.offsetWidth).gte(900);
  });

  test("Check dropdown disabled items", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
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
          renderAs: "select",
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
          renderAs: "select",
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

    const questionDropdownSelect = Selector(".sv_q_dropdown_control");
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
          renderAs: "select",
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

    const questionDropdownSelect = Selector(".sv_q_dropdown_control");
    const myListItems = Selector(".my-list-item");
    await t
      .expect(Selector(".sv_q_dropdown__value").textContent).eql("Choose...")

      .click(questionDropdownSelect)
      .expect(myListItems.count).eql(10)
      .expect(myListItems.find(".sv-svg-icon").count).eql(10)

      .click(myListItems.nth(3))

      .expect(Selector(".sv_q_dropdown__value").textContent).eql("Nissan");
  });

  test("Check dropdown key press", async (t) => {
    const jsonWithDropDown = {
      questions: [
        {
          type: "dropdown",
          renderAs: "select",
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
          renderAs: "select",
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
      .expect(Selector(".sv_q_dropdown__value").textContent).eql("Nissan")

      .pressKey("tab enter")
      .pressKey("2")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter")
      .expect(Selector(".sv_q_dropdown__value").nth(1).textContent).eql("item20");
  });
});