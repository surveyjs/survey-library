import { CssClassBuilder } from "../src/utils/cssClassBuilder";

import { describe, test, expect } from "vitest";
describe("cssClassBuilder", () => {
  test("Use calculated value in expression", () => {
    const builder = new CssClassBuilder();
    expect(builder.toString(), "Empty builder returns empty string").toBe("");
    builder.append("");
    expect(builder.toString(), "Append of empty string doesn't change empty builder state").toBe("");
    builder.append(null);
    expect(builder.toString(), "Append of null doesn't change empty builder state").toBe("");
    builder.append(undefined);
    expect(builder.toString(), "Append of undefined doesn't change empty builder state").toBe("");
    builder.append("class1", false);
    expect(builder.toString(), "Append of string with false condition doesn't change empty builder state").toBe("");

    builder.append("class1");
    expect(builder.toString(), "Append string changes builder state").toBe("class1");
    builder.append("");
    expect(builder.toString(), "Append of empty string doesn't change builder state").toBe("class1");
    builder.append(null);
    expect(builder.toString(), "Append of null doesn't change builder state").toBe("class1");
    builder.append(undefined);
    expect(builder.toString(), "Append of undefined doesn't change builder state").toBe("class1");
    builder.append("class1", false);
    expect(builder.toString(), "Append of string with false condition doesn't change builder state").toBe("class1");

    builder.append("class2", true);
    expect(builder.toString(), "Append of string with true condition changes builder state").toBe("class1 class2");
    builder.append("class3 class4");
    expect(builder.toString(), "Append of string with two clasess changes builder state").toBe("class1 class2 class3 class4");
    builder.append("class5 ", true);
    expect(builder.toString(), "Append of space ended class trimmed").toBe("class1 class2 class3 class4 class5");

  });
});
