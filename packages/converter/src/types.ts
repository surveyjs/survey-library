// Minimal structural type for the produced SurveyJS survey JSON. This is a
// convenience shape only - the authoritative contract is that the output
// constructs a survey-core `SurveyModel` with zero errors (see the corpus
// oracle). We deliberately do NOT depend on survey-core types here: the
// package has zero runtime dependencies, and survey-core is only a devDep.

export interface SurveyJSONElement {
  type: string;
  name: string;
  [key: string]: unknown;
}

export interface SurveyJSONPanel extends SurveyJSONElement {
  type: "panel" | "paneldynamic";
  elements?: SurveyJSONElement[];
}

export interface SurveyJSONPage {
  name: string;
  title?: string;
  elements: SurveyJSONElement[];
  [key: string]: unknown;
}

export interface SurveyJSON {
  title?: string;
  description?: string;
  pages?: SurveyJSONPage[];
  elements?: SurveyJSONElement[];
  [key: string]: unknown;
}
