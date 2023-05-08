import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test ranking markup",
    json: {
      questions: [
        {
          "type": "ranking",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "ranking",
  },
  {
    name: "Test ranking markup design mode",
    json: {
      questions: [
        {
          "type": "ranking",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    initSurvey: survey => survey.setDesignMode(true),
    snapshot: "ranking-design",
  }]
);