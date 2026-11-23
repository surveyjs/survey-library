import { describe, test, expect } from "vitest";
import * as query from "survey-core/query";

describe("survey-core/query entry", () => {
  test("exports toSqlQuery and no other value", () => {
    expect(Object.keys(query).sort()).toEqual(["toSqlQuery"]);
    expect(typeof query.toSqlQuery).toBe("function");
  });
});
