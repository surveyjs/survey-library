import { StylesManager } from "../../src/stylesmanager";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  // default
  [{
    name: "Test file question empty",
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
    snapshot: "file",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question ZIP",
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
    snapshot: "file-zip",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question PNG",
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
    snapshot: "file-png",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test multiply file question",
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
    snapshot: "file-zip-png",
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  // defaultV2
  {
    name: "Test file question empty",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question ZIP",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question PNG",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test multiply file question",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  },
  // defaultV2 mobile
  {
    name: "Test file question empty mobile",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  {
    name: "Test file question ZIP mobile",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  {
    name: "Test file question PNG mobile",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  {
    name: "Test multiply file question mobile",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    initSurvey: survey => survey.setIsMobile(true),
  },
  // modern
  {
    name: "Test file question empty",
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
    snapshot: "file-modern",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question ZIP",
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
    snapshot: "file-modern-zip",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test file question PNG",
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
    snapshot: "file-modern-png",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  },
  {
    name: "Test multiply file question",
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
    snapshot: "file-modern-zip-png",
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
  }
  ]
);