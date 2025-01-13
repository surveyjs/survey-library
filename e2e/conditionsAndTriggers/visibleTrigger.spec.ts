import { frameworks, url_test, initSurvey } from "../helper";
import { QuestionRadiogroup } from "../questionHelper";
import { test, expect } from "@playwright/test";
import { Survey } from "../surveyHelper";

const themeName = "defaultV2";
const title = "visibleTrigger";
frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const json = {
        triggers: [
          {
            type: "visible",
            name: "type",
            operator: "equal",
            value: "Hot hatch",
            questions: ["Hot hatch"]
          },
          { type: "visible", name: "type", value: "sedan", questions: ["Sedan"] },
          { type: "visible", name: "type", value: "sports", questions: ["Sports"] },
          {
            type: "visible",
            name: "type",
            value: "Grand tourer",
            questions: ["Grand tourer"]
          },
          {
            type: "visible",
            name: "type",
            value: "SuperCar",
            questions: ["Supercar"]
          },
          {
            type: "visible",
            name: "type",
            value: "Muscle car",
            questions: ["Muscle car"]
          },
          {
            type: "visible",
            name: "type",
            value: "Pony car",
            questions: ["Pony car"]
          },
          {
            type: "visible",
            name: "type",
            value: "Convertible",
            questions: ["Convertible"]
          },
          { type: "visible", name: "type", value: "other", questions: ["otherType"] }
        ],
        questions: [
          {
            type: "radiogroup",
            name: "type",
            isRequired: true,
            colCount: 4,
            hasOther: true,
            title: "Please select the sport cars type.",
            choices: [
              "Hot hatch",
              "sedan|Sports saloon / sports sedan",
              "sports|Sports Car",
              "Grand tourer",
              "SuperCar",
              "Muscle car",
              "Pony car",
              "Convertible"
            ]
          },
          {
            type: "radiogroup",
            name: "Hot hatch",
            isRequired: true,
            colCount: 4,
            visible: false,
            title: "Please select the car",
            hasOther: true,
            choices: ["Honda Civic Type R", "Renault Megane RS", "Fiat 500 Abarth"]
          },
          {
            type: "radiogroup",
            name: "Sedan",
            isRequired: true,
            colCount: 4,
            visible: false,
            title: "Please select the car",
            hasOther: true,
            choices: [
              "BMW M5",
              "Mazdaspeed6/Mazda 6 MPS",
              "Dodge Charger",
              "Dodge SRT-4",
              "Lotus Cortina",
              "Mitsubishi EVO"
            ]
          },
          {
            type: "radiogroup",
            name: "Sports",
            isRequired: true,
            colCount: 4,
            visible: false,
            title: "Please select the car",
            hasOther: true,
            choices: ["Chevrolet Corvette", "Mazda MX-5", "Porsche 911"]
          },
          {
            type: "radiogroup",
            name: "Grand tourer",
            isRequired: true,
            colCount: 4,
            visible: false,
            title: "Please select the car",
            hasOther: true,
            choices: ["Aston Martin V8", "Lexus SC300/400", "Ferrari 612 Scaglietti"]
          },
          {
            type: "radiogroup",
            name: "Supercar",
            isRequired: true,
            colCount: 4,
            visible: false,
            title: "Please select the car",
            hasOther: true,
            choices: ["McLaren P1", "Lamborghini Miura", "Bugatti Veyron 16.4"]
          },
          {
            type: "radiogroup",
            name: "Muscle car",
            isRequired: true,
            colCount: 4,
            visible: false,
            title: "Please select the car",
            hasOther: true,
            choices: [
              "Ford Torino",
              "Plymouth Road Runner",
              "Pontiac GTO",
              "Ford Falcon",
              "Holden Monaro",
              "Valiant Charger"
            ]
          },
          {
            type: "radiogroup",
            name: "Pony car",
            isRequired: true,
            colCount: 4,
            visible: false,
            title: "Please select the car",
            hasOther: true,
            choices: ["AMC Javelin", "Chevrolet Camaro", "Dodge Challenger"]
          },
          {
            type: "radiogroup",
            name: "Convertible",
            isRequired: true,
            colCount: 4,
            visible: false,
            title: "Please select the car",
            hasOther: true,
            choices: ["Honda S2000", "Volkswagen Eos", "Volvo C70"]
          },
          {
            type: "comment",
            name: "otherType",
            title: "Please describe the car.",
            isRequired: true,
            visible: false
          }
        ]
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
    });
    test("check question visibility using deprecated visible trigger", async ({ page }) => {
      const survey = new Survey(page);
      const typeQ = new QuestionRadiogroup(page, "type");

      await typeQ.clickByValue("Hot hatch");

      const hothatch = new QuestionRadiogroup(page, "Hot hatch");
      await hothatch.clickByValue("Honda Civic Type R");
      await hothatch.clickByValue("Fiat 500 Abarth");

      await typeQ.clickByValue("Pony car");
      const ponyCar = new QuestionRadiogroup(page, "Pony car");
      await ponyCar.clickByValue("Dodge Challenger");
      await survey.complete();

      await survey.checkData({
        type: "Pony car",
        "Pony car": "Dodge Challenger"
      });
    });
  });
});