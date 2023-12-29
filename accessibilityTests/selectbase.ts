import { frameworks, url, initSurvey, axeOptions, axeContext } from "./helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "selectbase";

// Skip one minor case for listbox role in checkbox fieldset
axeOptions["aria-allowed-role"] = {
  enabled: false
};

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
    }
  );

  test("axe check dropdown", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "dropdown",
          name: "cars",
          title: "Dropdown",
          isRequired: true,
          showNoneItem: true,
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
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test("axe check tagbox", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "tagbox",
          name: "cars2",
          title: "Tagbox",
          showNoneItem: true,
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
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test("axe check checkbox", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "checkbox",
          name: "cars3",
          title: "Checkbox",
          isRequired: true,
          showSelectAllItem: true,
          showNoneItem: true,
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
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test("axe check radiogroup", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "radiogroup",
          name: "cars4",
          title: "Radiogroup",
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
        },
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test.only("axe check imagepicker", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "imagepicker",
          name: "choosepicture",
          title: "Imagepicker",
          imageHeight: "150px",
          imageWidth: "225px",
          choices: [
            {
              value: "lion",
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
            },
            {
              value: "giraffe",
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
            },
            {
              value: "panda",
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
            },
            {
              value: "camel",
              imageLink:
                "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
            }
          ]
        },
        {
          type: "imagepicker",
          name: "choosevideo",
          title: "Imagepicker",
          imageHeight: "300px",
          imageWidth: "450px",
          "contentMode": "video",
          choices: [
            {
              value: "short_but_high",
              imageLink:
                "https://www.youtube.com/watch?v=RAXo6pzOczQ"
            },
            {
              value: "long_but_poor",
              imageLink:
                "https://www.youtube.com/watch?v=RAXo6pzOczQ"
            }
          ]
        },
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
});