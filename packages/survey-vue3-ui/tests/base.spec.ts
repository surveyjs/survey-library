import { QuestionTextModel } from "survey-core";
import { makeReactive, unMakeReactive } from "../src/base";
import { describe, it, expect } from "vitest";

describe("check base reactivity", () => {
  it("check reactivity works correctly when multiple elements depend on one base element", () => {
    const base = new QuestionTextModel("q1");
    expect(base.createArrayCoreHandler).toBeUndefined();
    makeReactive(base);
    let createArrayCoreHandler = base.createArrayCoreHandler;
    expect(createArrayCoreHandler).toBeDefined();
    expect(base["__vueImplemented"]).toEqual(1);

    makeReactive(base);
    //check handlers are not overriden
    expect(base.createArrayCoreHandler).toEqual(createArrayCoreHandler);
    expect(base["__vueImplemented"]).toEqual(2);

    makeReactive(base);
    //check handlers are not overriden
    expect(base.createArrayCoreHandler).toEqual(createArrayCoreHandler);
    expect(base["__vueImplemented"]).toEqual(3);

    unMakeReactive(base);
    //check handlers are not reseted
    expect(base.createArrayCoreHandler).toEqual(createArrayCoreHandler);
    expect(base["__vueImplemented"]).toEqual(2);

    unMakeReactive(base);
    //check handlers are not reseted
    expect(base.createArrayCoreHandler).toEqual(createArrayCoreHandler);
    expect(base["__vueImplemented"]).toEqual(1);

    unMakeReactive(base);
    //check handlers are reseted
    expect(base.createArrayCoreHandler).toBeUndefined();
    expect(base["__vueImplemented"]).toBeUndefined();

    makeReactive(base);
    createArrayCoreHandler = base.createArrayCoreHandler;
    expect(createArrayCoreHandler).toBeDefined();
    expect(base["__vueImplemented"]).toEqual(1);

    makeReactive(base);
    //check handlers are not overriden
    expect(base.createArrayCoreHandler).toEqual(createArrayCoreHandler);
    expect(base["__vueImplemented"]).toEqual(2);

    makeReactive(base);
    //check handlers are not overriden
    expect(base.createArrayCoreHandler).toEqual(createArrayCoreHandler);
    expect(base["__vueImplemented"]).toEqual(3);

    unMakeReactive(base);
    //check handlers are not reseted
    expect(base.createArrayCoreHandler).toEqual(createArrayCoreHandler);
    expect(base["__vueImplemented"]).toEqual(2);

    unMakeReactive(base);
    //check handlers are not reseted
    expect(base.createArrayCoreHandler).toEqual(createArrayCoreHandler);
    expect(base["__vueImplemented"]).toEqual(1);

    unMakeReactive(base);
    //check handlers are reseted
    expect(base.createArrayCoreHandler).toBeUndefined();
    expect(base["__vueImplemented"]).toBeUndefined();
  });
});
