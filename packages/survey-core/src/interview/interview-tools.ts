import type { IInterviewToolDefinition, IInterviewToolOptions } from "./interview-types";

// The three tools an agent needs to conduct a survey: look, answer, submit. They are plain data in
// the MCP shape - name, description, inputSchema. A function-calling API takes them once that one key
// is renamed - "parameters" for OpenAI, "input_schema" for Anthropic - and nothing in this module
// talks to a network or knows that one exists.
//
// The descriptions are fixed English. Every other text the interview produces is a localized model
// string, but these are not shown to the interviewee: they are read by the agent's own model, which
// is prompted in whatever language the host chose, and a tool description that changed with the
// survey's locale would change the agent's behaviour with it.

export const InterviewToolNames = Object.freeze({
  describe: "describe_survey",
  answer: "answer_survey",
  complete: "complete_survey",
});

const BASE_NAMES = [InterviewToolNames.describe, InterviewToolNames.answer, InterviewToolNames.complete];

// OpenAI and Anthropic both take a tool name of ^[a-zA-Z0-9_-]{1,64}$, so a prefix holds those
// characters only, and no more of them than the longest base name leaves room for.
const NAME_CHARS_REGEX = /^[a-zA-Z0-9_-]*$/;
const MAX_NAME_LENGTH = 64;

const DESCRIPTIONS: { [name: string]: string } = {
  [InterviewToolNames.describe]:
    "Return the questions that still need an answer, as Markdown with a YAML block.",
  [InterviewToolNames.answer]:
    "Answer one or more questions. Returns validation errors and the questions that became visible or required.",
  [InterviewToolNames.complete]:
    "Validate everything and submit the survey.",
};

export function getToolDefinitions(answerSchema: any, options?: IInterviewToolOptions): Array<IInterviewToolDefinition> {
  const prefix = getPrefix(options);
  return [
    createTool(prefix, InterviewToolNames.describe, createEmptySchema()),
    createTool(prefix, InterviewToolNames.answer, answerSchema),
    createTool(prefix, InterviewToolNames.complete, createEmptySchema()),
  ];
}

function getPrefix(options?: IInterviewToolOptions): string {
  const prefix = !!options ? options.prefix : undefined;
  if (prefix === undefined) return "";
  const room = MAX_NAME_LENGTH - Math.max.apply(Math, BASE_NAMES.map(name => name.length));
  if (typeof prefix !== "string" || !NAME_CHARS_REGEX.test(prefix) || prefix.length > room) {
    throw new TypeError("getTools: a prefix is at most " + room + " letters, digits, \"_\" or \"-\", so " +
      "that every tool name matches ^[a-zA-Z0-9_-]{1,64}$; it received " + JSON.stringify(prefix) + ".");
  }
  return prefix;
}

// A new object for every definition: a host that decorates one must not change the others.
function createEmptySchema(): any {
  return { type: "object", properties: {} };
}

function createTool(prefix: string, name: string, inputSchema: any): IInterviewToolDefinition {
  return { name: prefix + name, description: DESCRIPTIONS[name], inputSchema: inputSchema };
}

// callTool takes the name the definitions carry, prefix and all, and the prefix is the host's own
// string that getTools() was never asked to remember. So a name is matched by what it ends with -
// which is exactly what makes one server able to expose several surveys under one set of tools.
export function getToolBaseName(name: string): string {
  if (typeof name !== "string") return undefined;
  return BASE_NAMES.filter(base => name === base ||
    (name.length > base.length && name.substring(name.length - base.length) === base))[0];
}
