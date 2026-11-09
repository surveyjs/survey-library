import { Base, Question, Serializer, SurveyModel, DomDocumentHelper } from "survey-core";
import { createAnswerConverter } from "./answer-format";
import type { IRichTextConverter, IRichTextConverterContext } from "./api";
import { getAnswerEditMode } from "./edit-mode";
import { getUnsupportedMarkdown, markdownConverter } from "./markdown";
import { createDetachedElement } from "./runs";

export interface UnsupportedHit {
  element: Base;
  name: string;
  locale: string;
  text: string;
}

export function isConverterLossless(converter: IRichTextConverter, source: string, context: IRichTextConverterContext): boolean {
  if (converter.lossless) return true;
  if (converter.checkLossless) return converter.checkLossless(source, context);
  if (!DomDocumentHelper.isAvailable()) return true;
  const html = converter.toHtml(source, context);
  const element = createDetachedElement(html);
  if (!element) return true;
  const roundTrip = converter.toHtml(converter.toSource(element, context), context);
  return roundTrip === html;
}

export function isLossless(source: string, context: IRichTextConverterContext): boolean {
  return isConverterLossless(markdownConverter, source, context);
}

export function findUnsupported(survey: SurveyModel): UnsupportedHit[] {
  const hits: UnsupportedHit[] = [];
  const seen = new Set<Base>();
  const visit = (element: Base) => {
    if (!element || seen.has(element) || typeof element.getType !== "function") return;
    seen.add(element);
    const props = Serializer.getProperties(element.getType());
    for (let i = 0; i < props.length; i++) {
      const loc = element.getLocalizableString(props[i].name);
      if (!loc || !loc.useMarkdown) continue;
      const locales = loc.getLocales();
      for (let n = 0; n < locales.length; n++) {
        const text = loc.getLocaleText(locales[n]);
        if (text && getUnsupportedMarkdown(text).length > 0) {
          hits.push({ element: element, name: props[i].name, locale: locales[n], text: text });
        }
      }
    }
  };
  visit(survey);
  survey.pages.forEach(page => visit(page));
  survey.getAllPanels().forEach(panel => visit(panel as any));
  const questions = survey.getAllQuestions(false, true, true);
  questions.forEach(question => {
    visit(question);
    const holder = question as any;
    if (Array.isArray(holder.choices)) holder.choices.forEach(visit);
    if (Array.isArray(holder.rows)) holder.rows.forEach(visit);
    if (Array.isArray(holder.columns)) holder.columns.forEach(visit);
    if (question.isDescendantOf("comment") && (question as any).allowRichText) {
      const value = question.value;
      if (typeof value === "string" && value) {
        const converter = (question as any).richTextConverter || createAnswerConverter(question as Question);
        const context = { inline: getAnswerEditMode(question) === "inline", element: question, name: "value" };
        if (!isConverterLossless(converter, value, context)) {
          hits.push({ element: question, name: "value", locale: "", text: value });
        }
      }
    }
  });
  return hits;
}
