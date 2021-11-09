export var markupTests = [
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
    etalon: "<div class=\"sv_qcbc sv_qbln\"><label class=\"sv-boolean sv-boolean--indeterminate\"><input aria-invalid=\"false\" aria-label=\"Question title\" aria-required=\"false\" class=\"sv-visuallyhidden\" type=\"checkbox\" value=\"\"><span class=\"sv-boolean__label\"><span class=\"sv-string-viewer\">No</span></span><div class=\"sv-boolean__switch\"><span class=\"sv-boolean__slider\"><span class=\"sv-hidden\"></span></span></div><span class=\"sv-boolean__label\"><span class=\"sv-string-viewer\">Yes</span></span></label></div>"
  }

];
