import { Helpers } from "@/helpers.ts";

test('fsharp tripple', () => {
  expect(Helpers.isArrayContainsEqual([1], [1, 2])).toBe(false);
})

