import { Question } from "../src/question";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { RendererFactory } from "../src/rendererFactory";

import { describe, test, expect } from "vitest";
describe("RenderFactoryTests", () => {
  const inst = RendererFactory.Instance;

  test("check register/unregister methods", () => {
    expect(inst.getRenderer("testType", "testRenderAs")).toBe("default");
    inst.registerRenderer("testType", "testRenderAs", "custom-component");

    expect(inst.getRenderer("testType", "testRenderAs")).toBe("custom-component");

    inst.unregisterRenderer("testType", "testRenderAs");

    expect(inst.getRenderer("testType", "testRenderAs")).toBe("default");
    inst.clear();
  });
  test("check register with default/unregister methods", () => {
    expect(inst.getRenderer("testType", "testRenderAs1"), "#1").toBe("default");
    expect(inst.getRenderer("testType", "testRenderAs2"), "2").toBe("default");

    inst.registerRenderer("testType", "testRenderAs1", "custom-component1");
    inst.registerRenderer("testType", "testRenderAs2", "custom-component2", true);
    expect(inst.getRenderer("testType", "testRenderAs1"), "#3").toBe("custom-component1");
    expect(inst.getRenderer("testType", "testRenderAs2"), "#4").toBe("custom-component2");
    expect(inst.getRenderer("testType", ""), "#5").toBe("custom-component2");
    expect(inst.getRenderer("testType", "default"), "#6").toBe("custom-component2");

    inst.unregisterRenderer("testType", "testRenderAs2");
    expect(inst.getRenderer("testType", "testRenderAs1"), "#7").toBe("custom-component1");
    expect(inst.getRenderer("testType", "testRenderAs2"), "#8").toBe("default");

    inst.unregisterRenderer("testType", "testRenderAs1");
    expect(inst.getRenderer("testType", "testRenderAs1"), "#9").toBe("default");
    expect(inst.getRenderer("testType", "testRenderAs2"), "#10").toBe("default");

    inst.clear();
  });
  test("Override the default rendering for a question", () => {
    const q = new QuestionRadiogroupModel("q1");
    expect(q.isDefaultRendering(), "the rendering is default").toBe(true);
    expect(q.getComponentName(), "the default component name").toBe("default");

    inst.registerRenderer("radiogroup", "testRenderAs", "custom-component", true);
    expect(q.isDefaultRendering(), "the rendering is not default").toBe(false);
    expect(q.getComponentName(), "the default component is custom now").toBe("custom-component");

    inst.clear();
    expect(q.isDefaultRendering(), "the rendering is default again").toBe(true);
    expect(q.getComponentName(), "the default component name again").toBe("default");
  });
});
