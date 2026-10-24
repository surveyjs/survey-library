// @vitest-environment node
import { createInterview } from "survey-core/interview";
import type { IInterview } from "survey-core/interview";

import { describe, expect, test } from "vitest";

const petJson = {
  title: "Pet survey",
  clearInvisibleValues: "onHidden",
  elements: [
    { type: "radiogroup", name: "hasPet", title: "Do you have a pet?", isRequired: true, choices: ["Yes", "No"] },
    { type: "dropdown", name: "petType", title: "What kind?", isRequired: true, visibleIf: "{hasPet} = 'Yes'",
      choices: ["Dog", "Cat", "Other"] },
  ],
};

const EMPTY_SCHEMA = { type: "object", properties: {} };

function toolNames(interview: IInterview, prefix?: string): Array<string> {
  return interview.getTools(!!prefix ? { prefix: prefix } : undefined).map(tool => tool.name);
}

describe("interview tools (issue #11818)", () => {
  test("Three definitions in the MCP shape", async () => {
    const iv = await createInterview(petJson);
    const tools = iv.getTools();
    expect(tools.length).toBe(3);
    expect(toolNames(iv)).toEqual(["describe_survey", "answer_survey", "complete_survey"]);
    tools.forEach(tool => {
      expect(typeof tool.description, tool.name + " has a description").toBe("string");
      expect(tool.description.length).toBeGreaterThan(0);
      expect(typeof tool.inputSchema.type).toBe("string");
    });
    expect(tools[0].inputSchema).toEqual(EMPTY_SCHEMA);
    expect(tools[2].inputSchema).toEqual(EMPTY_SCHEMA);
    // The one tool that takes arguments takes exactly what the answer schema describes, as it is at
    // the moment getTools() is called.
    expect(tools[1].inputSchema).toEqual(iv.getAnswerSchema());
    expect(Object.keys(tools[1].inputSchema.properties)).toEqual(["hasPet"]);
    await iv.answerAll({ hasPet: "Yes" });
    expect(Object.keys(iv.getTools()[1].inputSchema.properties)).toEqual(["petType"]);
  });

  test("A prefix lets one server expose several surveys", async () => {
    const iv = await createInterview(petJson);
    expect(toolNames(iv, "pets_")).toEqual(["pets_describe_survey", "pets_answer_survey", "pets_complete_survey"]);
    // The definitions are plain data and nothing remembers the prefix, so callTool takes the name
    // back the way the definition carried it.
    expect(await iv.callTool("pets_describe_survey", {})).toBe(iv.describeAll());
  });

  test("Every definition carries a schema object of its own", async () => {
    const iv = await createInterview(petJson);
    const first = iv.getTools();
    const second = iv.getTools();
    expect(first[0].inputSchema).not.toBe(first[2].inputSchema);
    expect(first[0].inputSchema.properties).not.toBe(first[2].inputSchema.properties);
    expect(first[0].inputSchema).not.toBe(second[0].inputSchema);
    expect(first[0].inputSchema.properties).not.toBe(second[0].inputSchema.properties);
    // A host that decorates one definition does not change the next call's.
    first[0].inputSchema.properties.extra = { type: "string" };
    expect(iv.getTools()[0].inputSchema).toEqual(EMPTY_SCHEMA);
    expect(first[2].inputSchema).toEqual(EMPTY_SCHEMA);
  });

  test("A prefix that would make a name the function-calling APIs refuse throws", async () => {
    const iv = await createInterview(petJson);
    const longest = new Array(50).join("p");
    expect(longest.length).toBe(49);
    expect(toolNames(iv, longest)[2]).toBe(longest + "complete_survey");
    expect(toolNames(iv, "a-B_9")[0]).toBe("a-B_9describe_survey");
    [longest + "p", "a.b", "a b", "a/b", "\u00e9"].forEach(prefix => {
      expect(() => iv.getTools({ prefix: prefix }), JSON.stringify(prefix)).toThrow(TypeError);
    });
    expect(() => iv.getTools({ prefix: 5 as any })).toThrow(TypeError);
    expect(() => iv.getTools({ prefix: null as any })).toThrow(TypeError);
    expect(toolNames(iv, "")).toEqual(["describe_survey", "answer_survey", "complete_survey"]);
    expect(iv.getTools({}).length).toBe(3);
  });

  test("callTool runs each of the three", async () => {
    const iv = await createInterview(petJson);
    const described = await iv.callTool("describe_survey", {});
    expect(described).toBe(iv.describeAll());
    expect(described).toContain("- name: hasPet");

    const answered = await iv.callTool("answer_survey", { hasPet: "Yes" });
    expect(answered.errors).toEqual([]);
    expect(answered.becameVisible).toEqual(["petType"]);
    expect(answered.current.name).toBe("petType");

    expect((await iv.callTool("complete_survey", {})).completed,
      "a required question is still empty").toBe(false);
    await iv.callTool("answer_survey", { petType: "Dog" });
    const done = await iv.callTool("complete_survey", {});
    expect(done.completed).toBe(true);
    expect(done.data).toEqual({ hasPet: "Yes", petType: "Dog" });
  });

  test("An unknown tool name rejects", async () => {
    const iv = await createInterview(petJson);
    await expect(iv.callTool("delete_survey", {})).rejects.toThrow("unknown tool: delete_survey");
    await expect(iv.callTool(undefined, {})).rejects.toThrow("unknown tool:");
  });

  test("answer_survey without arguments is an empty batch, not a crash", async () => {
    const iv = await createInterview(petJson);
    const res = await iv.callTool("answer_survey", undefined);
    expect(res.errors).toEqual([]);
    expect(res.current.name).toBe("hasPet");
  });
});
