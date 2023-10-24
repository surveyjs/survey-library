import { frameworks, url, initSurvey, axeTags } from "./helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "selectbase";

const json = {
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
            "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
        },
        {
          value: "long_but_poor",
          imageLink:
            "https://sample-videos.com/video123/mp4/240/big_buck_bunny_240p_1mb.mp4"
        }
      ]
    },
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test.skip("axe check", async (t) => {
    const axeContext = { include: [[".sv_p_root"]] };
    const axeOptions = {
      runOnly: {
        type: "tag",
        values: axeTags
      },
      rules: {
        //https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
        "color-contrast": {
          enabled: false
        },
        "document-title": {
          enabled: false
        },
        "landmark-one-main": {
          enabled: false
        },
        "page-has-heading-one": {
          enabled: false
        },
        "region": {
          enabled: false
        }
      }
    };
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
});