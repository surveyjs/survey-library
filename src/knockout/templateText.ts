const v1 = require("./templates/comment.html").default;
const v2 = require("./templates/flowpanel.html").default;
const v3 = require("./templates/header.html").default;
const v4 = require("./templates/index.html").default;
const v5 = require("./templates/page.html").default;
const v6 = require("./templates/panel.html").default;
const v7 = require("./templates/rows.html").default;
const v8 = require("./templates/row.html").default;
const v9 = require("./templates/string.html").default;
const v10 = require("./templates/timerpanel.html").default;
const v11 = require("./templates/question.html").default;
const v12 = require("./templates/questioncontent.html").default;
const v13 = require("./templates/questiontitle.html").default;
const v14 = require("./templates/question-boolean.html").default;
const v15 = require("./templates/question-checkbox.html").default;
const v16 = require("./templates/question-tagbox.html").default;
const v17 = require("./templates/question-ranking.html").default;
const v18 = require("./templates/question-comment.html").default;
const v19 = require("./templates/question-composite.html").default;
const v20 = require("./templates/question-custom.html").default;
const v21 = require("./templates/question-dropdown.html").default;
const v22 = require("./templates/question-empty.html").default;
const v23 = require("./templates/question-errors.html").default;
const v24 = require("./templates/question-expression.html").default;
const v25 = require("./templates/question-file.html").default;
const v26 = require("./templates/question-html.html").default;
const v27 = require("./templates/question-image.html").default;
const v28 = require("./templates/question-imagepicker.html").default;
const v29 = require("./templates/question-matrix.html").default;
const v30 = require("./templates/question-matrixdynamic.html").default;
const v31 = require("./templates/question-multipletext.html").default;
const v32 = require("./templates/question-paneldynamic.html").default;
const v33 = require("./templates/question-paneldynamic-navigator.html").default;
const v34 = require("./templates/question-radiogroup.html").default;
const v35 = require("./templates/question-rating.html").default;
const v36 = require("./templates/question-signaturepad.html").default;
const v37 = require("./templates/question-text.html").default;
const v38 = require("./templates/question-buttongroup.html").default;
const v39 = require("./templates/popup-pointer.html").default;

export var koTemplate = v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8 + v9 + v10 +
                        v11 + v12 + v13 + v14 + v15 + v16 + v17 + v18 + v19 + v20 +
                        v21 + v22 + v23 + v24 + v25 + v26 + v27 + v28 + v29 + v30 +
                        v31 + v32 + v33 + v34 + v35 + v36 + v37 + v38 + v39;

export class SurveyTemplateText {
  constructor() {}

  public addText(newText: string, id: string, name: string) {
    id = this.getId(id, name);
    this.text =
      this.text +
      '<script type="text/html" ' +
      id +
      ">" +
      newText +
      "</script>";
  }
  public replaceText(
    replaceText: string,
    id: string,
    questionType: string = null
  ) {
    var posId = this.getId(id, questionType);
    var pos = this.text.indexOf(posId);
    if (pos < 0) {
      this.addText(replaceText, id, questionType);
      return;
    }
    pos = this.text.indexOf(">", pos);
    if (pos < 0) return;
    var startPos = pos + 1;
    var endString = "</script>";
    pos = this.text.indexOf(endString, startPos);
    if (pos < 0) return;
    this.text =
      this.text.substring(0, startPos) + replaceText + this.text.substring(pos);
  }
  protected getId(id: string, questionType: string) {
    var result = 'id="survey-' + id;
    if (questionType) {
      result += "-" + questionType;
    }
    return result + '"';
  }
  protected getTextCore(): string {
    return koTemplate;
  }
  protected setTextCore(value: string): void {
    koTemplate = value;
  }
  protected get text(): string {
    return this.getTextCore();
  }
  protected set text(value: string) {
    this.setTextCore(value);
  }
}
