import { frameworks, url_test, initSurvey } from "../helper";
import { QuestionText, QuestionRadiogroup, QuestionCheckbox, QuestionDropdown, QuestionComment, QuestionRating, QuestionImagePicker, QuestionBoolean, QuestionHtml, QuestionExpression, QuestionFile, QuestionSignaturePad, QuestionMatrix, QuestionMatrixDropdown, QuestionMutlipleText, QuestionPanelDynamic } from "../questionHelper";
import { test, expect } from "@playwright/test";
import { Survey } from "../surveyHelper";

const title = "allTypes";
const themeName = "defaultV2";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      const img_base64 =
      "data:image/png;base64,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";
      const json = {
        questions: [
          {
            type: "text",
            name: "text_question",
          },
          {
            type: "checkbox",
            name: "checkbox_question",
            choices: ["item1"],
          },
          {
            type: "radiogroup",
            name: "radiogroup_question",
            choices: ["item1"],
          },
          {
            type: "dropdown",
            name: "dropdown_question",
            choices: ["item1"],
          },
          {
            type: "comment",
            name: "comment_question",
          },
          {
            type: "rating",
            name: "rating_question",
          },
          {
            type: "imagepicker",
            name: "imagepicker_question",
            choices: [
              {
                value: "item1",
                imageLink: img_base64,
              },
            ],
          },
          {
            type: "boolean",
            name: "boolean_question",
          },
          {
            type: "image",
            name: "image_question",
            imageLink: img_base64,
          },
          {
            type: "html",
            name: "html_question",
            html: "<div class='sjs-html-question'>html text</div>",
          },
          {
            type: "signaturepad",
            name: "signature_question",
            defaultValue: img_base64,
          },
          {
            type: "expression",
            name: "expression_question",
            expression: "1",
          },
          {
            type: "file",
            name: "file_question",
            defaultValue: [
              {
                name:
                  "data:image/png;base64,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",
                type: "image/png",
                content: img_base64,
              },
            ],
          },
          {
            type: "matrix",
            name: "matrix_question",
            columns: ["Column1", "Column2", "Column3"],
            rows: ["Row1", "Row2"],
          },
          {
            type: "matrixdropdown",
            name: "matrixdropdown_question",
            columns: [
              {
                name: "Column1",
              },
              {
                name: "Column2",
              },
            ],
            choices: [1],
            rows: ["Row1", "Row2", "Row3", "Row4"],
          },
          {
            type: "matrixdynamic",
            name: "matrixdynamic_question",
            columns: [
              {
                name: "Column1",
              },
              {
                name: "Column2",
              },
            ],
            choices: [1],
            rowCount: 2
          },
          {
            type: "multipletext",
            name: "multipletext_question",
            items: [
              {
                name: "text1",
              },
            ],
          },
          {
            type: "panel",
            name: "panel",
            elements: [
              {
                type: "text",
                name: "panel_question",
              },
            ],
            title: "panel_title",
            state: "collapsed",
          },
          {
            type: "paneldynamic",
            name: "paneldynamic_question",
            templateElements: [
              {
                type: "text",
                name: "paneldynamic_q1",
              },
            ],
            panelCount: 1,
          }
        ],
      };
      await page.goto(`${url_test}${themeName}/${framework}`);
      await initSurvey(page, framework, json);
    });
    test("check survey will all types", async ({ page }) => {
      const survey = new Survey(page);
      await survey.checkIfCssClassExists("sv-string-viewer", true);
      await survey.checkIfCssClassExists("sv-string-editor", false);

      await new QuestionText(page, "text_question").fill("test text");
      await new QuestionCheckbox(page, "checkbox_question").clickByText("item1");
      await new QuestionRadiogroup(page, "radiogroup_question").clickByText("item1");
      await new QuestionDropdown(page, "dropdown_question").selectItemByText("item1");
      await new QuestionComment(page, "comment_question").fill("test comment");
      await new QuestionRating(page, "rating_question").clickItemByText("3");
      await new QuestionImagePicker(page, "imagepicker_question").clickItemByValue("item1");
      await new QuestionBoolean(page, "boolean_question").clickItemByText("Yes");

      await new QuestionHtml(page, "html_question").checkText("html text");
      await new QuestionExpression(page, "expression_question").checkText("1");

      await new QuestionFile(page, "file_question").clickClear();
      await new QuestionSignaturePad(page, "signature_question").clickClear();

      await new QuestionMatrix(page, "matrix_question").clickCell("Row2", "Column2");

      await (await new QuestionMatrixDropdown(page, "matrixdropdown_question").getCellDropdown("Row2", "Column2")).selectItemByText("1");
      await (await new QuestionMatrixDropdown(page, "matrixdynamic_question").getCellDropdown(1, "Column1")).selectItemByText("1");
      await (await new QuestionMatrixDropdown(page, "matrixdynamic_question").getCellDropdown(2, "Column2")).selectItemByText("1");

      await new QuestionMutlipleText(page, "multipletext_question").getTextQuestion(0).fill("abc");

      await survey.getNavigatorButton("Complete").scrollIntoViewIfNeeded();
      await new QuestionPanelDynamic(page, "paneldynamic_question").removePanel(0);

      await survey.complete();
      await survey.checkQuestionValue("text_question", "test text");
      await survey.checkQuestionValue("checkbox_question", ["item1"]);
      await survey.checkQuestionValue("radiogroup_question", "item1");
      await survey.checkQuestionValue("dropdown_question", "item1");
      await survey.checkQuestionValue("comment_question", "test comment");
      await survey.checkQuestionValue("rating_question", 3);
      await survey.checkQuestionValue("imagepicker_question", "item1");
      await survey.checkQuestionValue("boolean_question", true);
      await survey.checkQuestionValue("matrix_question", { Row2: "Column2" });
      await survey.checkQuestionValue("matrixdropdown_question", { Row2: { Column2: 1 } });
      await survey.checkQuestionValue("matrixdynamic_question", [{ Column1: 1 }, { Column2: 1 }]);
      await survey.checkQuestionValue("multipletext_question", { text1: "abc" });
    });
  });
});