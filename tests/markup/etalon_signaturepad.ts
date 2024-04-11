import { StylesManager } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test Signaturepad question markup",
      json: {
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            titleLocation: "hidden",
          }
        ]
      },
      snapshot: "signaturepad"
    },
    {
      name: "Test Signaturepad question markup readonly",
      json: {
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            titleLocation: "hidden",
            readOnly: true
          }
        ]
      },
      snapshot: "signaturepad-readonly"
    },
    {
      name: "Test Signaturepad question with value",
      json: {
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            titleLocation: "hidden",
            defaultValue: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' height='100' width='100'%3E%3Ccircle cx='50' cy='50' r='40' /%3E%3C/svg%3E"
          }
        ]
      },
      snapshot: "signaturepad-value"
    },
    {
      name: "Test Signaturepad question - loading",
      json: {
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            titleLocation: "hidden",
          }
        ]
      },
      initSurvey: (survey) => {
        let q1 = survey.getQuestionByName("q1");
        q1["stateChanged"]("loading");
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "signaturepad-loading"
    },
    {
      name: "Test Signaturepad question with backgroundImage",
      json: {
        questions: [
          {
            "type": "signaturepad",
            "name": "q1",
            titleLocation: "hidden",
            "backgroundImage": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
          }
        ]
      },
      snapshot: "signaturepad-with-backgroundImage"
    },
    {
      name: "Test Scaled Signaturepad question markup",
      json: {
        questions: [
          {
            type: "signaturepad",
            name: "q1",
            titleLocation: "hidden",
            "backgroundImage": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
            signatureAutoScaleEnabled: true
          }
        ]
      },
      snapshot: "signaturepad-scaled"
    },
  ]
);