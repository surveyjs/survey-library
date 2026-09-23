import { describe, test, expect } from "vitest";
import { applyFilter, applySort, createFilterRunner } from "../../src/dynamic-data/dynamic-data-filter";
import { DynamicDataSortDirection, IDynamicDataField } from "../../src/dynamic-data/dynamic-data-interfaces";
import { ConditionsParser } from "../../src/conditions/conditionsParser";
import { BinaryOperand, Const, Operand, Variable } from "../../src/expressions/expressions";
import { FunctionFactory } from "../../src/functionsfactory";

function sortBy(records: Array<any>, field: string, direction: DynamicDataSortDirection,
  fields?: Array<IDynamicDataField>): Array<number> {
  return applySort(records, [{ field: field, direction: direction }], fields);
}

// The filter is an ordinary survey expression over the record fields, so every operator and function
// of the expression language is available. These cover the ones a data grid actually uses.
describe("dynamic-data-filter: the filter expression", () => {
  const records = [
    { name: "Alpha", age: 10, tags: ["a", "b"], done: true },
    { name: "beta", age: 20, tags: ["b"], done: false },
    { name: "Gamma", age: 30, tags: [], done: true },
    { name: "", age: undefined, tags: undefined, done: undefined }
  ];
  test("equal", () => {
    expect(applyFilter(records, "{age} = 20")).toEqual([1]);
  });
  test("equal on strings is case-insensitive, as everywhere in the library", () => {
    expect(applyFilter(records, "{name} = 'alpha'")).toEqual([0]);
  });
  test("notequal", () => {
    expect(applyFilter(records, "{age} <> 20")).toEqual([0, 2, 3]);
  });
  test("contains on a string", () => {
    expect(applyFilter(records, "{name} contains 'amm'")).toEqual([2]);
    expect(applyFilter(records, "{name} contains 'ALP'")).toEqual([0]);
  });
  test("contains is array membership", () => {
    expect(applyFilter(records, "{tags} contains 'b'")).toEqual([0, 1]);
  });
  test("notcontains", () => {
    expect(applyFilter(records, "{name} notcontains 'a'")).toEqual([3]);
  });
  test("greater, less and their orequal forms", () => {
    expect(applyFilter(records, "{age} > 15")).toEqual([1, 2]);
    expect(applyFilter(records, "{age} < 25")).toEqual([0, 1]);
    expect(applyFilter(records, "{age} >= 20")).toEqual([1, 2]);
    expect(applyFilter(records, "{age} <= 20")).toEqual([0, 1]);
  });
  test("empty and notempty", () => {
    expect(applyFilter(records, "{age} empty")).toEqual([3]);
    expect(applyFilter(records, "{name} empty")).toEqual([3]);
    expect(applyFilter(records, "{age} notempty")).toEqual([0, 1, 2]);
  });
  // The operators the previous, structured filter could not express at all.
  test("anyof, allof and noneof", () => {
    expect(applyFilter(records, "{tags} anyof ['a', 'c']")).toEqual([0]);
    expect(applyFilter(records, "{tags} allof ['a', 'b']")).toEqual([0]);
    expect(applyFilter(records, "{name} noneof ['Alpha', 'beta']")).toEqual([2, 3]);
  });
  test("and, or and parentheses", () => {
    expect(applyFilter(records, "{age} > 5 and {done} = true")).toEqual([0, 2]);
    expect(applyFilter(records, "{age} = 10 or {age} = 30")).toEqual([0, 2]);
    expect(applyFilter(records, "({age} > 5 or {name} empty) and {done} <> false")).toEqual([0, 2, 3]);
  });
  test("arithmetic and a function inside the expression", () => {
    expect(applyFilter(records, "{age} * 2 > 40")).toEqual([2]);
    expect(applyFilter(records, "iif({age} > 15, true, false) = true")).toEqual([1, 2]);
  });
  test("an unknown field is undefined for every record", () => {
    expect(applyFilter(records, "{unknown} empty")).toEqual([0, 1, 2, 3]);
    expect(applyFilter(records, "{unknown} notempty")).toEqual([]);
  });
  test("an empty expression returns every index", () => {
    expect(applyFilter(records, "")).toEqual([0, 1, 2, 3]);
    expect(applyFilter(records, undefined)).toEqual([0, 1, 2, 3]);
  });
  test("a date field compares against a date literal", () => {
    const dates = [{ d: "2020-01-01" }, { d: "2020-06-01" }, { d: "2021-01-01" }];
    expect(applyFilter(dates, "{d} > '2020-03-01'")).toEqual([1, 2]);
  });
  test("the runner is built once and can be reused for every record", () => {
    const runner = createFilterRunner("{age} > 15");
    expect(applyFilter(records, runner)).toEqual([1, 2]);
    expect(applyFilter(records, runner)).toEqual([1, 2]);
    expect(createFilterRunner("")).toBe(undefined);
    expect(createFilterRunner(undefined)).toBe(undefined);
  });
  test("an expression that cannot be parsed throws", () => {
    expect(() => createFilterRunner("{age} >")).toThrow();
  });
  test("an expression with an async function throws: it cannot answer synchronously", () => {
    FunctionFactory.Instance.register("dynamicDataAsyncTest", (params: any[]): any => {
      return true;
    }, true);
    try {
      expect(() => createFilterRunner("dynamicDataAsyncTest({age}) = true")).toThrow();
    } finally {
      FunctionFactory.Instance.unregister("dynamicDataAsyncTest");
    }
  });
  test("a comment key is an ordinary field: the braces take the name as it is", () => {
    const withComments = [{ q1: 1, "q1-Comment": "hello" }, { q1: 2, "q1-Comment": "bye" }];
    expect(applyFilter(withComments, "{q1-Comment} = 'hello'")).toEqual([0]);
  });
});

// What a source that filters on its own side does with the expression it is handed: parse it and
// re-render the operand tree in its own dialect. This is the whole reason the filter is text.
describe("dynamic-data-filter: translating the expression for a source", () => {
  // A source only has to override the nodes it wants to change; everything else renders as usual.
  function quoteFieldNames(expression: string): string {
    const operand = new ConditionsParser().parseExpression(expression);
    return operand.toString((op: Operand): string => {
      return op.getType() === "variable" ? "\"" + (<Variable>op).variable + "\"" : undefined;
    });
  }
  // Or it walks the tree itself and emits its own dialect from scratch.
  function toSql(expression: string): string {
    const render = (op: Operand): string => {
      if (op.getType() === "variable") return "\"" + (<Variable>op).variable + "\"";
      if (op.getType() === "const") {
        const value = (<Const>op).correctValue;
        return typeof value === "string" ? "'" + value + "'" : String(value);
      }
      const binary = <BinaryOperand>op;
      const signs: any = { equal: "=", notequal: "<>", greater: ">", and: "AND", or: "OR" };
      return render(binary.leftOperand) + " " + (signs[binary.operator] || binary.operator) + " " +
        render(binary.rightOperand);
    };
    return render(new ConditionsParser().parseExpression(expression));
  }
  test("the operand tree carries the field names, the operators and the values", () => {
    const operand = <BinaryOperand>new ConditionsParser().parseExpression("{country} = 'de' and {age} > 18");
    expect(operand.getType()).toBe("binary");
    expect(operand.operator).toBe("and");
    const left = <BinaryOperand>operand.leftOperand;
    expect(left.operator).toBe("equal");
    expect((<Variable>left.leftOperand).variable).toBe("country");
    expect((<Const>left.rightOperand).correctValue).toBe("de");
    const right = <BinaryOperand>operand.rightOperand;
    expect(right.operator).toBe("greater");
    expect((<Variable>right.leftOperand).variable).toBe("age");
    expect((<Const>right.rightOperand).correctValue).toBe(18);
  });
  test("toString(callback) overrides only the nodes the source cares about", () => {
    expect(quoteFieldNames("{country} = 'de'")).toBe("(\"country\" == 'de')");
  });
  test("a source can emit its own dialect from the tree", () => {
    expect(toSql("{country} = 'de' and {age} > 18")).toBe("\"country\" = 'de' AND \"age\" > 18");
  });
});

describe("dynamic-data-filter: comparison", () => {
  test("dataType number compares numerically, even for strings", () => {
    const records = [{ v: "10" }, { v: "9" }, { v: "2" }];
    expect(sortBy(records, "v", "asc", [{ name: "v", dataType: "number" }])).toEqual([2, 1, 0]);
  });
  test("dataType string compares as text", () => {
    const records = [{ v: "10" }, { v: "9" }, { v: "2" }];
    expect(sortBy(records, "v", "asc", [{ name: "v", dataType: "string" }])).toEqual([0, 2, 1]);
  });
  test("dataType date compares chronologically", () => {
    const records = [{ v: "2021-01-01" }, { v: "2019-05-06" }, { v: new Date("2020-01-01") }];
    expect(sortBy(records, "v", "asc", [{ name: "v", dataType: "date" }])).toEqual([1, 2, 0]);
  });
  test("dataType boolean sorts false before true", () => {
    const records = [{ v: true }, { v: false }, { v: "true" }];
    expect(sortBy(records, "v", "asc", [{ name: "v", dataType: "boolean" }])).toEqual([1, 0, 2]);
  });
  test("dataType any: two numbers compare numerically", () => {
    const records = [{ v: 10 }, { v: 9 }, { v: 2 }];
    expect(sortBy(records, "v", "asc")).toEqual([2, 1, 0]);
  });
  test("dataType any: two numeric strings compare numerically", () => {
    const records = [{ v: "10" }, { v: "9" }, { v: "2" }];
    expect(sortBy(records, "v", "asc")).toEqual([2, 1, 0]);
  });
  test("dataType any: two strings compare with localeCompare", () => {
    const records = [{ v: "b" }, { v: "c" }, { v: "a" }];
    expect(sortBy(records, "v", "asc")).toEqual([2, 0, 1]);
  });
  test("dataType any: two Dates compare chronologically", () => {
    const records = [{ v: new Date("2021-01-01") }, { v: new Date("2019-01-01") }];
    expect(sortBy(records, "v", "asc")).toEqual([1, 0]);
  });
  test("dataType any: two booleans sort false first", () => {
    const records = [{ v: true }, { v: false }];
    expect(sortBy(records, "v", "asc")).toEqual([1, 0]);
  });
  test("a custom comparer wins over the dataType", () => {
    const fields: Array<IDynamicDataField> = [{
      name: "v", dataType: "number",
      compare: (a: any, b: any): number => String(a).length - String(b).length
    }];
    const records = [{ v: 100 }, { v: 1 }, { v: 10 }];
    expect(sortBy(records, "v", "asc", fields)).toEqual([1, 2, 0]);
    expect(sortBy(records, "v", "desc", fields)).toEqual([0, 2, 1]);
  });
});

describe("dynamic-data-filter: applySort", () => {
  const records = [
    { group: "b", name: "x", order: 2 },
    { group: "a", name: "y", order: 1 },
    { group: "b", name: "a", order: 3 },
    { group: "a", name: "z", order: 4 }
  ];
  test("ascending and descending", () => {
    expect(sortBy(records, "order", "asc")).toEqual([1, 0, 2, 3]);
    expect(sortBy(records, "order", "desc")).toEqual([3, 2, 0, 1]);
  });
  test("multi-field sort applies the items in order", () => {
    expect(applySort(records, [
      { field: "group", direction: "asc" },
      { field: "name", direction: "desc" }
    ])).toEqual([3, 1, 0, 2]);
  });
  test("the sort is stable: equal records keep their original order", () => {
    const equalRecords = [{ k: 1, id: "a" }, { k: 1, id: "b" }, { k: 0, id: "c" }, { k: 1, id: "d" }];
    expect(sortBy(equalRecords, "k", "asc")).toEqual([2, 0, 1, 3]);
    expect(sortBy(equalRecords, "k", "desc")).toEqual([0, 1, 3, 2]);
  });
  test("empty values sort last in both directions", () => {
    const withEmpty = [{ v: 2 }, { v: undefined }, { v: 1 }, { v: "" }];
    expect(sortBy(withEmpty, "v", "asc")).toEqual([2, 0, 1, 3]);
    expect(sortBy(withEmpty, "v", "desc")).toEqual([0, 2, 1, 3]);
  });
  test("an empty sort returns the incoming indexes instance", () => {
    const indexes = [2, 0];
    expect(applySort(records, [], undefined, indexes)).toBe(indexes);
    expect(applySort(records, undefined)).toEqual([0, 1, 2, 3]);
  });
  test("the sort is limited to the given indexes and does not modify them", () => {
    const indexes = [3, 2, 1];
    expect(applySort(records, [{ field: "order", direction: "asc" }], undefined, indexes)).toEqual([1, 2, 3]);
    expect(indexes).toEqual([3, 2, 1]);
  });
});
