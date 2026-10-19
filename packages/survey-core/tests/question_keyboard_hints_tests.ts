import { expect, test } from "vitest";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { Serializer } from "../src/jsonobject";
import { IKeyboardHint } from "../src/keyboard-hints";

export function hints(question: any, surveyExtra: any = {}): IKeyboardHint[] {
  const survey = new SurveyModel(Object.assign({
    keyboardHintsEnabled: true,
    elements: [Object.assign({ name: "q" }, question)]
  }, surveyExtra));
  return (survey.getQuestionByName("q") as Question).getKeyboardHints();
}

test("keyboardHintsEnabled defaults to false", () => {
  expect(Serializer.findProperty("survey", "keyboardHintsEnabled").getDefaultValue(undefined)).toBe(false);
  expect(Serializer.findProperty("radiogroup", "keyboardHintsEnabled")).toBeFalsy();
  const plain = new SurveyModel();
  expect(plain.keyboardHintsEnabled).toBe(false);
  expect(plain.toJSON().keyboardHintsEnabled).toBeUndefined();
  const loaded = new SurveyModel({ keyboardHintsEnabled: true });
  expect(loaded.keyboardHintsEnabled).toBe(true);
  expect(loaded.toJSON().keyboardHintsEnabled).toBe(true);
});

test("questions with no hint table stay empty when the flag is on", () => {
  expect(hints({ type: "expression", expression: "1+1" })).toEqual([]);
  expect(hints({ type: "html", html: "<p>x</p>" })).toEqual([]);
});

test("english keyboard hint strings", () => {
  const survey = new SurveyModel();
  expect(survey.getLocalizationString("keyboardHintSelectText")).toBe("to select");
  expect(survey.getLocalizationString("keyboardHintSubmitText")).toBe("to submit");
  expect(survey.getLocalizationString("keyboardHintOrText")).toBe("or");
  expect(survey.getLocalizationString("keyboardHintNewLineText")).toBe("to add a line");
  expect(survey.getLocalizationString("keyboardHintNextItemText")).toBe("to the next item");
  expect(survey.getLocalizationString("keyboardHintMoveText")).toBe("to move");
  expect(survey.getLocalizationString("keyboardHintOpenText")).toBe("to open");
  expect(survey.getLocalizationString("keyboardHintCloseText")).toBe("to close");
});

import { getLocaleString } from "../src/surveyStrings";
import "../src/localization/german";

test("german keyboard hint strings are translated", () => {
  expect(getLocaleString("keyboardHintSelectText", "de")).toBe("zum Auswählen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintSubmitText", "de")).toBe("zum Absenden");
  expect(getLocaleString("keyboardHintOrText", "de")).toBe("oder");
  expect(getLocaleString("keyboardHintNewLineText", "de")).toBe("zum Hinzufügen einer Zeile"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintNextItemText", "de")).toBe("zum nächsten Element"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintMoveText", "de")).toBe("zum Verschieben");
  expect(getLocaleString("keyboardHintOpenText", "de")).toBe("zum Öffnen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  expect(getLocaleString("keyboardHintCloseText", "de")).toBe("zum Schließen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
});
