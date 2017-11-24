import { SurveyElement } from "../base";

export const helpers = {
  methods: {
    getIndentSize: function(question: SurveyElement, indent: number): string {
      if (indent < 1 || !question.survey) return "";
      var css = question.survey["css"];
      if (!css) return "";
      return indent * css.question.indent + "px";
    }
  }
};
