export var koTemplate = require("html-loader?interpolate!val-loader!./templates/entry.html");

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
  protected get text(): string {
    return koTemplate;
  }
  protected set text(value: string) {
    koTemplate = value;
  }
}
