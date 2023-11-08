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