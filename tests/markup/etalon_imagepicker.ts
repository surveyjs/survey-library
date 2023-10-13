import { StylesManager } from "survey-core";
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
    initSurvey: survey => {
      survey.getAllQuestions()[0]["choices"][0]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
      survey.getAllQuestions()[0]["choices"][1]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
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
    initSurvey: survey => {
      survey.getAllQuestions()[0]["choices"][0]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
      survey.getAllQuestions()[0]["choices"][1]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
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
    timeout: 500,
    initSurvey: survey => {
      survey.getAllQuestions()[0]["choices"][0]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
      survey.getAllQuestions()[0]["choices"][1]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
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
    initSurvey: survey => {
      survey.getAllQuestions()[0]["choices"][0]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
      survey.getAllQuestions()[0]["choices"][1]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
    },
    snapshot: "imagepicker-labels",
  },
  {
    name: "Test image picker no-image markup",
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
              "imageLink": ""
            }
          ],
          titleLocation: "hidden"
        }
      ]
    },
    timeout: 500,
    initSurvey: survey => {
      survey.getAllQuestions()[0]["choices"][0]["contentNotLoaded"] = true;
      survey.getAllQuestions()[0]["choices"][0]["onErrorHandler"] = function() { this["contentNotLoaded"] = true; };
      survey.getAllQuestions()[0]["choices"][1]["onErrorHandler"] = function() { this["contentNotLoaded"] = true; };
    },
    snapshot: "imagepicker-no-image",
  },
  {
    name: "Test image picker no-image V2 markup",
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
              "imageLink": ""
            }
          ],
          titleLocation: "hidden"
        }
      ]
    },
    timeout: 500,
    initSurvey: survey => {
      survey.getAllQuestions()[0]["choices"][0]["contentNotLoaded"] = true;
      survey.getAllQuestions()[0]["choices"][0]["onErrorHandler"] = function() { this["contentNotLoaded"] = true; };
      survey.getAllQuestions()[0]["choices"][1]["onErrorHandler"] = function() { this["contentNotLoaded"] = true; };
    },
    snapshot: "imagepicker-no-image-v2",
    before: () => { StylesManager.applyTheme("defaultV2"); },
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test image picker colCount 2, V2 markup",
    json: {
      questions: [
        {
          "type": "imagepicker",
          "name": "question1",
          colCount: 2,
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
    initSurvey: survey => {
      survey.getAllQuestions()[0]["choices"][0]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
      survey.getAllQuestions()[0]["choices"][1]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
    },
    snapshot: "imagepicker-colCount-2-v2",
    before: () => { StylesManager.applyTheme("defaultV2"); },
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test image picker colCount 1, V2 markup",
    json: {
      questions: [
        {
          "type": "imagepicker",
          "name": "question1",
          colCount: 1,
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
    initSurvey: survey => {
      survey.getAllQuestions()[0]["choices"][0]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
      survey.getAllQuestions()[0]["choices"][1]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
    },
    snapshot: "imagepicker-colCount-1-v2",
    before: () => { StylesManager.applyTheme("defaultV2"); },
    after: () => StylesManager.applyTheme("default"),
  },
  ]
);