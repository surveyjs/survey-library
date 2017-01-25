var koTemplate = require("html-loader?interpolate!val-loader!./templates/entry.html");

export class SurveyTemplateText {
    constructor() {
    }

    public replaceText(replaceText: string, id: string, questionType: string = null) {
        id = this.getId(id, questionType);
        var pos = this.text.indexOf(id);
        if (pos < 0) return;
        pos = this.text.indexOf('>', pos);
        if (pos < 0) return;
        var startPos = pos + 1;
        var endString = "</script>";
        pos = this.text.indexOf(endString, startPos);
        if (pos < 0) return;
        this.text = this.text.substr(0, startPos) + replaceText + this.text.substr(pos);
    }
    protected getId(id: string, questionType: string) {
        var result = 'id="survey-' + id;
        if (questionType) {
            result += "-" + questionType;
        }
        return result + '"';
    }
    protected get text(): string { return koTemplate; }
    protected set text(value: string) { koTemplate = value; }
}