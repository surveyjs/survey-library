import { describe, expect, test } from "vitest";
import { getDisallowedHtml, sanitizeHtml } from "../../src/plugins/rich-text/sanitizer";

describe("values written by other code", () => {
  test("plain text with an ampersand, a less-than and a line feed renders as typed", () => {
    const value = "Typed: a < b & c\nSecond line";
    expect(sanitizeHtml(value)).toBe("Typed: a < b & c<br>Second line");
    expect(getDisallowedHtml(value)).toEqual([]);
  });

  test("an unknown tag is unwrapped and reported", () => {
    expect(sanitizeHtml("Press <Enter> to continue")).toBe("Press  to continue");
    expect(getDisallowedHtml("Press <Enter> to continue")).toContain("enter");
  });

  test("a character reference is decoded and is not disallowed", () => {
    expect(sanitizeHtml("&copy; 2026")).toBe("\u00A9 2026");
    expect(getDisallowedHtml("&copy; 2026")).toEqual([]);
  });
});
