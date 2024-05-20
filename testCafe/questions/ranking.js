import { frameworks, url, initSurvey, getData, setData } from "../helper";
import { Selector, fixture, test, ClientFunction } from "testcafe";
const title = "ranking";

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "ranking",
          name: "smartphone-features",
          title:
            "Please rank the following smartphone features in order of importance:",
          isRequired: true,
          choices: [
            "Battery life",
            "Screen size",
            "Storage space",
            "Camera quality",
            "Durability",
            "Processor power",
            "Price",
          ],
        },
      ],
    },
    {
      name: "page2",
      elements: [
        {
          type: "checkbox",
          name: "car",
          isRequired: true,
          title: "What cars have you being drived?",
          colCount: 4,
          choicesOrder: "asc",
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
            "Citroen",
            "Tesla",
          ],
        },
        {
          type: "ranking",
          name: "bestcar",
          isRequired: true,
          visibleIf: "{car.length} > 1",
          title: "What car did you enjoy the most?",
          choicesFromQuestion: "car",
          choicesFromQuestionMode: "selected",
        },
      ],
    },
  ],
};

// for (let index = 0; index < 100; index++) {
//   frameworks.push("knockout");
// }

const setSjsFramework = ClientFunction((framework) => {
  window["sjsFramework"] = framework;
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await t.resizeWindow(1920, 1080);
      await setSjsFramework(framework);
      await initSurvey(framework, json);
    }
  );

  const PriceItem = Selector("span")
    .withText("Please rank the following smartphone features in order of importance:")
    .parent("[data-name]")
    .find("span")
    .withText("Price");

  const BatteryItem = Selector("span")
    .withText("Please rank the following smartphone features in order of importance:")
    .parent("[data-name]")
    .find("span")
    .withText("Battery life");

  test("ranking: simple using", async (t) => {
    await t.dragToElement(PriceItem, BatteryItem);
    await t.wait(300);
    let data = await getData();
    await t.expect(data["smartphone-features"]).eql([
      "Price",
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);
  });

  test("ranking: predeficed data", async (t) => {
    await setData({
      "smartphone-features": [
        "Price",
        "Battery life",
        "Screen size",
        "Storage space",
        "Camera quality",
        "Durability",
        "Processor power",
      ],
    });
    await t.dragToElement(PriceItem, BatteryItem, {
      destinationOffsetY: 0,
      offsetY: 0,
      speed: 0.1
    });
    await t.wait(300);
    let data = await getData();
    await t.expect(data["smartphone-features"]).eql([
      "Battery life",
      "Price",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);

    await setData(null);
    await t.dragToElement(PriceItem, BatteryItem);
    await t.wait(300);
    data = await getData();
    await t.expect(data["smartphone-features"]).eql([
      "Price",
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);
  });

  test("ranking: carry forward", async (t) => {
    await t.hover(PriceItem);
    await t.drag(PriceItem, 0, -300, {
      offsetX: 7,
      offsetY: 8
    });
    const rankAudiItem = Selector("span")
      .withText("What car did you enjoy the most?")
      .parent("[data-name]")
      .find("span")
      .withText("Audi");
    const rankMercedesBenzItem = Selector("span")
      .withText("What car did you enjoy the most?")
      .parent("[data-name]")
      .find("span")
      .withText("Mercedes-Benz");

    const checkboxAudiItem = Selector("span")
      .withText("What cars have you being drived?")
      .parent("[data-name]")
      .find("span")
      .withText("Audi");
    const checkboxMerscedesItem = Selector("span")
      .withText("What cars have you being drived?")
      .parent("[data-name]")
      .find("span")
      .withText("Mercedes-Benz");
    const checkboxToyotaItem = Selector("span")
      .withText("What cars have you being drived?")
      .parent("[data-name]")
      .find("span")
      .withText("Toyota");

    await t.click(Selector("input[value='Next']"));
    await t
      .click(checkboxAudiItem)
      .click(checkboxMerscedesItem)
      .click(checkboxToyotaItem);

    let data = await getData();
    await t.expect(typeof data.bestcar).ok();

    await t.hover(rankAudiItem);
    await t.dragToElement(rankAudiItem, rankMercedesBenzItem, { offsetY: 0, destinationOffsetY: 0, speed: 0.1 });
    data = await getData();

    await t.expect(data.bestcar).eql(["Mercedes-Benz", "Audi", "Toyota"]);

    //TODO click doesn't work after the d&d above without the "click('body')" hack
    await t.click("body");
    await t.click(checkboxMerscedesItem);

    data = await getData();
    await t.expect(data.bestcar).eql(["Audi", "Toyota"]);

    await t.click(checkboxMerscedesItem);
    data = await getData();
    await t.expect(data.bestcar).eql(["Audi", "Toyota", "Mercedes-Benz"]);

    await t
      .click(checkboxAudiItem)
      .click(checkboxMerscedesItem)
      .click(checkboxToyotaItem);

    data = await getData();
    await t.expect(typeof data.bestcar).eql("undefined");
  });

  test("ranking: keyborad", async (t) => {
    await t.pressKey("tab").pressKey("tab").pressKey("up");
    let data = await getData();
    await t.expect(data["smartphone-features"]).eql([
      "Screen size",
      "Battery life",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
      "Price",
    ]);

    await t.pressKey("down");
    data = await getData();
    await t.expect(data["smartphone-features"]).eql([
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
      "Price",
    ]);
  });

  test("ranking: run-time creation ", async (t) => {
    const newName = "ranking-new";

    const addNewRankingQuestion = ClientFunction((newName) => {
      let qr;

      if (window["sjsFramework"] === "knockout") { //see https://github.com/surveyjs/survey-library/issues/6396
        qr = new window["Survey"].QuestionRanking(newName);
      } else {
        qr = new window["Survey"].QuestionRankingModel(newName);
      }

      qr.choices = ["one", "two"];
      window["survey"].currentPage.addQuestion(qr);
    });

    await addNewRankingQuestion(newName);

    const FirstItem = Selector("span")
      .withText(newName)
      .parent("[data-name]")
      .find("span")
      .withText("one");

    const SecondItem = Selector("span")
      .withText(newName)
      .parent("[data-name]")
      .find("span")
      .withText("two");

    await t.dragToElement(FirstItem, SecondItem, { speed: 0.1 });

    let data = await getData();
    await t.expect(data[newName]).eql([
      "two",
      "one"
    ]);
  });

  test("ranking: work with flexbox layout", async (t) => {
    const addFlexboxLayout = ClientFunction(() => {
      const stylesheet = document.styleSheets[0];
      stylesheet.addRule(".sv-ranking.sv-ranking.sv-ranking.sv-ranking.sv-ranking", "display:flex;flex-direction: column", 0);
    });
    const removeFlexboxLayout = ClientFunction(() => {
      const stylesheet = document.styleSheets[0];
      stylesheet.removeRule(0);
    });

    await addFlexboxLayout();

    await t.dragToElement(PriceItem, BatteryItem, { destinationOffsetY: 0 });
    await t.wait(300);
    let data = await getData();
    await t.expect(data["smartphone-features"]).eql([
      "Price",
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);

    await removeFlexboxLayout();
  });

  test("ranking: selectToRank: click to add", async (t) => {
    const setSelectToRankEnabled = ClientFunction(() => {
      const rankingQ = window["survey"].getAllQuestions()[0];
      rankingQ.selectToRankEnabled = true;
    });
    await setSelectToRankEnabled();
    await t.click(PriceItem);
    await t.click(BatteryItem);

    let data = await getData();
    await t.expect(data["smartphone-features"]).eql([
      "Price",
      "Battery life"
    ]);

    const setSelectToRankDisabled = ClientFunction(() => {
      const rankingQ = window["survey"].getAllQuestions()[0];
      rankingQ.selectToRankEnabled = false;
    });
    await setSelectToRankDisabled();
  });
});
