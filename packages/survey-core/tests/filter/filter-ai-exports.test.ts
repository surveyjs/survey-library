import { describe, test, expect } from "vitest";
import { createFilter } from "./filter-test-helpers";
// The package entry: vitest aliases "survey-core" to entries/index.ts.
import {
  FilterAIFeature, buildFilterAIContext, buildFilterAISystemPrompt, buildFilterAIInstruction, filterAIResponseFormat
} from "survey-core";

// Survey Creator writes a preset's filter with the control's own AI feature: it reaches it through the
// public entry.
describe("the filter's AI feature in the public entry", () => {
  test("the context, the prompts, the response format and the check of an answer", () => {
    const q = createFilter();
    const context = buildFilterAIContext(q);
    expect([context.fields.map((f) => f.name), filterAIResponseFormat.name], "#1").toEqual([["name", "country", "age"], "survey_filter"]);
    expect(buildFilterAISystemPrompt(context).indexOf("Prefer the fields form") > -1, "#2").toBe(true);
    expect(buildFilterAIInstruction("modify", "only adults", "{age} > 1").indexOf("Change it like this:") > -1, "#3").toBe(true);
    const feature = new FilterAIFeature(() => q.getFilterFields());
    const read = (expression: string) => feature.parse({ expression: expression, title: "", explanation: "" }, "");
    expect([feature.validate(read("{age} > 1 or {age} < 0"), "generate"), feature.validate(read("{age} >"), "generate").map((i) => i.code)], "#4")
      .toEqual([[], ["filter:syntax"]]);
  });
});
