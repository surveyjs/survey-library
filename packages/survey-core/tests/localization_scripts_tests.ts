import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

const localizationDir = path.resolve(__dirname, "../src/localization");
const checkedScripts = ["Latin", "Cyrillic", "Greek"];

function getScripts(word: string): Array<string> {
  return checkedScripts.filter(script => new RegExp(`\\p{Script=${script}}`, "u").test(word));
}

function getMixedScriptWords(fileText: string): Array<string> {
  const res: Array<string> = [];
  const strings = fileText.match(/"(?:[^"\\]|\\.)*"/g) || [];
  strings.forEach(str => {
    const words = str.replace(/\\./g, " ").match(/[\p{L}\p{M}]+/gu) || [];
    words.forEach(word => {
      if (getScripts(word).length > 1 && res.indexOf(word) < 0) res.push(word);
    });
  });
  return res;
}

describe("Localization strings", () => {
  test("A word doesn't mix Latin, Cyrillic and Greek letters", () => {
    const files = fs.readdirSync(localizationDir).filter(name => name.endsWith(".ts"));
    expect(files.length > 50, "found localization files").toBeTruthy();
    const errors: { [file: string]: Array<string> } = {};
    files.forEach(file => {
      const words = getMixedScriptWords(fs.readFileSync(path.join(localizationDir, file), "utf8"));
      if (words.length > 0) errors[file] = words;
    });
    expect(errors).toEqual({});
  });
});
