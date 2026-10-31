// Helpers of the fixture checks, shared by fixtures.test.ts and fixtures-old.test.ts. The survey-core module is
// passed in, so the same code checks the runner's build and an older one.
export function loadQuietly(Survey: any, json: any): { survey: any, warnings: Array<string> } {
  const warnings: Array<string> = [];
  const warn = console.warn;
  const error = console.error;
  console.warn = (...args: Array<any>): void => { warnings.push("warn: " + String(args[0])); };
  console.error = (...args: Array<any>): void => { warnings.push("error: " + String(args[0])); };
  try {
    return { survey: new Survey.Model(json), warnings: warnings };
  } finally {
    console.warn = warn;
    console.error = error;
  }
}

export function countsOf(survey: any): any {
  return {
    questionsWithCells: survey.getAllQuestions(false, false, true).length,
    questions: survey.getAllQuestions(false).length,
    visibleQuestions: survey.getAllQuestions(true).length,
    pages: survey.pages.length,
    panels: survey.getAllPanels().length,
    calculatedValues: survey.calculatedValues.length
  };
}

export function plannedCounts(meta: any): any {
  return {
    questionsWithCells: meta.questionsWithCells,
    questions: meta.questions,
    visibleQuestions: meta.visibleQuestions,
    pages: meta.pages,
    panels: meta.panels,
    calculatedValues: meta.calculatedValues
  };
}

// Choice questions by type, counting matrix cells and the questions of existing dynamic panels.
export function choiceCounts(survey: any): any {
  const res: any = { radiogroup: 0, checkbox: 0, dropdown: 0 };
  survey.getAllQuestions(false, false, true).forEach((q: any) => {
    if (res[q.getType()] !== undefined) res[q.getType()]++;
  });
  return res;
}
