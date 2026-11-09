import { DomDocumentHelper, Question, SurveyModel } from "survey-core";
import type { IRichTextConverter, IRichTextConverterContext } from "./api";
import { createDetachedElement, escapeHtml } from "./runs";
import { getDisallowedHtml, sanitizeHtml } from "./sanitizer";

function rendered(question: Question, source: string): string {
  return question.survey.getSurveyMarkdownHtml(question, source, "value", undefined);
}

function plainHtml(source: string): string {
  return escapeHtml(source || "").replace(/\n/g, "<br>");
}

export function createAnswerConverter(question: Question): IRichTextConverter {
  return {
    toHtml(source: string, ctx: IRichTextConverterContext): string {
      const raw = rendered(question, source);
      if (!raw) return plainHtml(source);
      return sanitizeHtml(raw, !!ctx.inline);
    },
    toSource(root: HTMLElement): string {
      return question.survey.getSurveyHtmlToMarkdown(question, root.innerHTML, "value");
    },
    checkLossless(source: string, ctx: IRichTextConverterContext): boolean {
      if (!DomDocumentHelper.isAvailable()) return true;
      const raw = rendered(question, source);
      if (!raw) return true;
      if (getDisallowedHtml(raw).length > 0) return false;
      const html = this.toHtml(source, ctx);
      const element = createDetachedElement(html);
      if (!element) return true;
      const back = this.toSource(element, ctx);
      if (back === null || back === undefined) return true;
      return this.toHtml(back, ctx) === html;
    }
  };
}

export function canEditRichAnswer(question: Question): boolean {
  if (question.isInputReadOnly || !question.survey) return false;
  // ISurvey declares no events; only SurveyModel has them.
  const survey = question.survey as SurveyModel;
  if (survey.onTextMarkdown.isEmpty) return false;
  return survey.getSurveyHtmlToMarkdown(question, "", "value") !== null;
}
