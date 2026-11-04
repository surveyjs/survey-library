import { describe, test, expect } from "vitest";
import { AIRequestEvent, AIRequestIssue } from "../../src/interfaces/ai-interfaces";
import { AIRequestResult, AIRequestSession, IAIFeature, IAIRequest, IAIRequestOwner } from "../../src/ai/ai-request";
import { readAIJson } from "../../src/ai/ai-response";

// A feature that is not the expression one: its answer is { value }, and a value starting with "bad"
// is an error, one starting with "meh" a warning.
interface IFakeAnswer { value: string }
const fakeFeature: IAIFeature<IFakeAnswer> = {
  feature: "fake",
  responseFormat: { name: "fake", schema: { type: "object", properties: { value: { type: "string" } } } },
  parse: (data: any, text: string): IFakeAnswer => ({ value: !!data && typeof data.value === "string" ? data.value : (text || "").trim() }),
  isEmpty: (answer: IFakeAnswer): boolean => !answer.value,
  serialize: (answer: IFakeAnswer): string => JSON.stringify(answer),
  validate: (answer: IFakeAnswer, action: string): Array<AIRequestIssue> => {
    if (action === "describe") return [];
    if (answer.value.indexOf("bad") === 0) return [{ severity: "error", message: "\"" + answer.value + "\" is bad", code: "fake:bad" }];
    if (answer.value.indexOf("meh") === 0) return [{ severity: "warning", message: "meh" }];
    return [];
  },
  buildFixInstruction: (answer: IFakeAnswer, issues: Array<AIRequestIssue>): string =>
    "Fix " + answer.value + ": " + issues.map(i => i.message).join("; "),
};

// The owner a product passes: it collects the fired options; one fix attempt unless told otherwise,
// as Survey Creator's aiFixAttempts default
function createOwner(requests: Array<any>, options?: { aiFixAttempts?: number }): IAIRequestOwner {
  const fixAttempts = !!options && options.aiFixAttempts !== undefined ? options.aiFixAttempts : 1;
  return { fire: (options: AIRequestEvent) => { requests.push(options); }, getFixAttempts: () => fixAttempts };
}
function createSession(options?: { aiFixAttempts?: number }): { session: AIRequestSession<IFakeAnswer>, requests: Array<AIRequestEvent & { [name: string]: any }> } {
  const requests: Array<any> = [];
  return { session: new AIRequestSession<IFakeAnswer>(createOwner(requests, options)), requests: requests };
}
function createRequest(action: string = "make", instruction: string = "Make it", more?: Partial<IAIRequest<IFakeAnswer>>): IAIRequest<IFakeAnswer> {
  return <IAIRequest<IFakeAnswer>>Object.assign({
    feature: fakeFeature, action: action, userPrompt: "a prompt", instruction: instruction,
    context: { names: ["a", "b"] }, systemPrompt: "names: a,b",
    buildSystemPrompt: (context: any) => "names: " + context.names.join(","),
  }, more || {});
}

describe("AIRequestSession (ai-request)", () => {
  test("one request: the payload every feature shares", () => {
    const { session, requests } = createSession();
    const results: Array<AIRequestResult<IFakeAnswer>> = [];
    session.send(createRequest(), r => results.push(r));
    expect(requests).toHaveLength(1);
    const request = requests[0];
    expect(request.feature).toBe("fake");
    expect(request.action).toBe("make");
    expect(request.userPrompt).toBe("a prompt");
    expect(request.attempt).toBe(0);
    expect(request.issues).toEqual([]);
    expect(request.systemPrompt).toBe("names: a,b");
    expect(request.messages).toEqual([{ role: "user", content: "Make it" }]);
    expect(request.responseFormat).toEqual(fakeFeature.responseFormat);
    expect(request.signal.aborted).toBe(false);
    request.callback({ text: "good" });
    expect(results).toEqual([{ status: "answer", answer: { value: "good" }, issues: [], attempts: 0 }]);
  });
  test("the feature's own fields are in the payload; a retry gets them for the rejected answer", () => {
    const { session, requests } = createSession();
    session.send(createRequest("make", "Make it", {
      getFields: (retryOf?: IFakeAnswer) => ({ current: !!retryOf ? retryOf.value : "start", feature: "not overridden" }),
    }), () => { });
    expect(requests[0].current).toBe("start");
    expect(requests[0].feature).toBe("fake");
    requests[0].callback({ text: "bad1" });
    expect(requests[1].current).toBe("bad1");
  });
  test("rebuildSystemPrompt builds from the changed context of this request only", () => {
    const { session, requests } = createSession();
    session.send(createRequest(), () => { });
    requests[0].context.names.push("c");
    requests[0].rebuildSystemPrompt();
    expect(requests[0].systemPrompt).toBe("names: a,b,c");
    requests[0].callback({ text: "good" });
    session.send(createRequest(), () => { });
    expect(requests[1].context).toEqual({ names: ["a", "b"] });
    expect(requests[1].systemPrompt).toBe("names: a,b");
  });
  test("reading: text with JSON, fenced JSON, data, error, no answer", () => {
    const { session, requests } = createSession();
    const results: Array<any> = [];
    const send = () => session.send(createRequest(), r => results.push(r));
    send(); requests[0].callback({ text: "{\"value\": \"from json\", \"extra\": 1}" });
    send(); requests[1].callback({ text: "```json\n{\"value\": \"from fence\"}\n```" });
    send(); requests[2].callback({ data: { value: "from data" }, text: "ignored" });
    send(); requests[3].callback({ error: "Quota exceeded" });
    send(); requests[4].callback();
    send(); requests[5].callback({ text: "  plain  " });
    expect(results.map(r => r.status === "error" ? r.error : r.answer.value)).toEqual(["from json", "from fence", "from data", "Quota exceeded", "", "plain"]);
    expect(results.map(r => r.status)).toEqual(["answer", "answer", "answer", "error", "empty", "answer"]);
  });
  test("readAIJson: an object, alone or fenced; nothing else", () => {
    expect(readAIJson(" {\"a\": 1} ")).toEqual({ a: 1 });
    expect(readAIJson("```\n{\"a\": 1}\n```")).toEqual({ a: 1 });
    expect(readAIJson("[1]")).toBeUndefined();
    expect(readAIJson("```json\n[1]\n```")).toBeUndefined();
    expect(readAIJson("{not json")).toBeUndefined();
    expect(readAIJson("say {\"a\": 1}")).toBeUndefined();
    expect(readAIJson(undefined)).toBeUndefined();
  });
  test("an error issue sends the answer back with attempt 1, the English issues, the answer and the fix instruction", () => {
    const { session, requests } = createSession();
    const results: Array<any> = [];
    const retries: Array<number> = [];
    session.send(createRequest("make", "Make it", { onRetry: (_, __, attempt) => retries.push(attempt) }), r => results.push(r));
    requests[0].callback({ text: "bad1" });
    expect(requests).toHaveLength(2);
    expect(retries).toEqual([1]);
    expect(results).toHaveLength(0);
    const retry = requests[1];
    expect(retry.action).toBe("make");
    expect(retry.userPrompt).toBe("a prompt");
    expect(retry.attempt).toBe(1);
    expect(retry.issues).toEqual([{ severity: "error", message: "\"bad1\" is bad", code: "fake:bad" }]);
    expect(retry.messages).toEqual([
      { role: "user", content: "Make it" },
      { role: "assistant", content: "{\"value\":\"bad1\"}" },
      { role: "user", content: "Fix bad1: \"bad1\" is bad" },
    ]);
    retry.callback({ text: "good" });
    expect(results).toEqual([{ status: "answer", answer: { value: "good" }, issues: [], attempts: 1 }]);
  });
  test("aiFixAttempts: 0 sends none back, 2 sends two; a warning sends none", () => {
    let { session, requests } = createSession({ aiFixAttempts: 0 });
    const results: Array<any> = [];
    session.send(createRequest(), r => results.push(r));
    requests[0].callback({ text: "bad1" });
    expect(requests).toHaveLength(1);
    expect(results[0].status).toBe("answer");
    expect(results[0].issues.map(i => i.code)).toEqual(["fake:bad"]);

    ({ session, requests } = createSession({ aiFixAttempts: 2 }));
    session.send(createRequest(), r => results.push(r));
    requests[0].callback({ text: "bad1" });
    requests[1].callback({ text: "bad2" });
    requests[2].callback({ text: "bad3" });
    expect(requests.map(r => r.attempt)).toEqual([0, 1, 2]);
    expect(results[1]).toEqual({ status: "answer", answer: { value: "bad3" }, issues: [{ severity: "error", message: "\"bad3\" is bad", code: "fake:bad" }], attempts: 2 });

    ({ session, requests } = createSession());
    session.send(createRequest(), r => results.push(r));
    requests[0].callback({ text: "meh" });
    expect(requests).toHaveLength(1);
    expect(results[2].issues).toEqual([{ severity: "warning", message: "meh" }]);
  });
  test("delivery: a second callback, one after cancel, after dispose or after a newer request is ignored", () => {
    const { session, requests } = createSession();
    const results: Array<any> = [];
    session.send(createRequest(), r => results.push(r));
    requests[0].callback({ text: "first" });
    requests[0].callback({ text: "second" });
    expect(results.map(r => r.answer.value)).toEqual(["first"]);

    session.send(createRequest(), r => results.push(r));
    session.cancel();
    expect(requests[1].signal.aborted).toBe(true);
    requests[1].callback({ text: "late" });

    session.send(createRequest(), r => results.push(r));
    session.send(createRequest(), r => results.push(r));
    expect(requests[2].signal.aborted).toBe(true);
    requests[2].callback({ text: "stale" });
    requests[3].callback({ text: "newer" });

    session.send(createRequest(), r => results.push(r));
    session.dispose();
    expect(requests[4].signal.aborted).toBe(true);
    requests[4].callback({ text: "after dispose" });
    session.send(createRequest(), r => results.push(r));
    expect(requests).toHaveLength(5);
    expect(results.map(r => r.answer.value)).toEqual(["first", "newer"]);
  });
  test("the conversation: answered turns are kept, a not-kept action, an error and a cancelled request are not", () => {
    const { session, requests } = createSession();
    session.send(createRequest("make", "one"), () => { });
    requests[0].callback({ text: "good" });
    session.send(createRequest("describe", "describe it", { keepTurn: false }), () => { });
    expect(requests[1].messages.map(m => m.content)).toEqual(["one", "{\"value\":\"good\"}", "describe it"]);
    requests[1].callback({ text: "a description" });
    session.send(createRequest("make", "two"), () => { });
    requests[2].callback({ error: "Network down" });
    session.send(createRequest("make", "three"), () => { });
    session.cancel();
    session.send(createRequest("make", "four"), () => { });
    requests[4].callback();
    session.send(createRequest("make", "five"), () => { });
    // an empty answer is a turn
    expect(requests[5].messages.map(m => m.content)).toEqual(["one", "{\"value\":\"good\"}", "four", "{\"value\":\"\"}", "five"]);
  });
  test("a handler that changes messages or context does not change the session's copy", () => {
    const { session, requests } = createSession();
    session.send(createRequest("make", "one"), () => { });
    requests[0].messages.push({ role: "assistant", content: "injected" });
    requests[0].context.names = [];
    requests[0].callback({ text: "good" });
    session.send(createRequest("make", "two"), () => { });
    expect(requests[1].messages.map(m => m.content)).toEqual(["one", "{\"value\":\"good\"}", "two"]);
    expect(requests[1].context).toEqual({ names: ["a", "b"] });
  });
  test("a handler that answers at once, inside fire", () => {
    let count = 0;
    const session = new AIRequestSession<IFakeAnswer>({
      fire: (options: AIRequestEvent) => { count++; options.callback({ text: count === 1 ? "bad1" : "good" }); },
      getFixAttempts: () => 1,
    });
    const results: Array<any> = [];
    session.send(createRequest(), r => results.push(r));
    expect(count).toBe(2);
    expect(results).toEqual([{ status: "answer", answer: { value: "good" }, issues: [], attempts: 1 }]);
  });
});
