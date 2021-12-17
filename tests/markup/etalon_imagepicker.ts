import { StylesManager } from "../../src/stylesmanager";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test image picker question markup",
    json: {
      questions: [
        {
          "type": "imagepicker",
          "name": "question1",
          "choices": [
            {
              "value": "item1",
              "imageLink": "#item1.jpg"
            },
            {
              "value": "item2",
              "imageLink": "#item2.jpg"
            }
          ],
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "imagepicker",
  },
  {
    name: "Test image picker question MULTISELECT markup",
    json: {
      questions: [
        {
          multiSelect: true,
          "type": "imagepicker",
          "name": "question1",
          "choices": [
            {
              "value": "item1",
              "imageLink": "#item1.jpg"
            },
            {
              "value": "item2",
              "imageLink": "#item2.jpg"
            }
          ],
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "imagepicker-multi",
  },
  {
    name: "Test image picker question VIDEO markup",
    json: {
      questions: [
        {
          "type": "imagepicker",

          "name": "question1",
          "choices": [
            {
              "value": "item1",
              "imageLink": "#item1.mp4"
            },
            {
              "value": "item2",
              "imageLink": "#item2.mp4"
            }
          ],
          titleLocation: "hidden",
          contentMode: "video"
        }
      ]
    },
    snapshot: "imagepicker-video",
  },
  {
    name: "Test image picker question Labels markup",
    json: {
      questions: [
        {
          "type": "imagepicker",
          "name": "question1",
          "choices": [
            {
              "value": "item1",
              "imageLink": "#item1.jpg"
            },
            {
              "value": "item2",
              "imageLink": "#item2.jpg"
            }
          ],
          titleLocation: "hidden",
          showLabel: true
        }
      ]
    },
    snapshot: "imagepicker-labels",
  },
  ]
);