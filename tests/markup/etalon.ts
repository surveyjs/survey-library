import { settings } from "../../src/settings";

export var markupTests = [
  // Text question
  {
    name: "Test Text question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_text_root\" list=\"\" placeholder=\"\" step=\"any\" type=\"text\">"
  },
  {
    name: "Test Text (text update mode) question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Question title",
          titleLocation: "hidden"
        }
      ],
      textUpdateMode: "onTyping"
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_text_root\" list=\"\" placeholder=\"\" step=\"any\" type=\"text\">"
  },
  {
    name: "Test Text readonly question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          title: "Question title",
          titleLocation: "hidden"
        }
      ],
      mode: "display"
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" autocomplete=\"\" class=\"sv_q_text_root\" disabled=\"\" list=\"\" placeholder=\"\" step=\"any\" type=\"text\">"
  },
  {
    name: "Test Text readonly DIV question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "text",
          defaultValue: "test",
          title: "Question title",
          titleLocation: "hidden"
        }
      ],
      mode: "display",
    },
    before: () => settings.readOnlyTextRenderMode = "div",
    after: () => settings.readOnlyTextRenderMode = "input",
    etalon: "<div>test</div>"
  },
  {
    name: "Test Text Date question markup",
    json: {
      questions: [
        {
          name: "birthdate",
          type: "text",
          inputType: "date",
          title: "Your birthdate:",
          isRequired: true,
          autoComplete: "bdate",
          titleLocation: "hidden"
        }
      ],
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Your birthdate:\" aria-required=\"true\" autocomplete=\"bdate\" class=\"sv_q_text_root\" list=\"\" max=\"2999-12-31\" placeholder=\"\" step=\"any\" type=\"date\">"
  },
  {
    name: "Test Text Email question markup",
    json: {
      questions: [
        {
          name: "email",
          type: "text",
          inputType: "email",
          title: "Your e-mail:",
          placeHolder: "jon.snow@nightwatch.org",
          isRequired: true,
          autoComplete: "email",
          validators: [
            {
              type: "email"
            }
          ],
          titleLocation: "hidden"
        }
      ],
    },
    etalon: "<input aria-invalid=\"false\" aria-label=\"Your e-mail:\" aria-required=\"true\" autocomplete=\"email\" class=\"sv_q_text_root\" list=\"\" placeholder=\"jon.snow@nightwatch.org\" step=\"any\" type=\"email\">"
  },

  // Image question
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
    etalon: "<div class=\"sv_q_image\"><img alt=\"banner\" class=\"sv_image_image\" height=\"300px\" src=\"https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg\" style=\"object-fit: contain;\" width=\"500px\"></div>"
  },
  // HTML question
  {
    name: "Test HTML question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "html",
          html: "HTML content here",
          title: "Question title",
        }
      ]
    },
    etalon: "<div>HTML content here</div>"
  },
  // Boolean question
  {
    name: "Test Boolean question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    etalon: "<div class=\"sv_qcbc sv_qbln\"><label class=\"sv-boolean sv-boolean--indeterminate\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv-visuallyhidden\" name=\"name\" type=\"checkbox\" value=\"\"><span class=\"sv-boolean__label\"><span class=\"sv-string-viewer\">No</span></span><div class=\"sv-boolean__switch\"><span class=\"sv-boolean__slider\"><span class=\"sv-hidden\"></span></span></div><span class=\"sv-boolean__label\"><span class=\"sv-string-viewer\">Yes</span></span></label></div>"
  }

];
