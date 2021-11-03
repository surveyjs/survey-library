
import { testQuestionMarkup } from "./helper";
export default QUnit.module("Base");

QUnit.test("Test HTML question markup", function (assert) {
  var json = {
    questions: [
      {
        name: "name",
        type: "html",
        title: "Question title",
      }
    ]
  };
  testQuestionMarkup(assert, json, "<div class=\"\"><h5 class=\"sv_q_title\" id=\"sq_102_ariaTitle\" aria-label=\"Question title\"><span data-key=\"q_num\" class=\"sv_q_num\" aria-hidden=\"true\" style=\"position: static;\">1.</span><span data-key=\"num-sp\">&nbsp;</span><span class=\"sv-string-viewer\">Question title</span></h5><div class=\"sv_q_description\"><span class=\"sv-string-viewer\"></span></div></div><div class=\"\"><input id=\"sq_102i\" class=\"sv_q_text_root\" type=\"text\" step=\"any\" placeholder=\"\" list=\"\" autocomplete=\"\" aria-required=\"false\" aria-label=\"Question title\" aria-invalid=\"false\" data-rendered=\"r\"></div>");
});

