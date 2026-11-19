import { getEmbeddedLicense, glc, hasLicense, setLicenseKey } from "survey-core";

import { afterEach, describe, expect, test } from "vitest";

const wordpressUrl = "https://surveyjs.io/wordpress#white-label";

describe("embedded license marker", () => {
  // The Vitest config doesn't isolate files, so reset the marker for the files that run after this one.
  afterEach(() => setLicenseKey("embedded-none"));

  test("embedded-wordpress gives its link and sets no license", () => {
    setLicenseKey("embedded-wordpress");
    expect(getEmbeddedLicense()).toEqual({ name: "wordpress", whiteLabelUrl: wordpressUrl });
    expect(hasLicense(1)).toBe(false);
    expect(hasLicense(2)).toBe(false);
    expect(hasLicense(4)).toBe(false);
    expect(glc(1)).toBe(false);
  });
  test("the marker ignores case and surrounding spaces", () => {
    ["Embedded-WordPress", "embedded-wordpress ", " embedded-wordpress"].forEach(key => {
      setLicenseKey("embedded-none");
      setLicenseKey(key);
      expect(getEmbeddedLicense(), key).toEqual({ name: "wordpress", whiteLabelUrl: wordpressUrl });
    });
  });
  test("a later marker replaces the name", () => {
    setLicenseKey("embedded-wordpress");
    setLicenseKey("embedded-studio");
    expect(getEmbeddedLicense()).toEqual({ name: "studio", whiteLabelUrl: "https://surveyjs.io/studio#white-label" });
  });
  test("an unknown name counts as no marker", () => {
    setLicenseKey("embedded-wordpres");
    expect(getEmbeddedLicense()).toBeUndefined();
  });
  test("embedded-none resets a known marker", () => {
    setLicenseKey("embedded-wordpress");
    setLicenseKey("embedded-none");
    expect(getEmbeddedLicense()).toBeUndefined();
  });
  test("inherited object keys are unknown names", () => {
    setLicenseKey("embedded-constructor");
    expect(getEmbeddedLicense()).toBeUndefined();
    setLicenseKey("embedded-__proto__");
    expect(getEmbeddedLicense()).toBeUndefined();
  });
  test("getEmbeddedLicense returns a copy", () => {
    setLicenseKey("embedded-wordpress");
    const res = getEmbeddedLicense() as any;
    res.whiteLabelUrl = "changed";
    res.name = "changed";
    expect(getEmbeddedLicense()).toEqual({ name: "wordpress", whiteLabelUrl: wordpressUrl });
  });
  test("values that are not markers don't throw and don't change the marker", () => {
    const values: Array<any> = ["", undefined, "not a license key"];
    values.forEach(val => {
      expect(() => setLicenseKey(val)).not.toThrow();
      expect(getEmbeddedLicense()).toBeUndefined();
    });
    setLicenseKey("embedded-wordpress");
    values.forEach(val => {
      setLicenseKey(val);
      expect(getEmbeddedLicense()?.whiteLabelUrl).toBe(wordpressUrl);
    });
  });
});
