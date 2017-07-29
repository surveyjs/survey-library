import {Question as QuestionModel} from '../question'

export const helpers = {
    methods: {
        getIndentSize: function (question: QuestionModel, indent: number): string {
            if (indent < 1) return "";
            return indent * this.question.cssClasses.indent + "px";
        }
    }
};
