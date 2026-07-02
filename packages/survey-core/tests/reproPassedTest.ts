import { SurveyModel } from "../src/survey";
import { describe, test, expect } from "vitest";

describe("repro passed bug", () => {
  test("second page should not be passed on first render", () => {
    const json: any = {
      showProgressBar: true,
      progressBarType: "pages",
      pages: [
        { name: "patient", title: "Patient", elements: [
          { type: "text", name: "firstName", isRequired: true },
        ] },
        { name: "insurance", title: "Insurance", elements: [
          { type: "text", name: "carrier", isRequired: true },
        ] },
        { name: "history", title: "History", elements: [
          { type: "text", name: "med" },
        ] },
        { name: "consent", title: "Consent", elements: [
          { type: "boolean", name: "consentTreatment", isRequired: true },
        ] },
      ],
    };
    const survey = new SurveyModel(json);
    // simulate what survey-react-ui does: reads uiState (getter) during render, then re-applies
    const state = survey.uiState;
    survey.uiState = state;
    expect(survey.pages[0].passed, "page1 passed").toBe(false);
    expect(survey.pages[1].passed, "page2 passed").toBe(false);
    expect(survey.pages[2].passed, "page3 passed").toBe(false);
  });
});
