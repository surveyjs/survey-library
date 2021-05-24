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

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
    }
  );

  test(`ranking: simple using`, async (t) => {
    const PriceItem = Selector(
      "[aria-label='Please rank the following smartphone features in order of importance:']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");

    await t.hover(PriceItem, { speed: 0.5 });

    await t.drag(PriceItem, 0, -350, {
      offsetX: 7,
      offsetY: 8,
    }, { speed: 0.5 });

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
    const PriceItem = Selector(
      "[aria-label='Please rank the following smartphone features in order of importance:']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");

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
    await t.hover(PriceItem, { speed: 0.5 });
    await t.drag(PriceItem, 0, 70, {
      offsetX: 7,
      offsetY: 8,
    }, { speed: 0.5 });

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
    await t.hover(PriceItem, { speed: 0.5 });
    await t.drag(PriceItem, 0, -350, {
      offsetX: 7,
      offsetY: 8,
    }, { speed: 0.5 });
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
    const rankPriceItem = Selector(
      "[aria-label='Please rank the following smartphone features in order of importance:']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Price");
    await t.hover(rankPriceItem, { speed: 0.5 });
    await t.drag(rankPriceItem, 0, -350, {
      offsetX: 7,
      offsetY: 8,
    }, { speed: 0.5 });
    const rankAudiItem = Selector(
      "[aria-label='What car did you enjoy the most?']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Audi");

    const checkboxAudiItem = Selector(
      "[aria-label='What cars have you being drived?']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Audi");
    const checkboxMerscedesItem = Selector(
      "[aria-label='What cars have you being drived?']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Mercedes-Benz");
    const checkboxToyotaItem = Selector(
      "[aria-label='What cars have you being drived?']"
    )
      .parent("[aria-labelledby]")
      .find("span")
      .withText("Toyota");

    await t.click(Selector("input[value='Next']"));
    await t
      .click(checkboxAudiItem, { speed: 0.5 })
      .click(checkboxMerscedesItem, { speed: 0.5 })
      .click(checkboxToyotaItem, { speed: 0.5 });

    let data = await getData();
    assert.deepEqual(typeof data.bestcar, "undefined");

    await t.hover(rankAudiItem, { speed: 0.5 });
    await t.drag(rankAudiItem, 0, 5, {
      offsetX: 7,
      offsetY: 8,
    }, { speed: 0.5 });
    data = await getData();
    assert.deepEqual(data.bestcar, ["Audi", "Mercedes-Benz", "Toyota"]);

    //TODO click doesn't work after the d&d above without the "click('body')" hack 
    await t.click("body");
    await t.click(checkboxMerscedesItem, { speed: 0.5 });

    data = await getData();
    assert.deepEqual(data.bestcar, ["Audi", "Toyota"]);

    await t.click(checkboxMerscedesItem);
    data = await getData();
    assert.deepEqual(data.bestcar, ["Audi", "Toyota", "Mercedes-Benz"]);

    await t
      .click(checkboxAudiItem, { speed: 0.5 })
      .click(checkboxMerscedesItem, { speed: 0.5 })
      .click(checkboxToyotaItem, { speed: 0.5 });

    data = await getData();
    assert.deepEqual(typeof data.bestcar, "undefined");
  });
});
