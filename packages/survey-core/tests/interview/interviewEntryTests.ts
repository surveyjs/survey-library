import { createInterview, toYaml } from "survey-core/interview";
import type {
  IInterview, IInterviewAction, IInterviewChanges, IInterviewCompleteResult, IInterviewDocument,
  IInterviewError, IInterviewItem, IInterviewOptions, IInterviewResult, IInterviewSummary,
  IInterviewToolDefinition,
} from "survey-core/interview";
import * as SurveyCore from "survey-core";
import { SurveyModel } from "survey-core";
import { createInterview as InternalCreateInterview } from "../../src/interview/interview";
import { toYaml as InternalToYaml } from "../../src/interview/yaml";

import { describe, expect, test } from "vitest";

// The entry point is what "survey-core/interview" resolves to. These tests read it exactly as an
// integrator does - through the module specifier, never through a src/ path - so that a name that
// stops being exported fails here and not in someone's application.

const surveyJson = {
  title: "Entry",
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2", visibleIf: "{q1} notempty" },
  ],
};

describe("survey-core/interview entry point (issue #11818)", () => {
  test("createInterview is the function of the source", () => {
    expect(typeof createInterview).toBe("function");
    expect(createInterview).toBe(InternalCreateInterview);
  });

  test("toYaml is the emitter of the source", () => {
    expect(typeof toYaml).toBe("function");
    expect(toYaml).toBe(InternalToYaml);
    // A host that renders its own text from the item records gets the quoting the documents use.
    expect(toYaml({ answered: { hasPet: "Yes" } })).toBe("answered:\n  hasPet: \"Yes\"\n");
  });

  test("createInterview resolves with the interview of the model it was given", async () => {
    const survey = new SurveyModel(surveyJson);
    const interview: IInterview = await createInterview(survey);
    expect(interview.survey).toBe(survey);
    expect(interview.data).toEqual({});
    expect(interview.current()).toBe(null);
    expect(typeof interview.describe()).toBe("string");
    interview.dispose();
  });

  test("The declared types are usable from the entry point, with no src/ import", async () => {
    // The compiler is what is under test here: these are the declared types, not "any".
    const options: IInterviewOptions = { timeout: 0 };
    const interview: IInterview = await createInterview(surveyJson, options);
    const current: IInterviewItem | null = interview.current();
    expect(current).toBe(null);

    const changes: IInterviewChanges = { becameVisible: [], becameHidden: [], becameRequired: [] };
    const error: IInterviewError = { name: "q1", message: "Response required.", code: "required" };
    const result: IInterviewResult = { ...changes, errors: [error], current: null, describe: "" };
    expect(result.errors[0].code).toBe("required");
    const summary: IInterviewSummary = { entries: [{ index: 0, title: "Panel 1", canRemove: true }], canAdd: true };
    const item: IInterviewItem = {
      name: "medications", type: "paneldynamic", title: "Medications", required: false,
      valueType: "array", summary: summary, entry: "Panel 1",
    };
    expect(item.summary.entries[0].title).toBe("Panel 1");
    const action: IInterviewAction = { action: "remove", index: 1 };
    expect(action.action).toBe("remove");
    const completed: IInterviewCompleteResult = { completed: true, errors: [], data: {}, completedHtml: "" };
    expect(completed.completed).toBe(true);
    const document: IInterviewDocument = {
      title: "Entry", progress: { answered: 0, remainingRequired: 1 }, changes: { becameVisible: ["q2"] },
    };
    expect(document.changes.becameVisible).toEqual(["q2"]);
    const tool: IInterviewToolDefinition = { name: "answer", description: "", inputSchema: {} };
    expect(tool.name).toBe("answer");
    interview.dispose();
  });

  test("The methods later tiers implement say so instead of answering wrongly", async () => {
    const interview = await createInterview(surveyJson);
    expect(() => interview.answer("q1", "a")).toThrow("not implemented: answer");
    expect(() => interview.skip()).toThrow("not implemented: skip");
    expect(() => interview.complete()).toThrow("not implemented: complete");
    expect(() => interview.answerAll({ q1: "a" })).toThrow("not implemented: answerAll");
    expect(() => interview.callTool("answer", {})).toThrow("not implemented: callTool");
    expect(() => interview.describeAll()).toThrow("not implemented: describeAll");
    expect(() => interview.getAnswerSchema()).toThrow("not implemented: getAnswerSchema");
    expect(() => interview.getTools()).toThrow("not implemented: getTools");
  });

  test("None of it leaks into the main survey-core entry point", () => {
    const main: any = SurveyCore;
    const names = ["createInterview", "Interview", "SurveyInterview", "toYaml", "renderInterviewDocument"];
    const leaked = names.filter(name => main[name] !== undefined);
    expect(leaked, "the interview is a separate entry point").toEqual([]);
  });
});
