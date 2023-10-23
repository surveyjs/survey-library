import { frameworks, urlV2, initSurvey } from "./helper";
import { fixture, Selector, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "navigation";

const json = {
  "progressBarType": "pages",
  "showProgressBar": "top",
  "title": "Customer Satisfaction Survey",
  "pages": [{
    "navigationTitle": "Overall satisfaction",
    "elements": [{
      "type": "matrix",
      "name": "qualities",
      "title": "Please indicate if you agree or disagree with the following statements",
      "columns": [{
        "value": 5,
        "text": "Strongly agree"
      }, {
        "value": 4,
        "text": "Agree"
      }, {
        "value": 3,
        "text": "Neutral"
      }, {
        "value": 2,
        "text": "Disagree"
      }, {
        "value": 1,
        "text": "Strongly disagree"
      }],
      "rows": [{
        "value": "affordable",
        "text": "Product is affordable"
      }, {
        "value": "does-what-it-claims",
        "text": "Product does what it claims"
      }, {
        "value": "better-than-others",
        "text": "Product is better than other products on the market"
      }, {
        "value": "easy-to-use",
        "text": "Product is easy to use"
      }]
    }]
  }, {
    "navigationTitle": "Pricing",
    "elements": [{
      "type": "radiogroup",
      "name": "price-comparison",
      "title": "Compared to our competitors, do you feel our product is:",
      "choices": [
        "Less expensive",
        "Priced about the same",
        "More expensive",
        "Not sure"
      ]
    }]
  }, {
    "navigationTitle": "Contacts",
    "elements": [{
      "type": "text",
      "name": "email",
      "title": "Please leave your email address if you would like us to contact you."
    }]
  }],
  "showQuestionNumbers": false
};

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${urlV2}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("progress bar", async (t) => {
    await t
      .expect(
        await Selector("[role='progressbar']").hasAttribute(
          "aria-label"
        )
      ).ok();
  });
});