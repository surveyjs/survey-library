import { describe, it, expect } from "vitest";
import {
  ReportBuilder,
  bucketCount,
  shouldFail,
  formatReport,
  REPORT_VERSION
} from "./report";

describe("ReportBuilder", () => {
  it("deduplicates identical entries and increments count", () => {
    const b = new ReportBuilder("formio");
    b.unsupported("formio.custom-conditional", "/components/0", "pages[0].elements[0]");
    b.unsupported("formio.custom-conditional", "/components/0", "pages[0].elements[0]");
    const report = b.build();
    expect(report.entries).toHaveLength(1);
    expect(report.entries[0].count).toBe(2);
    expect(report.version).toBe(REPORT_VERSION);
    expect(report.source).toBe("formio");
  });

  it("keeps distinct source pointers separate", () => {
    const b = new ReportBuilder("formio");
    b.assumed("formio.assumed-datagrid-model", "/components/0");
    b.assumed("formio.assumed-datagrid-model", "/components/1");
    expect(b.build().entries).toHaveLength(2);
  });

  it("counts occurrences per bucket", () => {
    const b = new ReportBuilder("json-schema");
    b.dropped("json-schema.dropped-styling", "/a");
    b.dropped("json-schema.dropped-styling", "/a");
    b.unknown("json-schema.unknown-keyword", "/b");
    const report = b.build();
    expect(bucketCount(report, "dropped")).toBe(2);
    expect(bucketCount(report, "unknown")).toBe(1);
    expect(bucketCount(report, "assumed")).toBe(0);
  });
});

describe("shouldFail", () => {
  it("fails when a named bucket has occurrences", () => {
    const b = new ReportBuilder("formio");
    b.unsupported("formio.unsupported-component", "/components/2");
    const report = b.build();
    expect(shouldFail(report, ["unsupported"])).toBe(true);
    expect(shouldFail(report, ["assumed"])).toBe(false);
    expect(shouldFail(report, ["assumed", "unsupported"])).toBe(true);
  });
});

describe("formatReport", () => {
  it("hides dropped entries unless verbose", () => {
    const b = new ReportBuilder("formio");
    b.dropped("formio.dropped-styling", "/components/0");
    const report = b.build();
    expect(formatReport(report)).not.toContain("dropped");
    expect(formatReport(report, { verbose: true })).toContain("dropped");
  });

  it("reports a clean conversion", () => {
    const report = new ReportBuilder("formio").build();
    expect(formatReport(report)).toContain("clean");
  });

  it("never leaks content - only codes, pointers, counts", () => {
    const b = new ReportBuilder("formio");
    b.unsupported("formio.custom-conditional", "/components/0/customConditional", "pages[0].elements[1]");
    const text = formatReport(b.build());
    expect(text).toContain("formio.custom-conditional");
    expect(text).toContain("/components/0/customConditional");
    expect(text).toContain("pages[0].elements[1]");
  });
});
