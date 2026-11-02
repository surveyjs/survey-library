import { describe, test, expect } from "vitest";
import * as Survey from "survey-core";
import { FIXTURE_KEYS, getFixture } from "./index.ts";
import { loadQuietly, countsOf, plannedCounts } from "./fixture-checks.ts";

// 01 check 7: the fixtures load the same way on an older build (PERF_CORE_DIR, for example survey-core 3.2.0),
// so 02's master-against-3.2.0 checkpoint compares the same surveys. records-* need paging, which 3.2.0 lacks.
describe.runIf(!!process.env.PERF_CORE_DIR)("perf fixtures on PERF_CORE_DIR", () => {
  for (const key of FIXTURE_KEYS.filter((k: string) => k.indexOf("records-") !== 0)) {
    test(key + " loads with no warning, no jsonErrors and the planned counts on " + Survey.Version, () => {
      const fixture = getFixture(key);
      const { survey, warnings } = loadQuietly(Survey, fixture.json);
      expect(warnings, key).toEqual([]);
      expect(survey.jsonErrors, key).toBeNull();
      expect(countsOf(survey), key).toEqual(plannedCounts(fixture.meta));
    });
  }
});
