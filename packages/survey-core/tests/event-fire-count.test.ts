import { describe, test, expect } from "vitest";
import { SurveyModel } from "../src/survey";
import { Event } from "../src/event";
export * from "../src/question_text";

describe("The count of survey event fires that reached a handler", () => {
  test("the fires of a survey event that reach a handler are counted, other fires are not", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    const question = survey.getQuestionByName("q1");
    const start = Event.getHandledFireCount();
    survey.onTextMarkdown.fire(survey, <any>{});
    expect(Event.getHandledFireCount(), "#1: a survey event without a handler").toBe(start);
    question.onPropertyChanged.add(() => { });
    question.onPropertyChanged.fire(question, <any>{});
    expect(Event.getHandledFireCount(), "#2: a handler of a question event").toBe(start);
    survey.onTextMarkdown.add(() => { });
    survey.onTextMarkdown.fire(survey, <any>{});
    survey.onTextMarkdown.fireByCreatingOptions(survey, (): any => ({}));
    expect(Event.getHandledFireCount(), "#3: a survey event with a handler").toBe(start + 2);
    survey.onCompleting.add(() => { });
    (<any>survey.onCompleting).fire(survey, {});
    expect(Event.getHandledFireCount(), "#4: an async survey event with a handler").toBe(start + 3);
  });
});
