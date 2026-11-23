import { describe, test, expect } from "vitest";
import * as query from "survey-core/query";

describe("survey-core/query entry", () => {
  test("exports toMongoQuery and toSqlQuery and no other value", () => {
    expect(Object.keys(query).sort()).toEqual(["toMongoQuery", "toSqlQuery"]);
    expect(typeof query.toSqlQuery).toBe("function");
    expect(typeof query.toMongoQuery).toBe("function");
  });
});
