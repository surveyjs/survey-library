import { frameworks, url, initSurvey, getData, setData } from "../helper";
import { Selector } from "testcafe";
const assert = require("assert");
const title = `ranking`;

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

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
    }
  );

  test(`ranking: simple using`, async (t) => {
    const PriceItem = Selector("span")
      .withText(
        "Please rank the following smartphone features in order of importance:"
      )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");

    const BatteryItem = Selector("span")
      .withText(
        "Please rank the following smartphone features in order of importance:"
      )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Battery life");

    await t.dragToElement(PriceItem, BatteryItem);

    let data = await getData();
    assert.deepEqual(data["smartphone-features"], [
      "Price",
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);
  });

  test(`ranking: predeficed data`, async (t) => {
    const PriceItem = Selector("span")
      .withText(
        "Please rank the following smartphone features in order of importance:"
      )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");

    const BatteryLifeItem = Selector("span")
      .withText(
        "Please rank the following smartphone features in order of importance:"
      )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Battery life");

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

    await t.dragToElement(PriceItem, BatteryLifeItem);

    let data = await getData();
    assert.deepEqual(data["smartphone-features"], [
      "Battery life",
      "Price",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);

    await setData(null);

    await t.dragToElement(PriceItem, BatteryLifeItem);

    data = await getData();
    assert.deepEqual(data["smartphone-features"], [
      "Price",
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
    ]);
  });

  test(`ranking: carry forward`, async (t) => {
    const rankPriceItem = Selector("span")
      .withText(
        "Please rank the following smartphone features in order of importance:"
      )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");

    await t.hover(rankPriceItem);
    await t.drag(rankPriceItem, 0, -350, {
      offsetX: 7,
      offsetY: 8
    });
    const rankAudiItem = Selector("span")
      .withText("What car did you enjoy the most?")
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Audi");
    const rankMercedesBenzItem = Selector("span")
      .withText("What car did you enjoy the most?")
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Mercedes-Benz");

    const checkboxAudiItem = Selector("span")
      .withText("What cars have you being drived?")
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Audi");
    const checkboxMerscedesItem = Selector("span")
      .withText("What cars have you being drived?")
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Mercedes-Benz");
    const checkboxToyotaItem = Selector("span")
      .withText("What cars have you being drived?")
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Toyota");

    await t.click(Selector("input[value='Next']"));
    await t
      .click(checkboxAudiItem)
      .click(checkboxMerscedesItem)
      .click(checkboxToyotaItem);

    let data = await getData();
    assert.deepEqual(typeof data.bestcar, "undefined");

    await t.hover(rankAudiItem);
    await t.dragToElement(rankAudiItem, rankMercedesBenzItem);
    data = await getData();
    assert.deepEqual(data.bestcar, ["Mercedes-Benz", "Audi", "Toyota"]);

    //TODO click doesn't work after the d&d above without the "click('body')" hack
    await t.click("body");
    await t.click(checkboxMerscedesItem);

    data = await getData();
    assert.deepEqual(data.bestcar, ["Audi", "Toyota"]);

    await t.click(checkboxMerscedesItem);
    data = await getData();
    assert.deepEqual(data.bestcar, ["Audi", "Toyota", "Mercedes-Benz"]);

    await t
      .click(checkboxAudiItem)
      .click(checkboxMerscedesItem)
      .click(checkboxToyotaItem);

    data = await getData();
    assert.deepEqual(typeof data.bestcar, "undefined");
  });

  test(`ranking: keyborad`, async (t) => {
    const PriceItem = Selector("span")
      .withText(
        "Please rank the following smartphone features in order of importance:"
      )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");

    await t.pressKey("tab").pressKey("tab").pressKey('up');
    let data = await getData();
    assert.deepEqual(data["smartphone-features"], [
      "Screen size",
      "Battery life",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
      "Price",
    ]);

    await t.pressKey('down');
    data = await getData();
    assert.deepEqual(data["smartphone-features"], [
      "Battery life",
      "Screen size",
      "Storage space",
      "Camera quality",
      "Durability",
      "Processor power",
      "Price",
    ]);
  });
});
