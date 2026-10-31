import { Scope, ValueScope } from "../src/utils/scope";
import { describe, test, expect } from "vitest";

describe("Scope", () => {
  test("Scope: active inside a run only, and a nested run that ends leaves the outer one active", () => {
    const scope = new Scope();
    const log: Array<string> = [];
    expect(scope.isActive).toBe(false);
    const res = scope.run((): number => {
      log.push("outer:" + scope.isActive);
      scope.run((): void => { log.push("inner:" + scope.isActive); });
      log.push("after inner:" + scope.isActive);
      return 5;
    });
    expect(res).toBe(5);
    expect(log).toEqual(["outer:true", "inner:true", "after inner:true"]);
    expect(scope.isActive).toBe(false);
  });
  test("Scope: a throw is rethrown as it is, and the scope is closed", () => {
    const scope = new Scope();
    const error = new Error("func");
    let isActiveAfterInnerThrow: boolean;
    expect(() => scope.run((): void => {
      try {
        scope.run((): void => { throw error; });
      } catch(e) {
        isActiveAfterInnerThrow = scope.isActive;
        throw e;
      }
    })).toThrow(error);
    expect(isActiveAfterInnerThrow).toBe(true);
    expect(scope.isActive).toBe(false);
    scope.run((): void => { expect(scope.isActive).toBe(true); });
    expect(scope.isActive).toBe(false);
  });
  test("ValueScope: the initial value outside every run, the run's value inside, the outer value back after a nested run", () => {
    const scope = new ValueScope<boolean>(false);
    const log: Array<string> = [];
    expect(scope.value).toBe(false);
    scope.run(true, (): void => {
      log.push("outer:" + scope.value);
      scope.run(false, (): void => { log.push("inner:" + scope.value); });
      log.push("after inner:" + scope.value);
    });
    expect(log).toEqual(["outer:true", "inner:false", "after inner:true"]);
    expect(scope.value).toBe(false);
    expect(new ValueScope<object>().value).toBeUndefined();
  });
  test("ValueScope: returns the run's result; a throw is rethrown as it is, and the outer value is restored", () => {
    const outer = { name: "outer" };
    const scope = new ValueScope<{ name: string }>();
    const error = new Error("func");
    let valueAfterInnerThrow: { name: string };
    const res = scope.run(outer, (): string => {
      try {
        scope.run({ name: "inner" }, (): void => { throw error; });
      } catch(e) {
        expect(e).toBe(error);
        valueAfterInnerThrow = scope.value;
      }
      return scope.value.name;
    });
    expect(res).toBe("outer");
    expect(valueAfterInnerThrow).toBe(outer);
    expect(scope.value).toBeUndefined();
    expect(() => scope.run(outer, (): void => { throw error; })).toThrow(error);
    expect(scope.value).toBeUndefined();
  });
});
