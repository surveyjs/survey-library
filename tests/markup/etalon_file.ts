import { settings } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test single file question disabled (default)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            defaultValue: [
              {
                "name": "item1.zip",
                "type": "application/x-zip-compressed",
                "content": "#item1.zip"
              },
            ],
          }
        ]
      },
      initSurvey: (survey) => survey.setDesignMode(true),
      snapshot: "file-single-zip-disabled",
    },
    {
      name: "Test file question empty (defaultV2)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "file-2",

    },
    {
      name: "Test file question ZIP (defaultV2)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            defaultValue: [
              {
                "name": "item1.zip",
                "type": "application/x-zip-compressed",
                "content": "#item1.zip"
              }
            ],
          }
        ]
      },
      snapshot: "file-2-zip",

    },
    {
      name: "Test file question PNG (defaultV2)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            defaultValue: [
              {
                "name": "item1.png",
                "type": "image/png",
                "content": "#item1.png"
              }
            ],
          }
        ]
      },
      snapshot: "file-2-png",

    },
    {
      name: "Test multiply file question (defaultV2)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            allowMultiple: true,
            defaultValue: [
              {
                "name": "item1.zip",
                "type": "application/x-zip-compressed",
                "content": "#item1.zip"
              },
              {
                "name": "item2.png",
                "type": "image/png",
                "content": "#item2.png"
              }
            ],
          }
        ]
      },
      snapshot: "file-2-zip-png",
      initSurvey(survey) {
        survey.getAllQuestions()[0]["pageSize"] = 2;
      },

    },
    {
      name: "Test multiply file question (defaultV2) with file navigator",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            allowMultiple: true,
            defaultValue: [
              {
                "name": "item1.zip",
                "type": "application/x-zip-compressed",
                "content": "#item1.zip"
              },
              {
                "name": "item2.png",
                "type": "image/png",
                "content": "#item2.png"
              }
            ],
          }
        ]
      },
      snapshot: "file-2-zip-png-file-navigator",
      initSurvey(survey) {
        survey.getAllQuestions()[0]["pageSize"] = 1;
      },

    },
    {
      name: "Test multiply file question readOnly (defaultV2)",
      json: {
        mode: "display",
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            allowMultiple: true,
            defaultValue: [
              {
                "name": "item1.zip",
                "type": "application/x-zip-compressed",
                "content": "#item1.zip"
              },
              {
                "name": "item2.png",
                "type": "image/png",
                "content": "#item2.png"
              }
            ],
          }
        ]
      },
      snapshot: "file-2-zip-png-ro",
      initSurvey(survey) {
        survey.getAllQuestions()[0]["pageSize"] = 2;
      },

    },
    // defaultV2 mobile
    {
      name: "Test file question empty mobile (defaultV2 mobile)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "file-mob2",

      initSurvey: survey => survey.setIsMobile(true),
    },
    {
      name: "Test file question ZIP mobile (defaultV2 mobile)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            defaultValue: [
              {
                "name": "item1.zip",
                "type": "application/x-zip-compressed",
                "content": "#item1.zip"
              }
            ],
          }
        ]
      },
      snapshot: "file-mob2-zip",

      initSurvey: survey => survey.setIsMobile(true),
    },
    {
      name: "Test file question PNG mobile (defaultV2 mobile)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            defaultValue: [
              {
                "name": "item1.png",
                "type": "image/png",
                "content": "#item1.png"
              }
            ],
          }
        ]
      },
      snapshot: "file-mob2-png",

      initSurvey: survey => survey.setIsMobile(true),
    },
    {
      name: "Test multiply file question mobile (defaultV2 mobile)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            allowMultiple: true,
            defaultValue: [
              {
                "name": "item1.zip",
                "type": "application/x-zip-compressed",
                "content": "#item1.zip"
              },
              {
                "name": "item2.png",
                "type": "image/png",
                "content": "#item2.png"
              }
            ],
          }
        ]
      },
      snapshot: "file-mob2-zip-png",

      initSurvey: survey => survey.setIsMobile(true),
    },
    {
      name: "Test multiply file question readOnly (defaultV2 mobile)",
      json: {
        mode: "display",
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            allowMultiple: true,
            defaultValue: [
              {
                "name": "item1.zip",
                "type": "application/x-zip-compressed",
                "content": "#item1.zip"
              },
              {
                "name": "item2.png",
                "type": "image/png",
                "content": "#item2.png"
              }
            ],
          }
        ]
      },
      snapshot: "file-mob2-zip-png-ro",

      initSurvey: survey => survey.setIsMobile(true),
    },
    {
      name: "Test file question with preview image size",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            imageWidth: "350px",
            imageHeight: "250px",
            defaultValue: [
              {
                "name": "arrow.svg",
                "type": "image/svg+xml",
                "content": "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgeG1sbnM9Imh0dHA6L"
              }
            ]
          }
        ]
      },
      snapshot: "file-image-size",
    },
    {
      name: "Test file question empty (default)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            allowCameraAccess: true
          }
        ]
      },
      snapshot: "file-camera",
    },
    {
      name: "Test file question empty (default)",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
            allowCameraAccess: true
          }
        ]
      },

      snapshot: "file-uploading",
      initSurvey: survey => survey.getAllQuestions()[0]["isUploading"] = true,
    },
    {
      name: "Test file question mode: 'both'",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
          }
        ]
      },
      initSurvey: (survey) => {
        survey.getAllQuestions()[0]["updateCurrentMode"] = () => {};
        survey.getAllQuestions()[0].setPropertyValue("currentMode", "file-camera");
      },
      snapshot: "file-mode-both",
    },
    {
      name: "Test file question mode: 'camera'",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
          }
        ]
      },
      initSurvey: (survey) => {
        survey.getAllQuestions()[0]["updateCurrentMode"] = () => {};
        survey.getAllQuestions()[0].setPropertyValue("currentMode", "camera");
      },
      snapshot: "file-mode-camera",
    },
    {
      name: "Test file question playing video",
      json: {
        questions: [
          {
            name: "name",
            type: "file",
            title: "Question title",
            titleLocation: "hidden",
          }
        ]
      },

      initSurvey: (survey) => {
        survey.getAllQuestions()[0]["updateCurrentMode"] = () => {};
        survey.getAllQuestions()[0].setPropertyValue("currentMode", "camera");
        survey.getAllQuestions()[0].setPropertyValue("isPlayingVideo", true);
      },
      snapshot: "file-playing-video",
    },
  ]
);