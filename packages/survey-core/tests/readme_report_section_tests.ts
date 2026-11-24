import { describe, expect, test } from "vitest";
import * as fs from "fs";
import * as path from "path";

// survey-core's README holds the source text of the "Missing API or found a bug?" section.
// Each published package carries a copy, because npm and node_modules readers can't follow
// relative links. AGENTS.md and CONTRIBUTING.md link to the survey-core copy.
const heading = "## Missing API or found a bug?";
const packagesDir = path.resolve(__dirname, "../..");
const copies = ["survey-react-ui", "survey-angular-ui", "survey-vue3-ui", "survey-js-ui", "converter"];

function readSection(packageName: string): string {
  const text = fs.readFileSync(path.join(packagesDir, packageName, "README.md"), "utf8").replace(/\r\n/g, "\n");
  const start = text.indexOf(heading + "\n");
  if (start < 0) return "";
  const end = text.indexOf("\n## ", start + heading.length);
  return text.substring(start, end < 0 ? text.length : end).trim();
}

describe("README section 'Missing API or found a bug?'", () => {
  const source = readSection("survey-core");
  test("survey-core README has the section", () => {
    expect(source.length).toBeGreaterThan(heading.length);
  });
  test.each(copies)("%s README has the same text as survey-core", (packageName) => {
    expect(readSection(packageName)).toBe(source);
  });
});
