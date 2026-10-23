import type { IInterviewToolDefinition, IInterviewToolOptions } from "./interview-types";

// The three tools an agent needs to conduct a survey: look, answer, submit. They are plain data in
// the MCP shape - name, description, inputSchema - which every function-calling API accepts after
// renaming one key, and nothing in this module talks to a network or knows that one exists.
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

const EMPTY_SCHEMA = { type: "object", properties: {} };

const DESCRIPTIONS: { [name: string]: string } = {
  [InterviewToolNames.describe]:
    "Return the questions that still need an answer, as Markdown with a YAML block.",
  [InterviewToolNames.answer]:
    "Answer one or more questions. Returns validation errors and the questions that became visible or required.",
  [InterviewToolNames.complete]:
    "Validate everything and submit the survey.",
};

export function getToolDefinitions(answerSchema: any, options?: IInterviewToolOptions): Array<IInterviewToolDefinition> {
  const prefix = !!options && typeof options.prefix === "string" ? options.prefix : "";
  return [
    createTool(prefix, InterviewToolNames.describe, EMPTY_SCHEMA),
    createTool(prefix, InterviewToolNames.answer, answerSchema),
    createTool(prefix, InterviewToolNames.complete, EMPTY_SCHEMA),
  ];
}

function createTool(prefix: string, name: string, inputSchema: any): IInterviewToolDefinition {
  return { name: prefix + name, description: DESCRIPTIONS[name], inputSchema: inputSchema };
}

// callTool takes the name the definitions carry, prefix and all, and the prefix is the host's own
// string that getTools() was never asked to remember. So a name is matched by what it ends with -
// which is exactly what makes one server able to expose several surveys under one set of tools.
export function getToolBaseName(name: string): string {
  if (typeof name !== "string") return undefined;
  const known = [InterviewToolNames.describe, InterviewToolNames.answer, InterviewToolNames.complete];
  return known.filter(base => name === base ||
    (name.length > base.length && name.substring(name.length - base.length) === base))[0];
}
