import { createRng } from "./random.ts";

// 300 pages of 15 simple questions. Every page after the first is visible while an answer on the page before it
// is empty, and hidden by one value of that answer only. Titles and choices carry a "de" translation.
export interface ManyPagesOptions {
  seed?: number;
  pages?: number;
  questionsPerPage?: number;
}

export const manyPagesDefaults = { seed: 300, pages: 300, questionsPerPage: 15 };

// "number" is not a question type: an unknown type would be dropped silently into jsonErrors.
const kinds = ["text", "number", "radiogroup", "checkbox", "dropdown", "boolean", "comment"];
// The question of each page whose value "v3" hides the next page.
const hiderIndex = 2;
const hidingValue = "v3";

export function generateManyPages(options?: ManyPagesOptions): { json: any, meta: any } {
  const o = Object.assign({}, manyPagesDefaults, options || {});
  const rng = createRng(o.seed);
  const loc = (words: number): any => ({ default: rng.words(words), de: rng.words(words) });
  const pages: Array<any> = [];
  const hiders: Array<{ page: number, question: string, value: string }> = [];
  const required: Array<string> = [];
  const answers: { [name: string]: any } = {};
  let total = 0;
  for (let p = 0; p < o.pages; p++) {
    const elements: Array<any> = [];
    for (let i = 0; i < o.questionsPerPage; i++) {
      const kind = kinds[(p + i) % kinds.length];
      const name = "p" + p + "_q" + i;
      const q: any = { type: kind === "number" ? "text" : kind, name: name, title: loc(rng.int(2, 6)) };
      if (kind === "number") q.inputType = "number";
      if (kind === "radiogroup" || kind === "checkbox" || kind === "dropdown") {
        q.choices = [];
        for (let c = 1; c <= 4; c++) q.choices.push({ value: "v" + c, text: loc(rng.int(1, 3)) });
      }
      if (i === hiderIndex) {
        // The hider is always a radiogroup, whatever the type cycle gives.
        q.type = "radiogroup";
        delete q.inputType;
        q.choices = [];
        for (let c = 1; c <= 4; c++) q.choices.push({ value: "v" + c, text: loc(rng.int(1, 3)) });
      }
      if ((p * o.questionsPerPage + i) % 3 === 0) {
        q.isRequired = true;
        required.push(name);
      }
      answers[name] = q.type === "boolean" ? true : q.type === "checkbox" ? ["v1"] : q.choices ? "v1" : q.inputType === "number" ? p + i : "a" + p;
      elements.push(q);
      total++;
    }
    const page: any = { name: "page" + (p + 1), title: loc(2), elements: elements };
    if (p > 0) {
      const question = "p" + (p - 1) + "_q" + hiderIndex;
      page.visibleIf = "{" + question + "} != '" + hidingValue + "'";
      hiders.push({ page: p, question: question, value: hidingValue });
    }
    pages.push(page);
  }
  const json = { title: loc(3), pages: pages, showQuestionNumbers: "off" };
  const meta = {
    pages: o.pages,
    panels: 0,
    questionsWithCells: total,
    questions: total,
    // Every page is visible while the answers are empty.
    visibleQuestions: total,
    calculatedValues: 0,
    hiders: hiders,
    required: required,
    // A value per question that hides no page.
    answers: answers,
    expectedLintFindings: []
  };
  return { json: json, meta: meta };
}
