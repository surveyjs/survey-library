import { Base, LocalizableString, QuestionCommentModel, Serializer, SurveyModel } from "survey-core";
import { getDisallowedHtml } from "./sanitizer";

export interface UnsupportedRichText {
  element: Base;
  name: string;
  locale: string;
  text: string;
}

const CHILD_KEYS = ["pages", "elements", "choices", "rows", "columns", "validators", "items", "rateValues", "panels", "templateElements"];

export function findUnsupported(survey: SurveyModel): UnsupportedRichText[] {
  const out: UnsupportedRichText[] = [];
  const seen = new Set<Base>();
  walk(survey, seen, out);
  const nested = survey.getAllQuestions(false, false, true);
  for (let i = 0; i < nested.length; i++) walk(nested[i], seen, out);
  return out;
}

function walk(obj: Base, seen: Set<Base>, out: UnsupportedRichText[]): void {
  if (!obj || seen.has(obj)) return;
  seen.add(obj);
  reportStrings(obj, out);
  reportComment(obj, out);
  for (let i = 0; i < CHILD_KEYS.length; i++) {
    const val = (obj as any)[CHILD_KEYS[i]];
    if (!val) continue;
    const items = Array.isArray(val) ? val : [val];
    for (let j = 0; j < items.length; j++) {
      if (items[j] instanceof Base) walk(items[j], seen, out);
    }
  }
}

function reportStrings(obj: Base, out: UnsupportedRichText[]): void {
  const type = typeof obj.getType === "function" ? obj.getType() : "";
  if (!type) return;
  const props = Serializer.getProperties(type);
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (!prop.isLocalizable && !prop.serializationProperty) continue;
    const loc: LocalizableString = obj.getLocalizableString(prop.name);
    if (!loc || !loc.useMarkdown) continue;
    const locales = loc.getLocales();
    for (let j = 0; j < locales.length; j++) {
      const text = loc.getLocaleText(locales[j]);
      if (!text || getDisallowedHtml(text).length === 0) continue;
      out.push({ element: obj, name: prop.name, locale: locales[j], text: text });
    }
  }
}

function reportComment(obj: Base, out: UnsupportedRichText[]): void {
  if (obj.getType() !== "comment") return;
  const question = obj as QuestionCommentModel;
  if (!question.allowRichText) return;
  const value = question.value;
  if (value === undefined || value === null || value === "") return;
  const text = String(value);
  if (getDisallowedHtml(text).length === 0) return;
  out.push({ element: question, name: "value", locale: "", text: text });
}
