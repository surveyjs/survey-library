
import { testQuestionMarkup } from "./helper";
export default QUnit.module("Base");
/*
QUnit.test("Test Text question markup", function (assert) {
  var json = {
    questions: [
      {
        name: "name",
        type: "text",
        title: "Question title",
        titleLocation: "hidden"
      }
    ]
  };
  testQuestionMarkup(assert, json, "<input class=\"sv_q_text_root\" type=\"text\" step=\"any\" placeholder=\"\" list=\"\" autocomplete=\"\" aria-required=\"false\" aria-label=\"Question title\" aria-invalid=\"false\" data-rendered=\"r\">");
});
*/
/*
QUnit.test("Test HTML question markup", function (assert) {
  var json = {
    questions: [
      {
        name: "name",
        type: "html",
        html: "HTML content here",
        title: "Question title",
      }
    ]
  };
  testQuestionMarkup(assert, json, "<div class=\"\">HTML content here</div>");
});
*/
QUnit.test("Test Image question markup", function (assert) {
  var json = {
    questions: [
      {
        "type": "image",
        "name": "banner",
        "imageLink": "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
        "imageWidth": "500px",
        "imageHeight": "300px"
      }
    ]
  };
  testQuestionMarkup(assert, json, "<div class=\"sv_q_image\"><img class=\"sv_image_image\" src=\"https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg\" alt=\"banner\" width=\"500px\" height=\"300px\" style=\"object-fit: contain;\"></div>");
});