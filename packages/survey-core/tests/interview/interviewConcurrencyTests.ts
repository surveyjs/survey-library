import { createInterview } from "survey-core/interview";
import type { IInterviewResult } from "survey-core/interview";

import { describe, expect, test } from "vitest";

// A host that does not await one call before the next - two tool calls an agent sent in one turn, a
// chat widget that fires on every keystroke - gets the same answers as one that does: the mutating
// calls of one interview run one after the other.

const json = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2", visibleIf: "{q1} notempty" },
    { type: "text", name: "q3", isRequired: true },
  ],
};

function summarize(res: IInterviewResult): any {
  return { errors: res.errors, current: !!res.current ? res.current.name : null, describe: res.describe };
}

describe("concurrent calls on one interview (issue #11818)", () => {
  test("Two answerAll calls without an await between them answer as two sequential calls", async () => {
    const sequential = await createInterview(json);
    const first = summarize(await sequential.answerAll({ q1: "a" }));
    const second = summarize(await sequential.answerAll({ q2: "b" }));

    const iv = await createInterview(json);
    const results = await Promise.all([iv.answerAll({ q1: "a" }), iv.answerAll({ q2: "b" })]);
    expect(iv.data).toEqual(sequential.data);
    expect(summarize(results[0]), "the first result does not report the second call's write").toEqual(first);
    expect(summarize(results[1])).toEqual(second);
  });

  test("Two answer calls without an await between them answer as two sequential calls", async () => {
    const sequential = await createInterview(json);
    const first = summarize(await sequential.answer("a"));
    const second = summarize(await sequential.answer("b"));

    const iv = await createInterview(json);
    const results = await Promise.all([iv.answer("a"), iv.answer("b")]);
    expect(iv.data).toEqual({ q1: "a", q2: "b" });
    expect(summarize(results[0])).toEqual(first);
    expect(summarize(results[1])).toEqual(second);
  });

  test("A call that rejects does not block the next one", async () => {
    const iv = await createInterview(json);
    const broken: any = {};
    Object.defineProperty(broken, "q1", { enumerable: true, get: () => { throw new Error("broken value"); } });
    const failing = iv.answerAll(broken);
    const good = iv.answerAll({ q3: "c" });
    await expect(failing).rejects.toThrow("broken value");
    expect((await good).errors).toEqual([]);
    expect(iv.data).toEqual({ q3: "c" });
  });

  test("Tool calls are serialized too, and a tool call does not wait for itself", async () => {
    const sequential = await createInterview(json);
    await sequential.answerAll({ q1: "a", q3: "c" });
    const expected = sequential.describeAll();

    const iv = await createInterview(json);
    const answered = iv.callTool("answer_survey", { q1: "a", q3: "c" });
    const described = iv.callTool("describe_survey", {});
    const completed = iv.callTool("complete_survey", {});
    expect((await answered).errors).toEqual([]);
    expect(await described, "the read runs after the write before it").toBe(expected);
    expect((await completed).completed).toBe(true);
    expect(iv.data).toEqual({ q1: "a", q3: "c" });
  });

  test("A call on an idle interview starts at once", async () => {
    const iv = await createInterview(json);
    const pending = iv.answer("a");
    // The write is synchronous up to the settle, as it was before the calls were serialized: a host
    // reading the model right after the call sees the value it sent.
    expect(iv.survey.getValue("q1")).toBe("a");
    await pending;
    const next = iv.answer("b");
    expect(iv.survey.getValue("q2")).toBe("b");
    await next;
  });
});
