// A compile-time fixture, not a unit test: vitest does not type-check, so `npm run test:types` compiles this file.
// It guards the public export of toFilterTree and its types, and keeps the operator list below equal to
// FilterTreeOperator: a missing or an extra key fails the compile. tests/expressions/filterTreeTests.ts checks
// the same list against the shipped JSON Schema and against the operators toFilterTree emits.
// eslint-disable-next-line surveyjs/no-imports-from-entries
import { toFilterTree, FilterTreeNode, FilterTreeCondition, FilterTreeOperator } from "../../entries/chunks/model";

export const filterTreeOperators: Record<FilterTreeOperator, true> = {
  equal: true, notequal: true, greater: true, less: true, greaterorequal: true, lessorequal: true,
  contains: true, notcontains: true, anyof: true, noneof: true, allof: true, empty: true, notempty: true
};

const tree: FilterTreeNode | null = toFilterTree("{price} > 10");
const condition: FilterTreeCondition = { field: "price", op: "greater", value: 10 };
const isTree: boolean = !!tree && !!condition;

export { isTree };
