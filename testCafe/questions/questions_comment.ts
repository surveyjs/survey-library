import { frameworks, url, initSurvey } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "questions_comment";

const json = {
  elements: [
    {
      "type": "radiogroup",
      "name": "radiogroup",
      "choices": [1, 2, 3],
      "showCommentArea": true
    },
    {
      "type": "checkbox",
      "name": "checkbox",
      "choices": [1, 2, 3],
      "showCommentArea": true
    },
    {
      "type": "dropdown",
      "name": "dropdown",
      "choices": [1, 2, 3],
      "showCommentArea": true
    },
    {
      "type": "rating",
      "name": "rating",
      "showCommentArea": true
    },
    {
      "type": "ranking",
      "name": "ranking",
      "choices": [1, 2, 3],
      "showCommentArea": true
    },
    {
      "type": "boolean",
      "name": "boolean",
      "showCommentArea": true
    },
    {
      "type": "matrix",
      "name": "matrix",
      "showCommentArea": true,
      "rows": [1, 2],
      "columns": [1, 2]
    },
    {
      "type": "matrixdynamic",
      "name": "matrixdynamic",
      "showCommentArea": true,
      "columns": [{ name: "col1" }]
    },
    {
      "type": "matrixdropdown",
      "name": "matrixdropdown",
      "showCommentArea": true,
      "columns": [{ name: "col1" }],
      "rows": [1, 2]
    },
    {
      "type": "paneldynamic",
      "name": "paneldynamic",
      "showCommentArea": true,
      "templateElements": [
        { "type": "text", "name": "q7" }
      ]
    },
    {
      "type": "file",
      "name": "file",
      "showCommentArea": true
    },
    {
      "type": "text",
      "name": "text",
      "showCommentArea": true
    },
    {
      "type": "comment",
      "name": "comment",
      "showCommentArea": true
    },
    {
      "type": "html",
      "name": "html",
      "showCommentArea": true
    },
    {
      "type": "image",
      "name": "image",
      "showCommentArea": true
    },
    {
      "type": "expression",
      "name": "expression",
      "showCommentArea": true
    },
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("check comment existing", async (t) => {
    const setQuestionId = ClientFunction(() => {
      const survey = window["survey"];
      survey.mode = "display";
      survey.getAllQuestions().forEach(q => { q.id = q.name; });
      survey.mode = "edit";
    });

    await initSurvey(framework, json);
    await setQuestionId();
    await t
      .expect(Selector("#radiogroup_comment").visible).ok()
      .expect(Selector("#checkbox_comment").visible).ok()
      .expect(Selector("#dropdown_comment").visible).ok()
      .expect(Selector("#rating_comment").visible).ok()
      .expect(Selector("#ranking_comment").visible).ok()
      .expect(Selector("#boolean_comment").visible).ok()
      .expect(Selector("#matrix_comment").visible).ok()
      .expect(Selector("#matrixdropdown_comment").visible).ok()
      .expect(Selector("#matrixdynamic_comment").visible).ok()
      .expect(Selector("#paneldynamic_comment").visible).ok()
      .expect(Selector("#file_comment").visible).ok()
      .expect(Selector("#text_comment").visible).notOk()
      .expect(Selector("#comment_comment").visible).notOk()
      .expect(Selector("#html_comment").visible).notOk()
      .expect(Selector("#image_comment").visible).notOk()
      .expect(Selector("#expression_comment").visible).notOk();
  });
});