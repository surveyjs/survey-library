import {Question as QuestionModel} from '../question'

export function getIndentSize(question: QuestionModel, indent: number): string {
    if (indent < 1) return "";
    if (!question["data"]) return "";
    var css = question["data"]["css"];
    if (!css) return "";
    return indent * css.question.indent + "px";
}