import { registerMarkupTest } from "./helper";

registerMarkupTest(
  {
    name: "Test Image question markup",
    json: {
      questions: [
        {
          "type": "image",
          "name": "banner",
          "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
          "imageWidth": "500px",
          "imageHeight": "300px"
        }
      ]
    },
    initSurvey: survey => {
      survey.getAllQuestions()[0]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
    },
    snapshot: "image"
  }
);
registerMarkupTest(
  {
    name: "Test Image question empty",
    json: {
      questions: [
        {
          "type": "image",
          "name": "banner",
        }
      ]
    },
    snapshot: "image-empty"
  }
);
registerMarkupTest(
  {
    name: "Test Image Video question markup",
    json: {
      questions: [
        {
          "type": "image",
          "name": "banner",
          "imageLink": "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
          "imageWidth": "500px",
          "imageHeight": "300px",
          "contentMode": "video"
        }
      ]
    },
    initSurvey: survey => {
      survey.getAllQuestions()[0]["onErrorHandler"] = function() { this["contentNotLoaded"] = false; };
    },
    snapshot: "image-video",
  }
);
registerMarkupTest(
  {
    name: "Test Image question doesn't load content",
    json: {
      questions: [
        {
          "type": "image",
          "name": "banner",
          "imageLink": "#item1.jpg",
        }
      ]
    },
    timeout: 500,
    initSurvey: survey => {
      survey.getAllQuestions()[0]["contentNotLoaded"] = true;
      survey.getAllQuestions()[0]["onErrorHandler"] = function() { this["contentNotLoaded"] = true; };
    },
    snapshot: "image-not-load-content"
  }
);