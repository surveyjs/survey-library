import { frameworks, url, test, expect } from "../helper";

const title = "popupSurvey";

const initPopupSurvey = async (page, framework, json) => {
  await page.evaluate(([framework, json]) => {
    // eslint-disable-next-line no-console
    console.error = (msg) => {
      throw new Error(msg);
    };
    // eslint-disable-next-line no-console
    console.warn = (msg) => {
      throw new Error(msg);
    };
    // eslint-disable-next-line no-console
    console.log("surveyjs console.error and console.warn override");
    const model = new window["Survey"].Model(json);
    const surveyComplete = function (model) {
      window["SurveyResult"] = model.data;
      document.getElementById("surveyResultElement").innerHTML = JSON.stringify(
        model.data
      );
    };
    model.onComplete.add(surveyComplete);
    if (framework === "knockout") {
      const popupSurvey = new window["Survey"].PopupSurvey(undefined, model);
      popupSurvey.show();
    } else if (framework === "react") {
      document.getElementById("surveyElement").innerHTML = "";
      const root = ReactDOMClient.createRoot(document.getElementById("surveyElement"));
      root.render(React.createElement(React.StrictMode, { children: React.createElement(window["SurveyReact"].PopupSurvey, {
        model: model,
        onComplete: surveyComplete,
      })
      }
      ));
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML =
        "<popup-survey :survey='survey'/>";
      !!window["vueApp"] && window["vueApp"].$destroy();
      window["vueApp"] = new window["Vue"]({
        el: "#surveyElement",
        data: { survey: model },
      });
    } else if (framework === "angular" || framework == "vue3") {
      window.setSurvey(model, true, false);
    } else if (framework === "jquery-ui") {
      document.getElementById("surveyElement").innerHTML = "";
      window["$"]("#surveyElement").PopupSurvey({
        model: model
      });
    } else if (framework === "survey-js-ui") {
      document.getElementById("surveyElement").innerHTML = "";
      window["SurveyUI"].renderPopupSurvey(model, document.getElementById("surveyElement"));
    }
    window["survey"] = model;
  }, [framework, json]);
};

const json = {
  title: "Car survey",
  questions: [
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
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
        "Citroen"
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test("Show Popup", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initPopupSurvey(page, framework, json);
      const expandCollapseButton = page.locator(".sv_window_button_collapse");
      await expect(expandCollapseButton).toBeVisible();

      await expandCollapseButton.click();
      await page.locator(".sd-item__control-label", { hasText: "Nissan" }).click();
      await page.locator(".sd-item__control-label", { hasText: "Audi" }).click();
      await page.locator("input[value=Complete]").click();

      const surveyResult = await page.evaluate(() => window["SurveyResult"]);
      expect(surveyResult.car).toEqual(["Nissan", "Audi"]);
      await expect(expandCollapseButton).toHaveCount(0);
    });

    test("Check popup styles", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await initPopupSurvey(page, framework, json);
      await page.setViewportSize({ width: 1000, height: 600 });
      const expandCollapseButton = page.locator(".sv_window_button_collapse");

      await expect(expandCollapseButton).toBeVisible();
      await expandCollapseButton.click();

      const getStyleWidthInPercents = async (prop) => {
        return await page.evaluate((p) => {
          return document.querySelector(".sv_window").style[p];
        }, prop);
      };

      expect(await getStyleWidthInPercents("width")).toBe("60%");
      expect(await getStyleWidthInPercents("max-width")).toBe("60%");

      await page.evaluate(() => window["survey"].width = "455px");

      expect(await getStyleWidthInPercents("width")).toBe("455px");
      expect(await getStyleWidthInPercents("max-width")).toBe("455px");
    });

    test("Check dropdown-popups hiding during parent survey popup scrolling", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1000, height: 500 });

      await initPopupSurvey(page, framework, {
        title: "Survey title",
        elements: [
          {
            type: "dropdown",
            name: "q1",
            choices: ["Item1", "Item2"]
          },
          {
            type: "dropdown",
            name: "q2",
            choices: ["Item1", "Item2"]
          },
          {
            type: "dropdown",
            name: "q3",
            choices: ["Item1", "Item2"]
          },
          {
            type: "dropdown",
            name: "q4",
            choices: ["Item1", "Item2"]
          }
        ]
      });

      const expandCollapseButton = page.locator(".sv_window_button_collapse");
      await expandCollapseButton.click();
      await expect(page.locator(".sv-popup__container").filter({ visible: true })).toHaveCount(0);

      await page.locator(".sd-dropdown__value").first().click();
      await expect(page.locator(".sv-popup__container").filter({ visible: true })).toHaveCount(1);

      await page.evaluate(() => {
        document.querySelector(".sv_window")?.scroll({ top: 100 });
      });
      await expect(page.locator(".sv-popup__container").filter({ visible: true })).toHaveCount(0);
    });
  });
});